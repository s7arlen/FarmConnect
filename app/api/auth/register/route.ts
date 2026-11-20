import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

// Demo users for development (replace with DB in production)
const DEMO_USERS: Record<string, { id: string; name: string; email: string; role: string; passwordHash: string }> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role } = result.data;

    // Check if email already exists
    const existingUser = Object.values(DEMO_USERS).find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // In production: use db and bcrypt
    // const passwordHash = await bcrypt.hash(password, 12);
    const passwordHash = `hashed_${password}`;

    const userId = `user_${Date.now()}`;
    const newUser = {
      id: userId,
      name,
      email,
      role,
      passwordHash,
    };

    DEMO_USERS[userId] = newUser;

    // Try to use the database if available
    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const bcrypt = await import("bcryptjs");

      const hash = await bcrypt.default.hash(password, 12);
      await db.insert(users).values({
        name,
        email,
        phone: phone || null,
        passwordHash: hash,
        role: role as "BUYER" | "FARMER" | "BULK_BUYER" | "ADMIN",
      });

      // Get the created user
      const { eq } = await import("drizzle-orm");
      const [createdUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

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
      // DB not available — demo mode
    }

    // Demo mode response
    const token = await createSessionToken({
      userId,
      email,
      role: role as import("@/types/user").UserRole,
      name,
    });

    const response = NextResponse.json({
      user: { id: userId, name, email, role },
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
