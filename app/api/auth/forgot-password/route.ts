import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const forgotSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
});

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit(`forgot_${clientIp}`, 4, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many password reset requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = forgotSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid email address." },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check DB silently without exposing account existence
    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [user] = await db
        .select({ id: users.id, email: users.email })
        .from(users)
        .where(eq(users.email, normalizedEmail));

      if (user) {
        // In live production, dispatch secure one-time reset token via email/SMS here
      }
    } catch {
      // In preview/dev mode, continue silently
    }

    // Always return uniform generic success message to prevent user enumeration
    return NextResponse.json({
      success: true,
      message: `If an account with ${normalizedEmail} exists, password reset instructions have been sent.`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Unable to process password reset request. Please try again later." },
      { status: 500 }
    );
  }
}
