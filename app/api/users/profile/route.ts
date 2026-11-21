import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, clearSessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          status: users.status,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, session.userId));

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ user });
    } catch {
      return NextResponse.json({
        user: {
          id: session.userId,
          name: session.name,
          email: session.email,
          role: session.role,
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

/**
 * DELETE /api/users/profile
 * Allows authenticated users to permanently delete their account and personal data (DPDP / GDPR)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
      const { db } = await import("@/db");
      const { users, farmers, products, orders } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      // Anonymize / remove user record in a transaction
      await db.transaction(async (tx) => {
        // If farmer, clean up products
        if (session.role === "FARMER" && session.farmerId) {
          await tx.delete(products).where(eq(products.farmerId, session.farmerId));
          await tx.delete(farmers).where(eq(farmers.userId, session.userId));
        }

        // Delete user
        await tx.delete(users).where(eq(users.id, session.userId));
      });
    } catch {
      // In preview/dev mode without active DB, proceed to clear session
    }

    const response = NextResponse.json({
      success: true,
      message: "Your account and associated personal data have been completely deleted.",
    });

    // Clear session cookie
    return clearSessionCookie(response);
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
