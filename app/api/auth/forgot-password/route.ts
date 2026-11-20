import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const forgotSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
});

const DEMO_EMAILS = ["buyer@demo.com", "farmer@demo.com", "bulk@demo.com", "admin@demo.com"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid email address." },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check DB if available
    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [user] = await db.select().from(users).where(eq(users.email, email));

      if (!user && !DEMO_EMAILS.includes(email)) {
        return NextResponse.json(
          { error: "No account found with this email address." },
          { status: 404 }
        );
      }
    } catch {
      // Fallback check against demo accounts
      if (!DEMO_EMAILS.includes(email) && !email.includes("@")) {
        return NextResponse.json(
          { error: "No account found with this email address." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Password reset instructions have been sent to ${email}.`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Unable to process password reset request. Please try again later." },
      { status: 500 }
    );
  }
}
