/**
 * Database seed script — for development only.
 * Run: npm run db:seed
 *
 * IMPORTANT: These are fictional demo farmers and do NOT represent
 * real registered businesses. For demonstration purposes only.
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as bcrypt from "bcryptjs";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding FarmConnect database...\n");

  try {
    // ── Users ──────────────────────────────────────────────────────────────────
    console.log("Creating users...");
    const passwordHash = await bcrypt.hash("Demo@1234", 12);

    const [adminUser] = await db.insert(schema.users).values({
      name: "Admin User",
      email: "admin@demo.com",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    }).returning().onConflictDoNothing();

    const [buyerUser] = await db.insert(schema.users).values({
      name: "Demo Buyer",
      email: "buyer@demo.com",
      passwordHash,
      role: "BUYER",
      status: "ACTIVE",
    }).returning().onConflictDoNothing();

    const [bulkUser] = await db.insert(schema.users).values({
      name: "Grand Hotel Mangalore",
      email: "bulk@demo.com",
      phone: "8012340001",
      passwordHash,
      role: "BULK_BUYER",
      status: "ACTIVE",
    }).returning().onConflictDoNothing();

    const [josephUser] = await db.insert(schema.users).values({
      name: "Joseph D'Souza",
      email: "farmer@demo.com",
      phone: "9448200001",
      passwordHash,
      role: "FARMER",
      status: "ACTIVE",
    }).returning().onConflictDoNothing();

    const [mariaUser] = await db.insert(schema.users).values({
      name: "Maria Saldanha",
      email: "maria@demo.farmconnect.in",
      phone: "9448200002",
      passwordHash,
      role: "FARMER",
      status: "ACTIVE",
    }).returning().onConflictDoNothing();

    const [antonyUser] = await db.insert(schema.users).values({
      name: "Antony Pais",
      email: "antony@demo.farmconnect.in",
      phone: "9448200003",
      passwordHash,
      role: "FARMER",
      status: "ACTIVE",
    }).returning().onConflictDoNothing();

    const [lakshmiUser] = await db.insert(schema.users).values({
      name: "Lakshmi Shetty",
      email: "lakshmi@demo.farmconnect.in",
      phone: "9448200004",
      passwordHash,
      role: "FARMER",
      status: "ACTIVE",
    }).returning().onConflictDoNothing();

    console.log("✓ Users created");

    if (!josephUser || !mariaUser || !antonyUser || !lakshmiUser) {
      console.log("⚠ Some users already exist — skipping to avoid duplicates");
      await client.end();
      return;
    }

    // ── Farmer Profiles ────────────────────────────────────────────────────────
    console.log("Creating farm profiles...");

    const [josephFarm] = await db.insert(schema.farmers).values({
      userId: josephUser.id,
      farmName: "Joseph's Farm",
      description: "A family-run farm spanning 12 acres in the foothills of Bantwal, specializing in fresh vegetables and tropical fruits using traditional farming methods.",
      address: "Bantwal, Dakshina Kannada, Karnataka",
      latitude: 12.8921,
      longitude: 75.0028,
      verified: true,
      rating: "4.8",
      reviewCount: 47,
      verificationStatus: "VERIFIED",
      coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      profileImage: "https://images.unsplash.com/photo-1592507736547-20dedbef9b32?w=400&q=80",
      farmingPractices: "We use organic-friendly techniques, minimal pesticides, and traditional composting.",
      establishedYear: 2008,
    }).returning();

    const [mariaFarm] = await db.insert(schema.farmers).values({
      userId: mariaUser.id,
      farmName: "Maria's Organic Farm",
      description: "Certified organic farm in Moodbidri growing rare leafy greens, heirloom vegetables, and fresh herbs.",
      address: "Moodbidri, Dakshina Kannada, Karnataka",
      latitude: 13.0641,
      longitude: 74.9931,
      verified: true,
      rating: "4.9",
      reviewCount: 83,
      verificationStatus: "VERIFIED",
      coverImage: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
      profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80",
      farmingPractices: "Fully organic. Zero synthetic pesticides. Rainwater harvesting.",
      establishedYear: 2001,
    }).returning();

    const [antonyFarm] = await db.insert(schema.farmers).values({
      userId: antonyUser.id,
      farmName: "Antony's Agro Farm",
      description: "A modern mixed-crop farm in Puttur focusing on high-demand vegetables, rice varieties, and seasonal produce.",
      address: "Puttur, Dakshina Kannada, Karnataka",
      latitude: 12.7605,
      longitude: 75.2016,
      verified: true,
      rating: "4.6",
      reviewCount: 62,
      verificationStatus: "VERIFIED",
      coverImage: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1200&q=80",
      profileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80",
      farmingPractices: "Integrated pest management, drip irrigation, and seasonal crop rotation.",
      establishedYear: 2009,
    }).returning();

    const [lakshmiFarm] = await db.insert(schema.farmers).values({
      userId: lakshmiUser.id,
      farmName: "Lakshmi Farms",
      description: "Specializing in tropical fruits and spices from the fertile lands near Mangalore.",
      address: "Mangalore Rural, Dakshina Kannada, Karnataka",
      latitude: 12.9141,
      longitude: 74.856,
      verified: true,
      rating: "4.7",
      reviewCount: 39,
      verificationStatus: "VERIFIED",
      coverImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
      profileImage: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&q=80",
      farmingPractices: "Traditional Tulu Nadu farming methods. Natural fertilizers from own cattle.",
      establishedYear: 1995,
    }).returning();

    console.log("✓ Farm profiles created");

    // ── Products ───────────────────────────────────────────────────────────────
    console.log("Creating products...");

    await db.insert(schema.products).values([
      {
        farmerId: josephFarm.id,
        name: "Fresh Tomatoes",
        category: "vegetables",
        description: "Vine-ripened tomatoes harvested this morning. Deep red, firm, and full of flavour.",
        price: "35",
        quantity: 120,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600&q=80",
        harvestDate: new Date().toISOString().split("T")[0],
        status: "AVAILABLE",
      },
      {
        farmerId: josephFarm.id,
        name: "Red Onions",
        category: "vegetables",
        description: "Large, pungent red onions grown without artificial inputs. Excellent shelf life.",
        price: "28",
        quantity: 200,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80",
        harvestDate: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
        status: "AVAILABLE",
      },
      {
        farmerId: mariaFarm.id,
        name: "Organic Spinach",
        category: "leafy",
        description: "Tender, organically grown spinach leaves. Harvested fresh each morning.",
        price: "45",
        quantity: 30,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
        harvestDate: new Date().toISOString().split("T")[0],
        status: "LIMITED",
      },
      {
        farmerId: mariaFarm.id,
        name: "French Beans",
        category: "vegetables",
        description: "Fresh, slender French beans. Crisp texture and excellent flavour. Organically grown.",
        price: "60",
        quantity: 25,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=600&q=80",
        harvestDate: new Date().toISOString().split("T")[0],
        status: "AVAILABLE",
      },
      {
        farmerId: antonyFarm.id,
        name: "Cucumber",
        category: "vegetables",
        description: "Long, crisp cucumbers ideal for salads and cooking.",
        price: "22",
        quantity: 80,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&q=80",
        harvestDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        status: "AVAILABLE",
      },
      {
        farmerId: antonyFarm.id,
        name: "Sona Masoori Rice",
        category: "grains",
        description: "Premium quality Sona Masoori rice. Light, aromatic, and perfect for everyday cooking.",
        price: "58",
        quantity: 500,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
        status: "AVAILABLE",
      },
      {
        farmerId: lakshmiFarm.id,
        name: "Alphonso Mangoes",
        category: "fruits",
        description: "The king of mangoes! Sweet, pulpy Alphonso mangoes from our 30-year-old trees.",
        price: "180",
        quantity: 60,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80",
        harvestDate: new Date().toISOString().split("T")[0],
        status: "LIMITED",
      },
      {
        farmerId: lakshmiFarm.id,
        name: "Nendran Bananas",
        category: "fruits",
        description: "Large, starchy Nendran bananas. Great for cooking or eating ripe.",
        price: "55",
        quantity: 90,
        unit: "dozen",
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80",
        harvestDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        status: "AVAILABLE",
      },
    ]);

    console.log("✓ Products created");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDemo accounts:");
    console.log("  buyer@demo.com   / Demo@1234  (Buyer)");
    console.log("  farmer@demo.com  / Demo@1234  (Farmer)");
    console.log("  bulk@demo.com    / Demo@1234  (Bulk Buyer)");
    console.log("  admin@demo.com   / Demo@1234  (Admin)\n");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
