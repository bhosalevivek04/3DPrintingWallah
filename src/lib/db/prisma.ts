import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

/**
 * Global singleton for Prisma Client with Neon Serverless WebSocket adapter.
 * Optimized for both Cloudflare Workers edge runtime and Node.js.
 * Returns null when DATABASE_URL is unconfigured to safely enable offline mock mode.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient | null;
};

function createPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;

  // When DATABASE_URL is not set (e.g. offline local development / prototype mode),
  // return null to prevent PrismaClientInitializationError
  if (!connectionString) {
    return null;
  }

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);

    return new PrismaClient({
      adapter: adapter as any,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (err) {
    console.warn("Failed to initialize PrismaClient with Neon adapter:", err);
    return null;
  }
}

export const prisma = globalForPrisma.prisma !== undefined ? globalForPrisma.prisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<{
  isConnected: boolean;
  latencyMs?: number;
  message: string;
}> {
  if (!process.env.DATABASE_URL || !prisma) {
    return {
      isConnected: false,
      message: "DATABASE_URL is not configured. Application is running in Mock Prototype mode.",
    };
  }

  const start = performance.now();
  try {
    // Basic ping query to verify connectivity
    await prisma.$queryRaw`SELECT 1 as ping`;
    const latencyMs = Math.round(performance.now() - start);
    return {
      isConnected: true,
      latencyMs,
      message: `Successfully connected to Neon PostgreSQL (${latencyMs}ms latency).`,
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      isConnected: false,
      latencyMs,
      message: `Failed to connect to Neon PostgreSQL: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
