import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/validations";
import { getSessionFromRequest, requireRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const farmerId = searchParams.get("farmerId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    try {
      const { db } = await import("@/db");
      const { products, farmers, users } = await import("@/db/schema");
      const { eq, and, like, ilike, sql } = await import("drizzle-orm");

      const conditions = [];

      if (category) conditions.push(eq(products.category, category));
      if (farmerId) conditions.push(eq(products.farmerId, farmerId));
      if (search) conditions.push(ilike(products.name, `%${search}%`));

      const rows = await db
        .select({
          id: products.id,
          farmerId: products.farmerId,
          name: products.name,
          category: products.category,
          description: products.description,
          price: products.price,
          quantity: products.quantity,
          unit: products.unit,
          image: products.image,
          harvestDate: products.harvestDate,
          status: products.status,
          createdAt: products.createdAt,
          farmName: farmers.farmName,
          farmerVerified: farmers.verified,
          ownerName: users.name,
        })
        .from(products)
        .leftJoin(farmers, eq(products.farmerId, farmers.id))
        .leftJoin(users, eq(farmers.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
        .offset((page - 1) * limit);

      return NextResponse.json({ products: rows, page, limit });
    } catch {
      // DB not available — return demo data
      const { DEMO_PRODUCTS } = await import("@/data/demo");
      return NextResponse.json({ products: DEMO_PRODUCTS });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["FARMER"]);

    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    try {
      const { db } = await import("@/db");
      const { farmers, products } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      // Get farmer record
      const [farmer] = await db
        .select()
        .from(farmers)
        .where(eq(farmers.userId, session!.userId));

      if (!farmer) {
        return NextResponse.json({ error: "Farm profile not found" }, { status: 404 });
      }

      const [newProduct] = await db
        .insert(products)
        .values({
          farmerId: farmer.id,
          name: result.data.name,
          category: result.data.category,
          description: result.data.description,
          price: result.data.price.toString(),
          quantity: result.data.quantity,
          unit: result.data.unit,
          image: result.data.image || null,
          harvestDate: result.data.harvestDate,
          status: result.data.status,
        })
        .returning();

      return NextResponse.json({ product: newProduct }, { status: 201 });
    } catch {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
