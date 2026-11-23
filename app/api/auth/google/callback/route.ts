import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  getGoogleUserInfo,
  decodeOAuthState,
  getBaseUrl,
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
  const baseUrl = getBaseUrl(request);
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    console.warn("OAuth authorization failed or was cancelled by user:", oauthError);
    return NextResponse.redirect(
      new URL("/login?error=oauth_cancelled", baseUrl)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_oauth_response", baseUrl)
    );
  }

  // 1. Verify CSRF state: cryptographically verify HMAC signature
  const decodedState = await decodeOAuthState(state);
  if (!decodedState) {
    console.error("OAuth state HMAC signature verification failed or state expired.");
    return NextResponse.redirect(
      new URL("/login?error=oauth_state_invalid", baseUrl)
    );
  }

  // 2. Also check state cookie if present (resilient against mobile cross-site cookie stripping)
  const stateCookie = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (stateCookie) {
    const [cookieState, cookieNonce] = stateCookie.split(":");
    if (cookieState === state && cookieNonce !== decodedState.nonce) {
      console.error("OAuth cookie nonce mismatch");
      return NextResponse.redirect(
        new URL("/login?error=oauth_state_mismatch", baseUrl)
      );
    }
  }

  try {
    // 3. Exchange authorization code for tokens
    const tokens = await exchangeGoogleCode(code, baseUrl);
    if (!tokens?.access_token) {
      console.error("Google returned no access_token during code exchange.");
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", baseUrl)
      );
    }

    // 4. Fetch Google profile
    const googleUser = await getGoogleUserInfo(tokens.access_token);
    if (!googleUser || !googleUser.email) {
      console.error("Failed to retrieve Google user profile info.");
      return NextResponse.redirect(
        new URL("/login?error=failed_to_fetch_profile", baseUrl)
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

    // 5. Database operations (Neon PostgreSQL via Drizzle)
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
            new URL("/login?error=account_suspended", baseUrl)
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

        // Retrieve linked farmer record if role is FARMER
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
      console.warn("DB operation fallback in OAuth callback:", dbError);
      finalUser = {
        id: `google_${googleUser.sub}`,
        email: normalizedEmail,
        name: googleUser.name || "Google User",
        role: targetRole,
        farmerId: targetRole === "FARMER" ? "demo-farmer-1" : undefined,
      };
    }

    // 6. Create cryptographically signed HMAC session token
    const token = await createSessionToken({
      userId: finalUser.id,
      email: finalUser.email,
      name: finalUser.name,
      role: finalUser.role,
      farmerId: finalUser.farmerId,
    });

    // 7. Destination URL
    const destinationPath =
      decodedState.returnTo && decodedState.returnTo.startsWith("/")
        ? decodedState.returnTo
        : DASHBOARD_ROUTES[finalUser.role] || "/buyer/dashboard";

    const response = NextResponse.redirect(new URL(destinationPath, baseUrl));

    // 8. Set HTTP-only session cookie
    setSessionCookie(response, token);

    // 9. Clear OAuth state cookie
    response.cookies.set(OAUTH_STATE_COOKIE, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OAuth callback unhandled error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_processing_failed", baseUrl)
    );
  }
}
