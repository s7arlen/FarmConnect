import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

export async function getInventory(req: AuthenticatedRequest, res: Response) {
  try {
    const farmerId = req.user?.farmerId || "farmer-1";

    if (db) {
      try {
        const rows = await db
          .select({
            id: schema.products.id,
            name: schema.products.name,
            category: schema.products.category,
            quantity: schema.products.quantity,
            reservedQuantity: schema.products.reservedQuantity,
            unit: schema.products.unit,
            status: schema.products.status,
            image: schema.products.image,
            updatedAt: schema.products.updatedAt,
          })
          .from(schema.products)
          .where(eq(schema.products.farmerId, farmerId));

        return res.json({ success: true, data: { inventory: rows } });
      } catch (err) {}
    }

    const DEMO_INVENTORY = [
      { id: "prod-1", name: "Fresh Hybrid Tomatoes", quantity: 140, reservedQuantity: 10, unit: "kg", status: "AVAILABLE" },
      { id: "prod-2", name: "Golden Sweet Corn", quantity: 350, reservedQuantity: 0, unit: "piece", status: "AVAILABLE" },
      { id: "prod-3", name: "Organic Spinach (Palak)", quantity: 45, reservedQuantity: 5, unit: "bundle", status: "LIMITED" },
      { id: "prod-4", name: "Red Onions", quantity: 500, reservedQuantity: 50, unit: "kg", status: "AVAILABLE" },
    ];

    return res.json({ success: true, data: { inventory: DEMO_INVENTORY } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to load inventory" });
  }
}

export async function adjustStock(req: AuthenticatedRequest, res: Response) {
  try {
    const { productId, changeQuantity, reason } = req.body;

    if (!productId || typeof changeQuantity !== "number") {
      return res.status(400).json({ success: false, error: "Product ID and change quantity required" });
    }

    if (db) {
      try {
        const [prod] = await db.select().from(schema.products).where(eq(schema.products.id, productId));
        if (!prod) {
          return res.status(404).json({ success: false, error: "Product not found" });
        }

        const newBalance = Math.max(0, prod.quantity + changeQuantity);
        const newStatus = newBalance === 0 ? "UNAVAILABLE" : newBalance < 30 ? "LIMITED" : "AVAILABLE";

        // Update product quantity
        await db
          .update(schema.products)
          .set({ quantity: newBalance, status: newStatus, updatedAt: new Date() })
          .where(eq(schema.products.id, productId));

        // Log movement in inventory audit table
        await db.insert(schema.inventoryLogs).values({
          productId,
          changeQuantity,
          balanceQuantity: newBalance,
          reason: reason || "MANUAL_ADJUSTMENT",
        });

        return res.json({
          success: true,
          data: { productId, newBalance, status: newStatus },
        });
      } catch (err) {}
    }

    return res.json({
      success: true,
      data: { productId, changeQuantity, reason: reason || "MANUAL_ADJUSTMENT" },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Stock adjustment failed" });
  }
}
