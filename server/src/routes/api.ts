import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import * as authCtrl from "../controllers/authController";
import * as productCtrl from "../controllers/productController";
import * as inventoryCtrl from "../controllers/inventoryController";
import * as orderCtrl from "../controllers/orderController";
import * as bulkCtrl from "../controllers/bulkController";
import * as reviewCtrl from "../controllers/reviewController";
import * as adminCtrl from "../controllers/adminController";

const router = Router();

// --- Auth Routes ---
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);
router.get("/auth/me", authenticateToken, authCtrl.getMe);

// --- Product Routes ---
router.get("/products", productCtrl.listProducts);
router.post("/products", authenticateToken, requireRole(["FARMER", "ADMIN"]), productCtrl.createProduct);
router.put("/products/:id", authenticateToken, requireRole(["FARMER", "ADMIN"]), productCtrl.updateProduct);
router.delete("/products/:id", authenticateToken, requireRole(["FARMER", "ADMIN"]), productCtrl.deleteProduct);

// --- Inventory & Stock Routes (GoParm Screen 3) ---
router.get("/inventory", authenticateToken, requireRole(["FARMER", "ADMIN"]), inventoryCtrl.getInventory);
router.patch("/inventory/adjust", authenticateToken, requireRole(["FARMER", "ADMIN"]), inventoryCtrl.adjustStock);

// --- Order Routes ---
router.get("/orders", authenticateToken, orderCtrl.listOrders);
router.post("/orders", authenticateToken, orderCtrl.createOrder);
router.patch("/orders/:id/status", authenticateToken, orderCtrl.updateOrderStatus);

// --- Bulk Procurement Routes ---
router.get("/bulk-requirements", authenticateToken, bulkCtrl.listRequirements);
router.post("/bulk-requirements", authenticateToken, requireRole(["BUYER", "BULK_BUYER", "ADMIN"]), bulkCtrl.createRequirement);
router.get("/bulk-requirements/:id/matches", authenticateToken, bulkCtrl.getMatches);

// --- Review Routes ---
router.get("/reviews", reviewCtrl.getFarmerReviews);
router.post("/reviews", authenticateToken, reviewCtrl.createReview);

// --- Admin Routes ---
router.get("/admin/users", authenticateToken, requireRole(["ADMIN"]), adminCtrl.listUsers);
router.patch("/admin/users/:id/status", authenticateToken, requireRole(["ADMIN"]), adminCtrl.toggleUserStatus);
router.patch("/admin/farmers/:id/verify", authenticateToken, requireRole(["ADMIN"]), adminCtrl.verifyFarmer);
router.get("/admin/stats", authenticateToken, requireRole(["ADMIN"]), adminCtrl.getStats);

export default router;
