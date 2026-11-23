import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = params;

    try {
      const { db } = await import("@/db");
      const { orders, orderItems, products, farmers, users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      const { alias } = await import("drizzle-orm/pg-core");

      const buyerUsers = alias(users, "buyer_users");
      const farmerUsers = alias(users, "farmer_users");

      const [order] = await db
        .select({
          id: orders.id,
          buyerId: orders.buyerId,
          farmerId: orders.farmerId,
          status: orders.status,
          totalAmount: orders.totalAmount,
          fulfillmentMethod: orders.fulfillmentMethod,
          paymentMethod: orders.paymentMethod,
          paymentStatus: orders.paymentStatus,
          paymentReference: orders.paymentReference,
          paidAt: orders.paidAt,
          preferredDate: orders.preferredDate,
          notes: orders.notes,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt,
          farmName: farmers.farmName,
          farmerAddress: farmers.address,
          farmerPhone: farmerUsers.phone,
          farmerEmail: farmerUsers.email,
          buyerName: buyerUsers.name,
          buyerEmail: buyerUsers.email,
          buyerPhone: buyerUsers.phone,
        })
        .from(orders)
        .leftJoin(farmers, eq(orders.farmerId, farmers.id))
        .leftJoin(buyerUsers, eq(orders.buyerId, buyerUsers.id))
        .leftJoin(farmerUsers, eq(farmers.userId, farmerUsers.id))
        .where(eq(orders.id, id));

      if (!order) {
        // Fallback to demo
        const { DEMO_ORDERS } = await import("@/data/demo");
        const demo = DEMO_ORDERS.find((o) => o.id === id);
        if (demo) {
          return NextResponse.json({ order: demo });
        }
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check permission
      if (
        session.role !== "ADMIN" &&
        order.buyerId !== session.userId &&
        order.farmerId !== session.farmerId
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Fetch items
      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          productName: products.name,
          productUnit: products.unit,
          quantity: orderItems.quantity,
          unitPrice: orderItems.unitPrice,
          subtotal: orderItems.subtotal,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, id));

      return NextResponse.json({
        order: {
          ...order,
          items,
        },
      });
    } catch {
      const { DEMO_ORDERS } = await import("@/data/demo");
      const demo = DEMO_ORDERS.find((o) => o.id === id);
      if (demo) {
        return NextResponse.json({ order: demo });
      }
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
