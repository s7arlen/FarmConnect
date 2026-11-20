import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types/user";

// Session cookie name
export const SESSION_COOKIE = "farmconnect_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  farmerId?: string; // Set for FARMER role
  exp: number; // Unix timestamp
}

/**
 * Creates a simple session token.
 * In production, replace with JWT (jose) or NextAuth.
 */
export async function createSessionToken(
  payload: Omit<SessionPayload, "exp">
): Promise<string> {
  const sessionData: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  // Base64 encode (not cryptographically signed here — replace with JWT in production)
  return Buffer.from(JSON.stringify(sessionData)).toString("base64");
}

export async function decodeSessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
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
