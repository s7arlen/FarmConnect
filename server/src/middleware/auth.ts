import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "farmconnect-secret-key-change-in-production-2026";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "FARMER" | "BUYER" | "BULK_BUYER" | "ADMIN";
  name: string;
  farmerId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    // For local demonstration convenience, if demo-token-* is passed, authorize as demo
    if (authHeader && authHeader.includes("demo-token-")) {
      const demoRole = authHeader.replace("Bearer demo-token-", "") as any;
      req.user = {
        userId: `demo-${demoRole.toLowerCase()}-1`,
        email: `${demoRole.toLowerCase()}@demo.com`,
        role: demoRole,
        name: `Demo ${demoRole}`,
        farmerId: demoRole === "FARMER" ? "farmer-1" : undefined,
      };
      return next();
    }
    return res.status(401).json({ success: false, error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: "Invalid or expired token" });
  }
}

export function requireRole(allowedRoles: Array<"FARMER" | "BUYER" | "BULK_BUYER" | "ADMIN">) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: requires one of [${allowedRoles.join(", ")}]`,
      });
    }
    next();
  };
}
