import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { computeMatchScore } from "@/lib/matching";
import type { BulkRequest } from "@/types/bulkRequest";

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
      const { bulkRequests, bulkMatches, farmers, products } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [req] = await db
        .select()
        .from(bulkRequests)
        .where(eq(bulkRequests.id, id));

      if (!req) {
        return NextResponse.json({ error: "Requirement not found" }, { status: 404 });
      }

      // Fetch saved matches with farmer details
      const matchesRows = await db
        .select({
          matchId: bulkMatches.id,
          matchScore: bulkMatches.matchScore,
          status: bulkMatches.status,
          farmerId: farmers.id,
          farmName: farmers.farmName,
          address: farmers.address,
          rating: farmers.rating,
          reviewCount: farmers.reviewCount,
          verified: farmers.verified,
        })
        .from(bulkMatches)
        .leftJoin(farmers, eq(bulkMatches.farmerId, farmers.id))
        .where(eq(bulkMatches.requestId, id));

      return NextResponse.json({ request: req, matches: matchesRows });
    } catch {
      // Demo fallback
      const { DEMO_FARMERS, DEMO_PRODUCTS } = await import("@/data/demo");
      const mockReq: BulkRequest = {
        id,
        buyerId: "demo-bulk-1",
        productName: "Fresh Tomatoes",
        quantity: 200,
        unit: "kg",
        maxPrice: 40,
        requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const matches = DEMO_FARMERS.map((farmer) => {
        const farmerProds = DEMO_PRODUCTS.filter((p) => p.farmerId === farmer.id);
        const scored = computeMatchScore(mockReq, farmer as Parameters<typeof computeMatchScore>[1], farmerProds);
        return {
          farmer,
          result: scored,
        };
      }).sort((a, b) => b.result.matchScore - a.result.matchScore);

      return NextResponse.json({ request: mockReq, matches });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requirement" }, { status: 500 });
  }
}
