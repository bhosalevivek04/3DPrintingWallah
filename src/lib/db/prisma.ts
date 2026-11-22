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

function createPrismaClient(customUrl?: string): PrismaClient | null {
  const connectionString = customUrl || process.env.DATABASE_URL;

  // When connection string is not set (e.g. offline local development / prototype mode),
  // return null to prevent PrismaClientInitializationError
  if (!connectionString) {
    return null;
  }

  try {
    // Prisma 7 Neon adapter takes { connectionString } directly
    const adapter = new PrismaNeon({ connectionString });

    return new PrismaClient({
      adapter: adapter as any,
      log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
    });
  } catch (err) {
    console.warn("Failed to initialize PrismaClient with Neon adapter:", err);
    return null;
  }
}

export function createPrismaClientWithUrl(connectionString: string): PrismaClient {
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter: adapter as any,
    log: ["error"],
  });
}

export function getPrismaClient(): PrismaClient | null {
  if (globalForPrisma.prisma !== undefined) {
    return globalForPrisma.prisma;
  }
  globalForPrisma.prisma = createPrismaClient();
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    if (!client) {
      throw new Error("DATABASE_URL is not configured. Prisma Client cannot execute queries.");
    }
    return (client as any)[prop];
  },
});

export async function checkDatabaseConnection(): Promise<{
  isConnected: boolean;
  latencyMs?: number;
  message: string;
}> {
  const client = getPrismaClient();
  if (!process.env.DATABASE_URL || !client) {
    return {
      isConnected: false,
      message: "DATABASE_URL is not configured. Application is running in Mock Prototype mode.",
    };
  }

  const start = performance.now();
  try {
    // Basic ping query to verify connectivity
    await client.$queryRaw`SELECT 1 as ping`;
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
