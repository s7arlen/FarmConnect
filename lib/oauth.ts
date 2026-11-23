import type { UserRole } from "@/types/user";

export const OAUTH_STATE_COOKIE = "farmconnect_oauth_state";

export interface GoogleUserInfo {
  sub: string; // Google user ID
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}

export interface OAuthStatePayload {
  nonce: string;
  role?: UserRole;
  returnTo?: string;
  timestamp: number;
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
}

export function getGoogleRedirectUri(origin?: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    origin ||
    "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;
}

/**
 * Encodes the OAuth state with metadata (role, returnTo) into a base64 string
 */
export function createOAuthState(payload: Omit<OAuthStatePayload, "nonce" | "timestamp">): {
  stateString: string;
  nonce: string;
} {
  const nonce = crypto.randomUUID();
  const stateData: OAuthStatePayload = {
    ...payload,
    nonce,
    timestamp: Date.now(),
  };

  const stateString = Buffer.from(JSON.stringify(stateData)).toString("base64url");
  return { stateString, nonce };
}

/**
 * Decodes and validates OAuth state
 */
export function decodeOAuthState(stateString: string): OAuthStatePayload | null {
  try {
    if (!stateString) return null;
    const jsonStr = Buffer.from(stateString, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as OAuthStatePayload;

    // Reject states older than 15 minutes
    if (Date.now() - payload.timestamp > 15 * 60 * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Builds the Google OAuth 2.0 authorization URL
 */
export function getGoogleAuthUrl(options: {
  role?: UserRole;
  returnTo?: string;
  origin?: string;
}): { url: string; stateString: string; nonce: string } {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const redirectUri = getGoogleRedirectUri(options.origin);
  const { stateString, nonce } = createOAuthState({
    role: options.role,
    returnTo: options.returnTo,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: stateString,
  });

  return {
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    stateString,
    nonce,
  };
}

/**
 * Exchanges the Google authorization code for access and ID tokens
 */
export async function exchangeGoogleCode(
  code: string,
  origin?: string
): Promise<{ access_token: string; id_token: string } | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getGoogleRedirectUri(origin);

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials are not configured.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to exchange code with Google:", errorBody);
    return null;
  }

  const data = await response.json();
  return {
    access_token: data.access_token,
    id_token: data.id_token,
  };
}

/**
 * Fetches user profile from Google OpenID Connect userinfo endpoint
 */
export async function getGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo | null> {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch Google userinfo:", await response.text());
    return null;
  }

  return (await response.json()) as GoogleUserInfo;
}
