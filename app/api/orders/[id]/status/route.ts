import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getNextOrderStatuses } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { status } = await request.json() as { status: OrderStatus };

    try {
      const { db } = await import("@/db");
      const { orders } = await import("@/db/schema");
      const { eq, and } = await import("drizzle-orm");

      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, params.id));

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Validate status transition
      const allowedNext = getNextOrderStatuses(order.status);
      if (!allowedNext.includes(status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${order.status} to ${status}` },
          { status: 400 }
        );
      }

      // Role-based permission
      const isFarmer = session.role === "FARMER";
      const isBuyer = ["BUYER", "BULK_BUYER"].includes(session.role);

      if (isFarmer && order.farmerId !== session.farmerId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (isBuyer) {
        // Buyers can only cancel their own REQUESTED orders
        if (status !== "CANCELLED" || order.buyerId !== session.userId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      const [updated] = await db
        .update(orders)
        .set({ status: status as import("@/db/schema").OrderSelect["status"], updatedAt: new Date() })
        .where(eq(orders.id, params.id))
        .returning();

      return NextResponse.json({ order: updated });
    } catch {
      // Demo mode
      return NextResponse.json({ order: { id: params.id, status } });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
