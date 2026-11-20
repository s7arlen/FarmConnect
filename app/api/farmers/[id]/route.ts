import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { db } = await import("@/db");
    const { farmers, products, reviews, users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const [farmer] = await db
      .select({
        id: farmers.id,
        userId: farmers.userId,
        farmName: farmers.farmName,
        description: farmers.description,
        address: farmers.address,
        latitude: farmers.latitude,
        longitude: farmers.longitude,
        verified: farmers.verified,
        rating: farmers.rating,
        reviewCount: farmers.reviewCount,
        coverImage: farmers.coverImage,
        profileImage: farmers.profileImage,
        farmingPractices: farmers.farmingPractices,
        establishedYear: farmers.establishedYear,
        ownerName: users.name,
      })
      .from(farmers)
      .leftJoin(users, eq(farmers.userId, users.id))
      .where(eq(farmers.id, id));

    if (!farmer) {
      const { DEMO_FARMERS, DEMO_PRODUCTS, DEMO_REVIEWS } = await import("@/data/demo");
      const demo = DEMO_FARMERS.find((f) => f.id === id);
      if (demo) {
        const farmerProducts = DEMO_PRODUCTS.filter((p) => p.farmerId === id);
        const farmerReviews = DEMO_REVIEWS.filter((r) => r.farmerId === id);
        return NextResponse.json({
          farmer: demo,
          products: farmerProducts,
          reviews: farmerReviews,
        });
      }
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
    }

    const farmerProducts = await db
      .select()
      .from(products)
      .where(eq(products.farmerId, id));

    const farmerReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        buyerName: users.name,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.buyerId, users.id))
      .where(eq(reviews.farmerId, id));

    return NextResponse.json({
      farmer,
      products: farmerProducts,
      reviews: farmerReviews,
    });
  } catch {
    const { DEMO_FARMERS, DEMO_PRODUCTS, DEMO_REVIEWS } = await import("@/data/demo");
    const demo = DEMO_FARMERS.find((f) => f.id === id);
    if (demo) {
      const farmerProducts = DEMO_PRODUCTS.filter((p) => p.farmerId === id);
      const farmerReviews = DEMO_REVIEWS.filter((r) => r.farmerId === id);
      return NextResponse.json({
        farmer: demo,
        products: farmerProducts,
        reviews: farmerReviews,
      });
    }
    return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
  }
}
