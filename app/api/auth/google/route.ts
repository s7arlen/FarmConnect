import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleAuthUrl,
  getBaseUrl,
  OAUTH_STATE_COOKIE,
  isGoogleOAuthConfigured,
} from "@/lib/oauth";
import type { UserRole } from "@/types/user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request);

  try {
    const { searchParams } = request.nextUrl;
    const roleParam = searchParams.get("role")?.toUpperCase();
    const returnTo = searchParams.get("returnTo") || undefined;

    const allowedRoles: UserRole[] = ["BUYER", "FARMER", "BULK_BUYER"];
    const role: UserRole = allowedRoles.includes(roleParam as UserRole)
      ? (roleParam as UserRole)
      : "BUYER";

    if (!isGoogleOAuthConfigured()) {
      return NextResponse.redirect(
        new URL(
          "/login?error=" +
            encodeURIComponent("Google OAuth is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to environment variables."),
          baseUrl
        )
      );
    }

    const { url, stateString, nonce } = await getGoogleAuthUrl({
      role,
      returnTo,
      baseUrl,
    });

    const response = NextResponse.redirect(url);

    // Set short-lived state cookie for CSRF protection
    response.cookies.set(OAUTH_STATE_COOKIE, `${stateString}:${nonce}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error initiating Google OAuth:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_init_failed", baseUrl)
    );
  }
}
