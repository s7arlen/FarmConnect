import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/farmconnect";

let dbInstance: any = null;
let isConnected = false;

try {
  const client = postgres(connectionString, {
    prepare: false,
    connect_timeout: 3,
  });
  dbInstance = drizzle(client, { schema });
  isConnected = true;
} catch (error) {
  console.warn("⚠️ PostgreSQL connection not active. Server will operate with demo/fallback storage.");
}

export const db = dbInstance;
export const isDbConnected = () => isConnected;
export { schema };
