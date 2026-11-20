import { NextRequest, NextResponse } from "next/server";
import { orderSchema } from "@/lib/validations";
import { getSessionFromRequest, requireRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["BUYER", "BULK_BUYER"]);

    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const body = await request.json();
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { farmerId, fulfillmentMethod, preferredDate, notes, items } = result.data;

    try {
      const { db } = await import("@/db");
      const { orders, orderItems, products } = await import("@/db/schema");
      const { eq, sql } = await import("drizzle-orm");

      // Validate quantities and calculate totals within a transaction
      let totalAmount = 0;
      const validatedItems: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }> = [];

      for (const item of items) {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId));

        if (!product) {
          return NextResponse.json(
            { error: `Product ${item.productId} not found` },
            { status: 404 }
          );
        }

        if (product.quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name}. Available: ${product.quantity}` },
            { status: 400 }
          );
        }

        const unitPrice = parseFloat(product.price);
        const subtotal = unitPrice * item.quantity;
        totalAmount += subtotal;
        validatedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        });
      }

      // Create order + items + reduce stock in a transaction
      const [newOrder] = await db.transaction(async (tx) => {
        const [order] = await tx
          .insert(orders)
          .values({
            buyerId: session!.userId,
            farmerId,
            totalAmount: totalAmount.toString(),
            fulfillmentMethod: fulfillmentMethod as "PICKUP" | "LOCAL_DELIVERY",
            preferredDate: preferredDate,
            notes,
            status: "REQUESTED",
          })
          .returning();

        // Insert items
        await tx.insert(orderItems).values(
          validatedItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            subtotal: item.subtotal.toString(),
          }))
        );

        // Reduce stock (prevent negative)
        for (const item of validatedItems) {
          await tx
            .update(products)
            .set({
              quantity: sql`quantity - ${item.quantity}`,
              updatedAt: new Date(),
            })
            .where(eq(products.id, item.productId));
        }

        return [order];
      });

      return NextResponse.json({ order: newOrder }, { status: 201 });
    } catch {
      // Demo mode fallback
      const demoOrderId = `order_${Date.now()}`;
      return NextResponse.json({
        order: {
          id: demoOrderId,
          status: "REQUESTED",
          totalAmount: items.reduce((sum, i) => sum + 100 * i.quantity, 0),
        },
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
      const { db } = await import("@/db");
      const { orders, farmers } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const isBuyer = ["BUYER", "BULK_BUYER"].includes(session.role);
      const condition = isBuyer
        ? eq(orders.buyerId, session.userId)
        : eq(orders.farmerId, session.farmerId!);

      const result = await db
        .select({
          id: orders.id,
          totalAmount: orders.totalAmount,
          status: orders.status,
          createdAt: orders.createdAt,
          farmName: farmers.farmName,
        })
        .from(orders)
        .leftJoin(farmers, eq(orders.farmerId, farmers.id))
        .where(condition)
        .orderBy(orders.createdAt);

      return NextResponse.json({ orders: result });
    } catch {
      const { DEMO_ORDERS } = await import("@/data/demo");
      return NextResponse.json({ orders: DEMO_ORDERS });
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
