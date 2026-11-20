import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateToken, AuthenticatedRequest } from "../middleware/auth";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(["FARMER", "BUYER", "BULK_BUYER", "ADMIN"]).default("BUYER"),
  farmName: z.string().optional(),
  address: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: "Validation error", details: parse.error.format() });
    }

    const { name, email, password, phone, role, farmName, address } = parse.data;
    const passwordHash = await bcrypt.hash(password, 10);

    let createdUserId = `user-${Date.now()}`;
    let createdFarmerId: string | undefined;

    if (db) {
      try {
        const [newUser] = await db
          .insert(schema.users)
          .values({
            name,
            email,
            phone,
            passwordHash,
            role,
            status: "ACTIVE",
          })
          .returning();

        createdUserId = newUser.id;

        if (role === "FARMER" && farmName && address) {
          const [farmer] = await db
            .insert(schema.farmerProfiles)
            .values({
              userId: newUser.id,
              farmName,
              address,
            })
            .returning();
          createdFarmerId = farmer.id;
        }
      } catch (dbErr: any) {
        if (dbErr.code === "23505") {
          return res.status(409).json({ success: false, error: "Email already registered" });
        }
      }
    }

    const token = generateToken({
      userId: createdUserId,
      email,
      name,
      role,
      farmerId: createdFarmerId,
    });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: createdUserId, name, email, role, phone, farmerId: createdFarmerId },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: "Invalid email or password format" });
    }

    const { email, password } = parse.data;

    // 1. Check database if available
    if (db) {
      try {
        const [user] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email));

        if (user) {
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (isValid) {
            let farmerId: string | undefined;
            if (user.role === "FARMER") {
              const [farmer] = await db
                .select()
                .from(schema.farmerProfiles)
                .where(eq(schema.farmerProfiles.userId, user.id));
              farmerId = farmer?.id;
            }

            const token = generateToken({
              userId: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              farmerId,
            });

            return res.json({
              success: true,
              data: {
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role, farmerId },
              },
            });
          }
        }
      } catch (dbErr) {
        // Fall through to demo credentials
      }
    }

    // 2. Demo fallback accounts
    const DEMO_LOGINS: Record<string, { role: any; name: string; farmerId?: string }> = {
      "farmer@demo.com": { role: "FARMER", name: "Joseph D'Souza", farmerId: "farmer-1" },
      "buyer@demo.com": { role: "BUYER", name: "Rahul Sharma" },
      "bulk@demo.com": { role: "BULK_BUYER", name: "Grand Heritage Resort" },
      "admin@demo.com": { role: "ADMIN", name: "System Administrator" },
    };

    const demoUser = DEMO_LOGINS[email.toLowerCase()];
    if (demoUser && (password === "Demo@1234" || password === "password")) {
      const token = generateToken({
        userId: `demo-${demoUser.role.toLowerCase()}-1`,
        email,
        name: demoUser.name,
        role: demoUser.role,
        farmerId: demoUser.farmerId,
      });

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: `demo-${demoUser.role.toLowerCase()}-1`,
            name: demoUser.name,
            email,
            role: demoUser.role,
            farmerId: demoUser.farmerId,
          },
        },
      });
    }

    return res.status(401).json({ success: false, error: "Incorrect email or password" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Login failed" });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  return res.json({ success: true, data: { user: req.user } });
}
