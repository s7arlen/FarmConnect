import type { NextRequest } from "next/server";
import type { UserRole } from "@/types/user";

export const OAUTH_STATE_COOKIE = "farmconnect_oauth_state";

const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  "farmconnect_prod_hmac_sha256_secret_key_2026_secured";

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

/**
 * Resolves the absolute application base URL dynamically across Vercel, proxies, and localhost.
 */
export function getBaseUrl(request?: NextRequest): string {
  // 1. If explicit environment variable is set and not localhost, prioritize it
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    const formatted = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
    return formatted.replace(/\/$/, "");
  }

  // 2. Derive from incoming request headers (handles Vercel reverse proxy / custom domains)
  if (request) {
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");

    if (host) {
      const proto = forwardedProto || (host.includes("localhost") ? "http" : "https");
      return `${proto}://${host}`.replace(/\/$/, "");
    }

    if (request.nextUrl?.origin) {
      return request.nextUrl.origin.replace(/\/$/, "");
    }
  }

  // 3. Check Vercel system deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export function getGoogleRedirectUri(baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;
}

/**
 * Signs data using Web Crypto HMAC-SHA256
 */
async function signState(dataString: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(dataString)
  );
  return Buffer.from(signature).toString("base64url");
}

/**
 * Verifies HMAC-SHA256 signature
 */
async function verifyStateSignature(
  dataString: string,
  signatureB64: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(AUTH_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const signatureBytes = Buffer.from(signatureB64, "base64url");
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(dataString)
    );
  } catch {
    return false;
  }
}

/**
 * Creates a cryptographically signed OAuth state string.
 */
export async function createOAuthState(payload: {
  role?: UserRole;
  returnTo?: string;
}): Promise<{ stateString: string; nonce: string }> {
  const nonce = crypto.randomUUID();
  const stateData: OAuthStatePayload = {
    ...payload,
    nonce,
    timestamp: Date.now(),
  };

  const dataString = Buffer.from(JSON.stringify(stateData)).toString("base64url");
  const signature = await signState(dataString);
  const stateString = `${dataString}.${signature}`;

  return { stateString, nonce };
}

/**
 * Decodes and cryptographically verifies an OAuth state string.
 */
export async function decodeOAuthState(
  stateString: string
): Promise<OAuthStatePayload | null> {
  try {
    if (!stateString || typeof stateString !== "string") return null;

    const parts = stateString.split(".");
    if (parts.length !== 2) return null;

    const [dataString, signature] = parts;
    const isValid = await verifyStateSignature(dataString, signature);
    if (!isValid) {
      console.warn("OAuth state signature verification failed (tampering detected)");
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(dataString, "base64url").toString("utf-8")
    ) as OAuthStatePayload;

    // Reject states older than 15 minutes
    if (Date.now() - payload.timestamp > 15 * 60 * 1000) {
      console.warn("OAuth state expired (> 15 minutes)");
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Failed to decode OAuth state:", error);
    return null;
  }
}

/**
 * Builds the Google OAuth 2.0 authorization URL
 */
export async function getGoogleAuthUrl(options: {
  role?: UserRole;
  returnTo?: string;
  baseUrl: string;
}): Promise<{ url: string; stateString: string; nonce: string }> {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const redirectUri = getGoogleRedirectUri(options.baseUrl);
  const { stateString, nonce } = await createOAuthState({
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
  baseUrl: string
): Promise<{ access_token: string; id_token: string } | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getGoogleRedirectUri(baseUrl);

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
    console.error(`Google token exchange failed (${response.status}):`, errorBody);
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
