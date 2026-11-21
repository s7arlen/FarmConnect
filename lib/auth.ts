import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types/user";

// Session cookie name
export const SESSION_COOKIE = "farmconnect_session";

const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  "farmconnect_prod_hmac_sha256_secret_key_2026_secured";

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  farmerId?: string; // Set for FARMER role
  exp: number; // Unix timestamp
}

/**
 * Signs data using Web Crypto HMAC-SHA256 (compatible with Node.js and Edge Runtime)
 */
async function signPayload(dataString: string): Promise<string> {
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
 * Constant-time verification using Web Crypto API
 */
async function verifySignature(
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
 * Creates a cryptographically signed HMAC-SHA256 session token.
 */
export async function createSessionToken(
  payload: Omit<SessionPayload, "exp">
): Promise<string> {
  const sessionData: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  const dataString = Buffer.from(JSON.stringify(sessionData)).toString("base64url");
  const signature = await signPayload(dataString);
  return `${dataString}.${signature}`;
}

/**
 * Verifies the HMAC-SHA256 signature and expiration of a session token.
 * Rejects unsigned, malformed, or tampered tokens.
 */
export async function decodeSessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 2) {
      return null; // Reject unsigned legacy or malformed tokens
    }

    const [dataString, signature] = parts;
    const isValid = await verifySignature(dataString, signature);

    if (!isValid) {
      return null; // Cryptographic signature mismatch (tampering detected)
    }

    const decoded = JSON.parse(
      Buffer.from(dataString, "base64url").toString("utf-8")
    );

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired session
    }

    return decoded as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSessionToken(token);
}

export function setSessionCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}

export function requireRole(
  session: SessionPayload | null,
  allowedRoles: UserRole[]
): { authorized: boolean; error?: string } {
  if (!session) {
    return { authorized: false, error: "Authentication required" };
  }
  if (!allowedRoles.includes(session.role)) {
    return { authorized: false, error: "Insufficient permissions" };
  }
  return { authorized: true };
}

/**
 * Gets session from a request (for middleware/API routes)
 */
export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSessionToken(token);
}
