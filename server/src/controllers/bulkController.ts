import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { db, schema } from "../db";
import { eq, desc } from "drizzle-orm";
import { computeMatchScore } from "../utils/matching";
import { z } from "zod";

const bulkReqSchema = z.object({
  productName: z.string().min(2),
  quantity: z.number().int().positive(),
  unit: z.string().default("kg"),
  maxPrice: z.number().positive(),
  requiredDate: z.string().min(1),
  notes: z.string().optional(),
});

export async function createRequirement(req: AuthenticatedRequest, res: Response) {
  try {
    const parse = bulkReqSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: "Validation error", details: parse.error.format() });
    }

    const buyerId = req.user?.userId || "user-bulk-1";

    if (db) {
      try {
        const [newReq] = await db
          .insert(schema.bulkRequirements)
          .values({
            buyerId,
            productName: parse.data.productName,
            quantity: parse.data.quantity,
            unit: parse.data.unit,
            maxPrice: parse.data.maxPrice.toString(),
            requiredDate: parse.data.requiredDate,
            notes: parse.data.notes,
            status: "OPEN",
          })
          .returning();

        return res.status(201).json({ success: true, data: { requirement: newReq } });
      } catch (err) {}
    }

    const demoReq = {
      id: `req-${Date.now()}`,
      buyerId,
      ...parse.data,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json({ success: true, data: { requirement: demoReq } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to create bulk requirement" });
  }
}

export async function listRequirements(req: AuthenticatedRequest, res: Response) {
  try {
    if (db) {
      try {
        const rows = await db
          .select({
            id: schema.bulkRequirements.id,
            productName: schema.bulkRequirements.productName,
            quantity: schema.bulkRequirements.quantity,
            unit: schema.bulkRequirements.unit,
            maxPrice: schema.bulkRequirements.maxPrice,
            requiredDate: schema.bulkRequirements.requiredDate,
            status: schema.bulkRequirements.status,
            createdAt: schema.bulkRequirements.createdAt,
            buyerName: schema.users.name,
          })
          .from(schema.bulkRequirements)
          .leftJoin(schema.users, eq(schema.bulkRequirements.buyerId, schema.users.id))
          .orderBy(desc(schema.bulkRequirements.createdAt));

        return res.json({ success: true, data: { requirements: rows } });
      } catch (err) {}
    }

    const DEMO_REQS = [
      {
        id: "req-1",
        productName: "Grade A Tomatoes",
        quantity: 250,
        unit: "kg",
        maxPrice: "30.00",
        requiredDate: "2026-11-26",
        status: "OPEN",
        buyerName: "Grand Heritage Resort",
        matchScore: 92,
      },
      {
        id: "req-2",
        productName: "Red Onions",
        quantity: 500,
        unit: "kg",
        maxPrice: "35.00",
        requiredDate: "2026-11-28",
        status: "MATCHED",
        buyerName: "Coastal Spice Restaurant",
        matchScore: 86,
      },
    ];

    return res.json({ success: true, data: { requirements: DEMO_REQS } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to list requirements" });
  }
}

export async function getMatches(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    // Run deterministic 5-factor scoring
    const demoCandidateFarmers = [
      {
        id: "farmer-1",
        farmName: "Joseph's Agro Farm",
        address: "Bantwal, Dakshina Kannada",
        verified: true,
        rating: 4.8,
      },
      {
        id: "farmer-2",
        farmName: "Maria's Organic Greens",
        address: "Moodbidri, Karnataka",
        verified: true,
        rating: 4.9,
      },
    ];

    const demoCandidateProducts = [
      { id: "p1", farmerId: "farmer-1", name: "Grade A Tomatoes", category: "vegetables", price: 32, quantity: 200, unit: "kg", status: "AVAILABLE" },
      { id: "p2", farmerId: "farmer-2", name: "Red Onions", category: "vegetables", price: 38, quantity: 500, unit: "kg", status: "AVAILABLE" },
    ];

    const targetReq = {
      id,
      productName: "Grade A Tomatoes",
      quantity: 250,
      unit: "kg",
      maxPrice: 30,
      requiredDate: new Date(),
    };

    const matches = demoCandidateFarmers.map((f) => {
      const prods = demoCandidateProducts.filter((p) => p.farmerId === f.id);
      const scored = computeMatchScore(targetReq, f, prods);
      return { farmer: f, ...scored };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return res.json({ success: true, data: { requirementId: id, matches } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to compute matches" });
  }
}
