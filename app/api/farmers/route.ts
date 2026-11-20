import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const verifiedOnly = searchParams.get("verified") === "true";

    try {
      const { db } = await import("@/db");
      const { farmers, users } = await import("@/db/schema");
      const { eq, and, ilike } = await import("drizzle-orm");

      const conditions = [];
      if (verifiedOnly) conditions.push(eq(farmers.verified, true));
      if (search) conditions.push(ilike(farmers.farmName, `%${search}%`));

      const rows = await db
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
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return NextResponse.json({ farmers: rows });
    } catch {
      const { DEMO_FARMERS } = await import("@/data/demo");
      let list = [...DEMO_FARMERS];
      if (verifiedOnly) list = list.filter((f) => f.verified);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (f) =>
            f.farmName.toLowerCase().includes(q) ||
            f.address.toLowerCase().includes(q)
        );
      }
      return NextResponse.json({ farmers: list });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch farmers" }, { status: 500 });
  }
}
