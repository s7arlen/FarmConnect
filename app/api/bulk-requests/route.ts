import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";
import { bulkRequestSchema } from "@/lib/validations";
import { computeMatchScore } from "@/lib/matching";
import type { BulkRequest } from "@/types/bulkRequest";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
      const { db } = await import("@/db");
      const { bulkRequests, users } = await import("@/db/schema");
      const { eq, desc } = await import("drizzle-orm");

      let query = db
        .select({
          id: bulkRequests.id,
          buyerId: bulkRequests.buyerId,
          productName: bulkRequests.productName,
          quantity: bulkRequests.quantity,
          unit: bulkRequests.unit,
          maxPrice: bulkRequests.maxPrice,
          requiredDate: bulkRequests.requiredDate,
          maxDistance: bulkRequests.maxDistance,
          notes: bulkRequests.notes,
          status: bulkRequests.status,
          createdAt: bulkRequests.createdAt,
          buyerName: users.name,
        })
        .from(bulkRequests)
        .leftJoin(users, eq(bulkRequests.buyerId, users.id))
        .orderBy(desc(bulkRequests.createdAt));

      let rows;
      if (session.role === "BULK_BUYER" || session.role === "BUYER") {
        rows = await query.where(eq(bulkRequests.buyerId, session.userId));
      } else if (session.role === "FARMER") {
        rows = await query.where(eq(bulkRequests.status, "OPEN"));
      } else {
        rows = await query;
      }

      return NextResponse.json({ requests: rows });
    } catch {
      // In-memory demo fallback
      const demoReqs = [
        {
          id: "r1",
          productName: "Fresh Tomatoes",
          quantity: 200,
          unit: "kg",
          maxPrice: "40.00",
          requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "OPEN",
          notes: "Need grade A ripe tomatoes for restaurant supply.",
          matchCount: 3,
          createdAt: new Date(),
        },
        {
          id: "r2",
          productName: "Onions",
          quantity: 100,
          unit: "kg",
          maxPrice: "30.00",
          requiredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "MATCHED",
          notes: "Medium sized red onions.",
          matchCount: 5,
          createdAt: new Date(),
        },
      ];
      return NextResponse.json({ requests: demoReqs });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bulk requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["BUYER", "BULK_BUYER", "ADMIN"]);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const body = await request.json();
    const result = bulkRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid requirement data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const reqData = result.data;

    try {
      const { db } = await import("@/db");
      const { bulkRequests, bulkMatches, farmers, products } = await import("@/db/schema");

      const [newRequest] = await db
        .insert(bulkRequests)
        .values({
          buyerId: session!.userId,
          productName: reqData.productName,
          quantity: reqData.quantity,
          unit: reqData.unit,
          maxPrice: reqData.maxPrice.toString(),
          requiredDate: reqData.requiredDate,
          maxDistance: reqData.maxDistance,
          notes: reqData.notes,
          status: "OPEN",
        })
        .returning();

      // Run matching engine
      const allFarmers = await db.select().from(farmers);
      const allProducts = await db.select().from(products);

      const targetReq: BulkRequest = {
        id: newRequest.id,
        buyerId: session!.userId,
        productName: newRequest.productName,
        quantity: newRequest.quantity,
        unit: newRequest.unit,
        maxPrice: parseFloat(newRequest.maxPrice),
        requiredDate: new Date(newRequest.requiredDate),
        maxDistance: newRequest.maxDistance ?? undefined,
        notes: newRequest.notes ?? undefined,
        status: newRequest.status as BulkRequest["status"],
        createdAt: newRequest.createdAt,
        updatedAt: newRequest.updatedAt,
      };

      const matchedResults = allFarmers
        .map((farmer) => {
          const farmerProds = allProducts.filter((p) => p.farmerId === farmer.id);
          const scored = computeMatchScore(
            targetReq,
            {
              ...farmer,
              rating: parseFloat(farmer.rating),
              description: farmer.description ?? undefined,
              coverImage: farmer.coverImage ?? undefined,
              profileImage: farmer.profileImage ?? undefined,
              farmingPractices: farmer.farmingPractices ?? undefined,
              establishedYear: farmer.establishedYear ?? undefined,
              latitude: farmer.latitude ?? undefined,
              longitude: farmer.longitude ?? undefined,
            } as Parameters<typeof computeMatchScore>[1],
            farmerProds.map((p) => ({
              ...p,
              description: p.description ?? undefined,
              image: p.image ?? undefined,
              price: parseFloat(p.price),
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
              harvestDate: p.harvestDate ? new Date(p.harvestDate) : undefined,
            }))
          );
          return { farmer, ...scored };
        })
        .filter((m) => m.matchScore > 20)
        .sort((a, b) => b.matchScore - a.matchScore);

      // Save top matches
      if (matchedResults.length > 0) {
        await db.insert(bulkMatches).values(
          matchedResults.map((m) => ({
            requestId: newRequest.id,
            farmerId: m.farmerId,
            matchScore: Math.round(m.matchScore),
            status: "PENDING" as const,
          }))
        );
      }

      return NextResponse.json(
        {
          request: newRequest,
          matches: matchedResults,
        },
        { status: 201 }
      );
    } catch {
      // Demo mode matching
      const { DEMO_FARMERS, DEMO_PRODUCTS } = await import("@/data/demo");
      const mockReq: BulkRequest = {
        id: `demo-req-${Date.now()}`,
        buyerId: session!.userId,
        productName: reqData.productName,
        quantity: reqData.quantity,
        unit: reqData.unit,
        maxPrice: reqData.maxPrice,
        requiredDate: new Date(reqData.requiredDate),
        maxDistance: reqData.maxDistance,
        notes: reqData.notes,
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const matchedResults = DEMO_FARMERS.map((farmer) => {
        const farmerProds = DEMO_PRODUCTS.filter((p) => p.farmerId === farmer.id);
        const scored = computeMatchScore(mockReq, farmer as Parameters<typeof computeMatchScore>[1], farmerProds);
        return { farmer, ...scored };
      }).sort((a, b) => b.matchScore - a.matchScore);

      return NextResponse.json(
        {
          request: mockReq,
          matches: matchedResults,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to create bulk requirement" }, { status: 500 });
  }
}
