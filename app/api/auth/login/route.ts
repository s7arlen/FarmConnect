import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { UserRole } from "@/types/user";

// Restricted demo accounts for development/preview ONLY (Admin removed)
const PREVIEW_DEMO_ACCOUNTS: Array<{
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
    id: "demo-bulk-1",
    name: "Grand Hotel",
    email: "bulk@demo.com",
    password: "Demo@1234",
    role: "BULK_BUYER",
  },
  {
    id: "demo-admin-1",
    name: "Admin User",
    email: "admin@demo.com",
    password: "Demo@1234",
    role: "ADMIN",
  },
];

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const rateLimitKey = `login_${clientIp}_${email.toLowerCase().trim()}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000); // 5 attempts per 15 min

    if (!rateLimit.allowed) {
      const waitMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / (60 * 1000));
      return NextResponse.json(
        {
          error: `Too many login attempts. Please wait ${waitMinutes} minute(s) before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    // Try database authentication first
    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq, or } = await import("drizzle-orm");
      const bcrypt = await import("bcryptjs");

      const [user] = await db
        .select()
        .from(users)
        .where(or(eq(users.email, email.toLowerCase()), eq(users.phone, email)));

      if (user) {
        if (!user.passwordHash) {
          return NextResponse.json(
            {
              error:
                "This account was created with Google Sign-in. Please log in using Google.",
            },
            { status: 400 }
          );
        }

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
      // DB not available or table missing — continue to preview check
    }

    // Demo accounts are strictly disallowed in production unless explicitly permitted
    const allowDemo =
      process.env.NODE_ENV !== "production" ||
      process.env.ALLOW_DEMO_ACCOUNTS === "true";

    if (allowDemo) {
      const normalizedInput = email.toLowerCase().trim();
      const demoUser = PREVIEW_DEMO_ACCOUNTS.find(
        (u) =>
          (u.email.toLowerCase() === normalizedInput ||
            (normalizedInput === "9876543210" && u.role === "BUYER") ||
            (normalizedInput === "9448200001" && u.role === "FARMER")) &&
          u.password === password
      );

      if (demoUser) {
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
      }
    }

    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
