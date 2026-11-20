import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import type { UserRole } from "@/types/user";

// Demo accounts for development
const DEMO_ACCOUNTS: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  farmerId?: string;
}> = [
  {
    id: "demo-buyer-1",
    name: "Demo Buyer",
    email: "buyer@demo.com",
    password: "Demo@1234",
    role: "BUYER",
  },
  {
    id: "demo-farmer-user-1",
    name: "Joseph D'Souza",
    email: "farmer@demo.com",
    password: "Demo@1234",
    role: "FARMER",
    farmerId: "demo-farmer-1",
  },
  {
    id: "demo-admin-1",
    name: "Admin User",
    email: "admin@demo.com",
    password: "Demo@1234",
    role: "ADMIN",
  },
  {
    id: "demo-bulk-1",
    name: "Grand Hotel",
    email: "bulk@demo.com",
    password: "Demo@1234",
    role: "BULK_BUYER",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Try database authentication first
    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      const bcrypt = await import("bcryptjs");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (user) {
        const valid = await bcrypt.default.compare(password, user.passwordHash);
        if (!valid) {
          return NextResponse.json(
            { error: "Incorrect email or password." },
            { status: 401 }
          );
        }

        if (user.status === "SUSPENDED") {
          return NextResponse.json(
            { error: "Your account has been suspended." },
            { status: 403 }
          );
        }

        // Get farmerId if role is FARMER
        let farmerId: string | undefined;
        if (user.role === "FARMER") {
          const { farmers } = await import("@/db/schema");
          const [farmer] = await db
            .select()
            .from(farmers)
            .where(eq(farmers.userId, user.id));
          farmerId = farmer?.id;
        }

        const token = await createSessionToken({
          userId: user.id,
          email: user.email,
          role: user.role as UserRole,
          name: user.name,
          farmerId,
        });

        const response = NextResponse.json({
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });

        return setSessionCookie(response, token);
      }
    } catch {
      // DB not available — fall through to demo accounts
    }

    // Demo accounts fallback
    const demoUser = DEMO_ACCOUNTS.find(
      (u) => u.email === email && u.password === password
    );

    if (!demoUser) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
      name: demoUser.name,
      farmerId: demoUser.farmerId,
    });

    const response = NextResponse.json({
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
      },
    });

    return setSessionCookie(response, token);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
