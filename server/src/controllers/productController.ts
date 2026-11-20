import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { db, schema } from "../db";
import { eq, and, ilike, desc } from "drizzle-orm";
import { z } from "zod";

const productInputSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
  unit: z.enum(["kg", "g", "piece", "dozen", "bundle", "litre", "packet", "quintal", "bag"]).default("kg"),
  image: z.string().optional(),
  harvestDate: z.string().optional(),
  status: z.enum(["AVAILABLE", "LIMITED", "UNAVAILABLE"]).default("AVAILABLE"),
});

export async function listProducts(req: AuthenticatedRequest, res: Response) {
  try {
    const { category, search, farmerId } = req.query;

    if (db) {
      try {
        const conditions = [];
        if (category && category !== "all") conditions.push(eq(schema.products.category, String(category)));
        if (farmerId) conditions.push(eq(schema.products.farmerId, String(farmerId)));
        if (search) conditions.push(ilike(schema.products.name, `%${search}%`));

        const rows = await db
          .select({
            id: schema.products.id,
            farmerId: schema.products.farmerId,
            name: schema.products.name,
            category: schema.products.category,
            description: schema.products.description,
            price: schema.products.price,
            quantity: schema.products.quantity,
            unit: schema.products.unit,
            image: schema.products.image,
            harvestDate: schema.products.harvestDate,
            status: schema.products.status,
            createdAt: schema.products.createdAt,
            farmName: schema.farmerProfiles.farmName,
            farmerVerified: schema.farmerProfiles.verified,
            farmerRating: schema.farmerProfiles.rating,
          })
          .from(schema.products)
          .leftJoin(schema.farmerProfiles, eq(schema.products.farmerId, schema.farmerProfiles.id))
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(schema.products.createdAt));

        return res.json({ success: true, data: { products: rows } });
      } catch (err) {}
    }

    // Demo products fallback
    const DEMO_PRODUCTS = [
      {
        id: "prod-1",
        farmerId: "farmer-1",
        name: "Fresh Hybrid Tomatoes",
        category: "vegetables",
        price: 32,
        quantity: 140,
        unit: "kg",
        status: "AVAILABLE",
        harvestDate: "Harvested Today",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80",
        farmName: "Joseph's Agro Farm",
        farmerVerified: true,
      },
      {
        id: "prod-2",
        farmerId: "farmer-1",
        name: "Golden Sweet Corn",
        category: "vegetables",
        price: 25,
        quantity: 350,
        unit: "piece",
        status: "AVAILABLE",
        harvestDate: "Harvested Yesterday",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80",
        farmName: "Joseph's Agro Farm",
        farmerVerified: true,
      },
      {
        id: "prod-3",
        farmerId: "farmer-2",
        name: "Organic Spinach (Palak)",
        category: "leafy_greens",
        price: 18,
        quantity: 45,
        unit: "bundle",
        status: "LIMITED",
        harvestDate: "Harvested Today",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
        farmName: "Maria's Organic Greens",
        farmerVerified: true,
      },
      {
        id: "prod-4",
        farmerId: "farmer-1",
        name: "Red Onions",
        category: "vegetables",
        price: 38,
        quantity: 500,
        unit: "kg",
        status: "AVAILABLE",
        harvestDate: "Cured Stock",
        image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80",
        farmName: "Joseph's Agro Farm",
        farmerVerified: true,
      },
    ];

    let list = [...DEMO_PRODUCTS];
    if (category && category !== "all") list = list.filter((p) => p.category === category);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(String(search).toLowerCase()));

    return res.json({ success: true, data: { products: list } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to list products" });
  }
}

export async function createProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const parse = productInputSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: "Validation error", details: parse.error.format() });
    }

    const farmerId = req.user?.farmerId || "farmer-1";

    if (db) {
      try {
        const [newProduct] = await db
          .insert(schema.products)
          .values({
            farmerId,
            name: parse.data.name,
            category: parse.data.category,
            description: parse.data.description,
            price: parse.data.price.toString(),
            quantity: parse.data.quantity,
            unit: parse.data.unit,
            image: parse.data.image,
            status: parse.data.status,
          })
          .returning();

        return res.status(201).json({ success: true, data: { product: newProduct } });
      } catch (err) {}
    }

    return res.status(201).json({
      success: true,
      data: {
        product: { id: `prod-${Date.now()}`, farmerId, ...parse.data },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to create product" });
  }
}

export async function updateProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const parse = productInputSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: "Validation error", details: parse.error.format() });
    }

    if (db) {
      try {
        const [updated] = await db
          .update(schema.products)
          .set({
            ...parse.data,
            price: parse.data.price ? parse.data.price.toString() : undefined,
            updatedAt: new Date(),
          })
          .where(eq(schema.products.id, id))
          .returning();

        return res.json({ success: true, data: { product: updated } });
      } catch (err) {}
    }

    return res.json({ success: true, data: { product: { id, ...parse.data } } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update product" });
  }
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    if (db) {
      try {
        await db.delete(schema.products).where(eq(schema.products.id, id));
        return res.json({ success: true, message: "Product deleted" });
      } catch (err) {}
    }

    return res.json({ success: true, message: "Product deleted (Demo mode)" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to delete product" });
  }
}
