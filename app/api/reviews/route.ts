import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get("farmerId");
    const productId = searchParams.get("productId");

    try {
      const { db } = await import("@/db");
      const { reviews, users } = await import("@/db/schema");
      const { eq, and, desc } = await import("drizzle-orm");

      const conditions = [];
      if (farmerId) conditions.push(eq(reviews.farmerId, farmerId));
      if (productId) conditions.push(eq(reviews.productId, productId));

      const rows = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          buyerName: users.name,
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.buyerId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(reviews.createdAt));

      return NextResponse.json({ reviews: rows });
    } catch {
      const { DEMO_REVIEWS } = await import("@/data/demo");
      let list = [...DEMO_REVIEWS];
      if (farmerId) list = list.filter((r) => r.farmerId === farmerId);
      return NextResponse.json({ reviews: list });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["BUYER", "BULK_BUYER"]);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid review data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, farmerId, productId, rating, comment } = result.data;

    try {
      const { db } = await import("@/db");
      const { reviews, farmers, orders } = await import("@/db/schema");
      const { eq, sql } = await import("drizzle-orm");

      // Verify order is completed
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

      if (order && order.status !== "COMPLETED") {
        return NextResponse.json(
          { error: "Reviews can only be submitted for completed orders" },
          { status: 400 }
        );
      }

      const [newReview] = await db
        .insert(reviews)
        .values({
          buyerId: session!.userId,
          farmerId,
          productId: productId || null,
          orderId,
          rating,
          comment,
        })
        .returning();

      // Recalculate average rating for farmer
      const allFarmerReviews = await db
        .select({ rating: reviews.rating })
        .from(reviews)
        .where(eq(reviews.farmerId, farmerId));

      const totalRating = allFarmerReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = (totalRating / allFarmerReviews.length).toFixed(2);

      await db
        .update(farmers)
        .set({
          rating: avgRating,
          reviewCount: allFarmerReviews.length,
          updatedAt: new Date(),
        })
        .where(eq(farmers.id, farmerId));

      return NextResponse.json({ review: newReview }, { status: 201 });
    } catch {
      // Demo fallback
      return NextResponse.json(
        {
          review: {
            id: `review_${Date.now()}`,
            rating,
            comment,
            buyerName: session!.name,
            createdAt: new Date(),
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
