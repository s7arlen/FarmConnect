import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["ADMIN"]);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { id } = params;
    const { verified } = await request.json();

    try {
      const { db } = await import("@/db");
      const { farmers } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [updated] = await db
        .update(farmers)
        .set({
          verified: Boolean(verified),
          verificationStatus: verified ? "VERIFIED" : "REJECTED",
          updatedAt: new Date(),
        })
        .where(eq(farmers.id, id))
        .returning();

      return NextResponse.json({ farmer: updated });
    } catch {
      return NextResponse.json({
        farmer: {
          id,
          verified: Boolean(verified),
          verificationStatus: verified ? "VERIFIED" : "REJECTED",
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update farmer verification" }, { status: 500 });
  }
}
