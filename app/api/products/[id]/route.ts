import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/validations";
import { getSessionFromRequest, requireRole } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { db } = await import("@/db");
    const { products, farmers, users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const [row] = await db
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
        updatedAt: products.updatedAt,
        farmName: farmers.farmName,
        farmerAddress: farmers.address,
        farmerRating: farmers.rating,
        farmerVerified: farmers.verified,
        farmerPhone: users.phone,
        ownerName: users.name,
      })
      .from(products)
      .leftJoin(farmers, eq(products.farmerId, farmers.id))
      .leftJoin(users, eq(farmers.userId, users.id))
      .where(eq(products.id, id));

    if (!row) {
      // Check demo products fallback
      const { DEMO_PRODUCTS, DEMO_FARMERS } = await import("@/data/demo");
      const demoProd = DEMO_PRODUCTS.find((p) => p.id === id);
      if (demoProd) {
        const demoFarmer = DEMO_FARMERS.find((f) => f.id === demoProd.farmerId);
        return NextResponse.json({
          product: {
            ...demoProd,
            farmName: demoFarmer?.farmName || "Demo Farm",
            farmerAddress: demoFarmer?.address || "Goa, India",
            farmerRating: demoFarmer?.rating || 4.5,
            farmerVerified: demoFarmer?.verified || true,
          },
        });
      }
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: row });
  } catch {
    const { DEMO_PRODUCTS, DEMO_FARMERS } = await import("@/data/demo");
    const demoProd = DEMO_PRODUCTS.find((p) => p.id === id);
    if (demoProd) {
      const demoFarmer = DEMO_FARMERS.find((f) => f.id === demoProd.farmerId);
      return NextResponse.json({
        product: {
          ...demoProd,
          farmName: demoFarmer?.farmName || "Demo Farm",
          farmerAddress: demoFarmer?.address || "Goa, India",
          farmerRating: demoFarmer?.rating || 4.5,
          farmerVerified: demoFarmer?.verified || true,
        },
      });
    }
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["FARMER", "ADMIN"]);

    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { id } = params;
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
      const { products, farmers } = await import("@/db/schema");
      const { eq, and } = await import("drizzle-orm");

      // Verify ownership if not ADMIN
      if (session!.role === "FARMER") {
        const [farmer] = await db
          .select()
          .from(farmers)
          .where(eq(farmers.userId, session!.userId));

        if (!farmer) {
          return NextResponse.json({ error: "Farm profile not found" }, { status: 404 });
        }

        const [product] = await db
          .select()
          .from(products)
          .where(and(eq(products.id, id), eq(products.farmerId, farmer.id)));

        if (!product) {
          return NextResponse.json(
            { error: "Product not found or unauthorized to edit" },
            { status: 403 }
          );
        }
      }

      const [updated] = await db
        .update(products)
        .set({
          name: result.data.name,
          category: result.data.category,
          description: result.data.description,
          price: result.data.price.toString(),
          quantity: result.data.quantity,
          unit: result.data.unit,
          image: result.data.image || null,
          harvestDate: result.data.harvestDate,
          status: result.data.status,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      return NextResponse.json({ product: updated });
    } catch {
      // In demo mode without DB, return success with updated data
      return NextResponse.json({
        product: { id, ...result.data, updatedAt: new Date() },
        message: "Updated in demo mode",
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["FARMER", "ADMIN"]);

    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { quantity, delta, status } = body;

    try {
      const { db } = await import("@/db");
      const { products, farmers } = await import("@/db/schema");
      const { eq, and } = await import("drizzle-orm");

      // Verify ownership if FARMER
      if (session!.role === "FARMER") {
        const [farmer] = await db
          .select()
          .from(farmers)
          .where(eq(farmers.userId, session!.userId));

        if (!farmer) {
          return NextResponse.json({ error: "Farm profile not found" }, { status: 404 });
        }

        const [existing] = await db
          .select()
          .from(products)
          .where(and(eq(products.id, id), eq(products.farmerId, farmer.id)));

        if (!existing) {
          return NextResponse.json(
            { error: "Product not found or unauthorized" },
            { status: 403 }
          );
        }

        let newQty = existing.quantity;
        if (typeof quantity === "number") {
          newQty = Math.max(0, quantity);
        } else if (typeof delta === "number") {
          newQty = Math.max(0, existing.quantity + delta);
        }

        const computedStatus =
          status || (newQty === 0 ? "UNAVAILABLE" : newQty < 30 ? "LIMITED" : "AVAILABLE");

        const [updated] = await db
          .update(products)
          .set({
            quantity: newQty,
            status: computedStatus,
            updatedAt: new Date(),
          })
          .where(eq(products.id, id))
          .returning();

        return NextResponse.json({ product: updated, success: true });
      }

      // Admin update
      const [updated] = await db
        .update(products)
        .set({
          ...(typeof quantity === "number" && { quantity: Math.max(0, quantity) }),
          ...(status && { status }),
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      return NextResponse.json({ product: updated, success: true });
    } catch {
      // Demo fallback
      let newQty = typeof quantity === "number" ? Math.max(0, quantity) : 100;
      if (typeof delta === "number") newQty = Math.max(0, newQty + delta);
      const computedStatus = status || (newQty === 0 ? "UNAVAILABLE" : newQty < 30 ? "LIMITED" : "AVAILABLE");
      return NextResponse.json({
        product: { id, quantity: newQty, status: computedStatus, updatedAt: new Date() },
        success: true,
        message: "Updated in demo mode",
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to adjust stock" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    const { authorized, error } = requireRole(session, ["FARMER", "ADMIN"]);

    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { id } = params;

    try {
      const { db } = await import("@/db");
      const { products, farmers } = await import("@/db/schema");
      const { eq, and } = await import("drizzle-orm");

      if (session!.role === "FARMER") {
        const [farmer] = await db
          .select()
          .from(farmers)
          .where(eq(farmers.userId, session!.userId));

        if (!farmer) {
          return NextResponse.json({ error: "Farm profile not found" }, { status: 404 });
        }

        const [product] = await db
          .select()
          .from(products)
          .where(and(eq(products.id, id), eq(products.farmerId, farmer.id)));

        if (!product) {
          return NextResponse.json(
            { error: "Product not found or unauthorized to delete" },
            { status: 403 }
          );
        }
      }

      await db.delete(products).where(eq(products.id, id));
      return NextResponse.json({ success: true, message: "Product deleted" });
    } catch {
      return NextResponse.json({ success: true, message: "Deleted (demo mode)" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
