import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  getGoogleUserInfo,
  decodeOAuthState,
  OAUTH_STATE_COOKIE,
} from "@/lib/oauth";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import type { UserRole } from "@/types/user";

export const dynamic = "force-dynamic";

const DASHBOARD_ROUTES: Record<string, string> = {
  FARMER: "/farmer/dashboard",
  BUYER: "/buyer/dashboard",
  BULK_BUYER: "/bulk-buyer/dashboard",
  ADMIN: "/admin/dashboard",
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    console.warn("OAuth authorization failed or was cancelled:", oauthError);
    return NextResponse.redirect(
      new URL("/login?error=oauth_cancelled", request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_oauth_response", request.url)
    );
  }

  // Verify CSRF state cookie
  const stateCookie = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!stateCookie) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_session_expired", request.url)
    );
  }

  const [cookieState, cookieNonce] = stateCookie.split(":");
  if (cookieState !== state) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_state_mismatch", request.url)
    );
  }

  const decodedState = decodeOAuthState(state);
  if (!decodedState || decodedState.nonce !== cookieNonce) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_state_invalid", request.url)
    );
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokens = await exchangeGoogleCode(code, origin);
    if (!tokens?.access_token) {
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", request.url)
      );
    }

    // 2. Fetch Google profile
    const googleUser = await getGoogleUserInfo(tokens.access_token);
    if (!googleUser || !googleUser.email) {
      return NextResponse.redirect(
        new URL("/login?error=failed_to_fetch_profile", request.url)
      );
    }

    const normalizedEmail = googleUser.email.toLowerCase().trim();
    const targetRole: UserRole = decodedState.role || "BUYER";
    let finalUser: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      farmerId?: string;
    };

    // 3. Database operations
    try {
      const { db } = await import("@/db");
      const { users, farmers } = await import("@/db/schema");
      const { eq, or } = await import("drizzle-orm");

      // Check if user exists by googleId or email
      const [existingUser] = await db
        .select()
        .from(users)
        .where(
          or(
            eq(users.googleId, googleUser.sub),
            eq(users.email, normalizedEmail)
          )
        );

      if (existingUser) {
        if (existingUser.status === "SUSPENDED") {
          return NextResponse.redirect(
            new URL("/login?error=account_suspended", request.url)
          );
        }

        // Link googleId or update avatar/emailVerified if missing
        const updates: Record<string, unknown> = {
          updatedAt: new Date(),
        };
        if (!existingUser.googleId) {
          updates.googleId = googleUser.sub;
          updates.authProvider = "google";
        }
        if (!existingUser.avatar && googleUser.picture) {
          updates.avatar = googleUser.picture;
        }
        if (!existingUser.emailVerified) {
          updates.emailVerified = new Date();
        }

        if (Object.keys(updates).length > 1) {
          await db
            .update(users)
            .set(updates)
            .where(eq(users.id, existingUser.id));
        }

        // Check if farmer profile exists
        let farmerId: string | undefined;
        if (existingUser.role === "FARMER") {
          const [farmerProfile] = await db
            .select()
            .from(farmers)
            .where(eq(farmers.userId, existingUser.id));
          farmerId = farmerProfile?.id;
        }

        finalUser = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role as UserRole,
          farmerId,
        };
      } else {
        // Register new user via Google OAuth
        const [createdUser] = await db
          .insert(users)
          .values({
            name: googleUser.name || "Google User",
            email: normalizedEmail,
            avatar: googleUser.picture || null,
            role: targetRole,
            googleId: googleUser.sub,
            authProvider: "google",
            status: "ACTIVE",
            emailVerified: new Date(),
          })
          .returning();

        let farmerId: string | undefined;
        if (targetRole === "FARMER") {
          const [createdFarmer] = await db
            .insert(farmers)
            .values({
              userId: createdUser.id,
              farmName: `${createdUser.name}'s Farm`,
              address: "Location pending update",
              verified: false,
              verificationStatus: "PENDING",
            })
            .returning();
          farmerId = createdFarmer?.id;
        }

        finalUser = {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          role: targetRole,
          farmerId,
        };
      }
    } catch (dbError) {
      console.warn("DB operation failed, using preview session fallback:", dbError);
      // Fallback preview session
      finalUser = {
        id: `google_${googleUser.sub}`,
        email: normalizedEmail,
        name: googleUser.name || "Google User",
        role: targetRole,
        farmerId: targetRole === "FARMER" ? "demo-farmer-1" : undefined,
      };
    }

    // 4. Create cryptographically signed HMAC session token
    const token = await createSessionToken({
      userId: finalUser.id,
      email: finalUser.email,
      name: finalUser.name,
      role: finalUser.role,
      farmerId: finalUser.farmerId,
    });

    // 5. Destination URL
    const destinationPath =
      decodedState.returnTo && decodedState.returnTo.startsWith("/")
        ? decodedState.returnTo
        : DASHBOARD_ROUTES[finalUser.role] || "/buyer/dashboard";

    const response = NextResponse.redirect(new URL(destinationPath, request.url));

    // 6. Set HTTP-only session cookie
    setSessionCookie(response, token);

    // 7. Clear OAuth state cookie
    response.cookies.set(OAUTH_STATE_COOKIE, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_processing_failed", request.url)
    );
  }
}
