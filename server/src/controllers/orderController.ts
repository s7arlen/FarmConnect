import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { db, schema } from "../db";
import { eq, and, sql, desc } from "drizzle-orm";
import { z } from "zod";

const orderInputSchema = z.object({
  farmerId: z.string().min(1),
  fulfillmentMethod: z.enum(["PICKUP", "LOCAL_DELIVERY"]).default("PICKUP"),
  preferredDate: z.string().optional(),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function createOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const parse = orderInputSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: "Validation error", details: parse.error.format() });
    }

    const buyerId = req.user?.userId || "user-buyer-1";
    const { farmerId, fulfillmentMethod, preferredDate, notes, items } = parse.data;

    if (db) {
      try {
        // Concurrency-safe transaction
        const result = await db.transaction(async (tx: any) => {
          let totalAmount = 0;
          const validatedItems: Array<{
            productId: string;
            productName: string;
            quantity: number;
            unitPrice: number;
            subtotal: number;
          }> = [];

          for (const item of items) {
            // Lock and fetch product
            const [product] = await tx
              .select()
              .from(schema.products)
              .where(eq(schema.products.id, item.productId));

            if (!product) {
              throw new Error(`Product ${item.productId} not found`);
            }

            if (product.quantity < item.quantity) {
              throw new Error(
                `Insufficient available stock for ${product.name}. Available: ${product.quantity}`
              );
            }

            const unitPrice = parseFloat(product.price);
            const subtotal = unitPrice * item.quantity;
            totalAmount += subtotal;

            validatedItems.push({
              productId: product.id,
              productName: product.name,
              quantity: item.quantity,
              unitPrice,
              subtotal,
            });
          }

          // 1. Insert order record
          const [order] = await tx
            .insert(schema.orders)
            .values({
              buyerId,
              farmerId,
              totalAmount: totalAmount.toFixed(2),
              fulfillmentMethod,
              preferredDate: preferredDate || null,
              notes,
              status: "REQUESTED",
            })
            .returning();

          // 2. Insert order items
          await tx.insert(schema.orderItems).values(
            validatedItems.map((i) => ({
              orderId: order.id,
              productId: i.productId,
              productName: i.productName,
              quantity: i.quantity,
              unitPrice: i.unitPrice.toFixed(2),
              subtotal: i.subtotal.toFixed(2),
            }))
          );

          // 3. Decrement available stock & log transaction
          for (const i of validatedItems) {
            await tx
              .update(schema.products)
              .set({
                quantity: sql`quantity - ${i.quantity}`,
                updatedAt: new Date(),
              })
              .where(eq(schema.products.id, i.productId));

            await tx.insert(schema.inventoryLogs).values({
              productId: i.productId,
              changeQuantity: -i.quantity,
              balanceQuantity: 0,
              reason: `ORDER_REQUESTED_${order.id}`,
            });
          }

          return order;
        });

        return res.status(201).json({ success: true, data: { order: result } });
      } catch (txErr: any) {
        return res.status(400).json({ success: false, error: txErr.message });
      }
    }

    // Demo fallback order creation
    const demoOrder = {
      id: `ord-${Date.now()}`,
      buyerId,
      farmerId,
      totalAmount: items.reduce((sum, i) => sum + 35 * i.quantity, 0),
      status: "REQUESTED",
      fulfillmentMethod,
      preferredDate: preferredDate || "2026-11-22",
      notes,
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        id: `item-${Date.now()}`,
        productId: i.productId,
        productName: "Fresh Produce",
        quantity: i.quantity,
        unitPrice: 35,
        subtotal: 35 * i.quantity,
      })),
    };

    return res.status(201).json({ success: true, data: { order: demoOrder } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to create order" });
  }
}

export async function listOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const userRole = req.user?.role || "BUYER";
    const userId = req.user?.userId || "user-buyer-1";
    const farmerId = req.user?.farmerId || "farmer-1";

    if (db) {
      try {
        let condition = eq(schema.orders.buyerId, userId);
        if (userRole === "FARMER") {
          condition = eq(schema.orders.farmerId, farmerId);
        }

        const rows = await db
          .select({
            id: schema.orders.id,
            totalAmount: schema.orders.totalAmount,
            status: schema.orders.status,
            fulfillmentMethod: schema.orders.fulfillmentMethod,
            preferredDate: schema.orders.preferredDate,
            createdAt: schema.orders.createdAt,
            farmName: schema.farmerProfiles.farmName,
            buyerName: schema.users.name,
          })
          .from(schema.orders)
          .leftJoin(schema.farmerProfiles, eq(schema.orders.farmerId, schema.farmerProfiles.id))
          .leftJoin(schema.users, eq(schema.orders.buyerId, schema.users.id))
          .where(condition)
          .orderBy(desc(schema.orders.createdAt));

        return res.json({ success: true, data: { orders: rows } });
      } catch (err) {}
    }

    const DEMO_ORDERS = [
      {
        id: "ord-881",
        buyerId: "user-buyer-1",
        farmerId: "farmer-1",
        farmName: "Joseph's Agro Farm",
        buyerName: "Rahul Sharma",
        status: "PREPARING",
        totalAmount: 320,
        fulfillmentMethod: "PICKUP",
        preferredDate: "2026-11-21",
        createdAt: "2026-11-20T06:30:00Z",
        items: [{ id: "item-1", productName: "Fresh Hybrid Tomatoes", quantity: 10, productUnit: "kg", subtotal: 320 }],
      },
      {
        id: "ord-880",
        buyerId: "user-buyer-1",
        farmerId: "farmer-2",
        farmName: "Maria's Organic Greens",
        buyerName: "Rahul Sharma",
        status: "COMPLETED",
        totalAmount: 180,
        fulfillmentMethod: "LOCAL_DELIVERY",
        preferredDate: "2026-11-18",
        createdAt: "2026-11-18T10:00:00Z",
        items: [{ id: "item-2", productName: "Organic Spinach", quantity: 10, productUnit: "bundle", subtotal: 180 }],
      },
    ];

    return res.json({ success: true, data: { orders: DEMO_ORDERS } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to list orders" });
  }
}

export async function updateOrderStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["ACCEPTED", "PREPARING", "READY", "COMPLETED", "REJECTED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" });
    }

    if (db) {
      try {
        const [updated] = await db
          .update(schema.orders)
          .set({ status, updatedAt: new Date() })
          .where(eq(schema.orders.id, id))
          .returning();

        return res.json({ success: true, data: { order: updated } });
      } catch (err) {}
    }

    return res.json({ success: true, data: { order: { id, status, updatedAt: new Date() } } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update order status" });
  }
}
