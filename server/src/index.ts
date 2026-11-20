import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/api";
import { isDbConnected } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Request logger for demonstration transparency
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString().split("T")[1].slice(0, 8)}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "FarmConnect REST API",
    version: "1.0.0",
    databaseConnected: isDbConnected(),
    timestamp: new Date().toISOString(),
  });
});

// Mount API v1
app.use("/api/v1", apiRouter);

// Centralized error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`\n🌾 FarmConnect Backend running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/v1\n`);
});

export default app;
