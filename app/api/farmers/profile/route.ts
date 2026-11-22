import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";
import { farmProfileSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["FARMER"]);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    try {
      const { db } = await import("@/db");
      const { farmers } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [farmer] = await db
        .select()
        .from(farmers)
        .where(eq(farmers.userId, session!.userId));

      if (!farmer) {
        return NextResponse.json({ error: "Farm profile not found" }, { status: 404 });
      }

      return NextResponse.json({ farmer });
    } catch {
      const { DEMO_FARMERS } = await import("@/data/demo");
      const demo = DEMO_FARMERS[0];
      return NextResponse.json({ farmer: demo });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["FARMER"]);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const body = await request.json();
    const result = farmProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid farm profile data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    try {
      const { db } = await import("@/db");
      const { farmers } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [existingFarmer] = await db
        .select()
        .from(farmers)
        .where(eq(farmers.userId, session!.userId));

      let savedFarmer;
      if (existingFarmer) {
        const [updated] = await db
          .update(farmers)
          .set({
            farmName: result.data.farmName,
            description: result.data.description,
            address: result.data.address,
            farmingPractices: result.data.farmingPractices,
            establishedYear: result.data.establishedYear,
            coverImage: result.data.coverImage || undefined,
            profileImage: result.data.profileImage || undefined,
            updatedAt: new Date(),
          })
          .where(eq(farmers.userId, session!.userId))
          .returning();
        savedFarmer = updated;
      } else {
        const [inserted] = await db
          .insert(farmers)
          .values({
            userId: session!.userId,
            farmName: result.data.farmName,
            description: result.data.description,
            address: result.data.address,
            farmingPractices: result.data.farmingPractices,
            establishedYear: result.data.establishedYear,
            coverImage: result.data.coverImage || undefined,
            profileImage: result.data.profileImage || undefined,
            verified: false,
            verificationStatus: "PENDING",
          })
          .returning();
        savedFarmer = inserted;
      }

      return NextResponse.json({ farmer: savedFarmer, message: "Profile updated successfully" });
    } catch {
      return NextResponse.json({
        farmer: { ...result.data, updatedAt: new Date() },
        message: "Profile updated (demo mode)",
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update farm profile" }, { status: 500 });
  }
}
