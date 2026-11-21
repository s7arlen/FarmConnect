import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

// In-memory demo users cache for preview environment
const DEMO_USERS: Record<
  string,
  { id: string; name: string; email: string; role: string; passwordHash: string }
> = {};

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit(`register_${clientIp}`, 5, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      const waitMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / (60 * 1000));
      return NextResponse.json(
        {
          error: `Too many registration attempts. Please wait ${waitMinutes} minute(s).`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists in preview cache
    const existingUser = Object.values(DEMO_USERS).find(
      (u) => u.email === normalizedEmail
    );
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = `user_${Date.now()}`;

    // Try to use the database if available
    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      // Check DB uniqueness
      const [existingDbUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail));

      if (existingDbUser) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      await db.insert(users).values({
        name,
        email: normalizedEmail,
        phone: phone || null,
        passwordHash,
        role: role as "BUYER" | "FARMER" | "BULK_BUYER",
      });

      const [createdUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail));

      const token = await createSessionToken({
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role as import("@/types/user").UserRole,
        name: createdUser.name,
      });

      const response = NextResponse.json({
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
        },
      });

      return setSessionCookie(response, token);
    } catch {
      // DB not available — fallback to preview mode
    }

    DEMO_USERS[userId] = {
      id: userId,
      name,
      email: normalizedEmail,
      role,
      passwordHash,
    };

    const token = await createSessionToken({
      userId,
      email: normalizedEmail,
      role: role as import("@/types/user").UserRole,
      name,
    });

    const response = NextResponse.json({
      user: { id: userId, name, email: normalizedEmail, role },
    });

    return setSessionCookie(response, token);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
