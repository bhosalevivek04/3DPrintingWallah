import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { createPrismaClientWithUrl, getPrismaClient } from "./prisma";

function redactSecrets(str: string): string {
  // Redact password and sensitive connection details
  return str.replace(/:\/\/([^:]+):([^@]+)@/g, "://$1:***@");
}

async function runConnectivityTest() {
  console.log("=================================================");
  console.log("NewtronLabs Neon PostgreSQL Connectivity Verification");
  console.log("=================================================");

  // 1. Verify Environment Variables are loaded without exposing secrets
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const hasDirectUrl = Boolean(process.env.DIRECT_URL);

  console.log(`DATABASE_URL loaded: ${hasDatabaseUrl ? "YES (configured)" : "NO"}`);
  console.log(`DIRECT_URL loaded:   ${hasDirectUrl ? "YES (configured)" : "NO"}`);

  if (!hasDatabaseUrl && !hasDirectUrl) {
    console.error("FAIL: Neither DATABASE_URL nor DIRECT_URL found in environment.");
    process.exit(1);
  }

  let adapterInitStatus = "FAIL";
  let pooledStatus = "FAIL";
  let directStatus = "FAIL";
  let failureMessage: string | null = null;

  // 2. Test Prisma 7 Neon Adapter Initialization
  try {
    const defaultClient = getPrismaClient();
    if (defaultClient) {
      adapterInitStatus = "PASS";
    } else {
      adapterInitStatus = "FAIL";
      failureMessage = "PrismaClient returned null on initialization.";
    }
  } catch (err) {
    adapterInitStatus = "FAIL";
    failureMessage = `Adapter init failed: ${redactSecrets(err instanceof Error ? err.message : String(err))}`;
  }

  // 3. Test Pooled Connection (DATABASE_URL)
  if (process.env.DATABASE_URL) {
    const pooledClient = createPrismaClientWithUrl(process.env.DATABASE_URL);
    try {
      const start = performance.now();
      await pooledClient.$queryRaw`SELECT 1 as ping`;
      const latencyMs = Math.round(performance.now() - start);
      pooledStatus = `PASS (${latencyMs}ms)`;
    } catch (err) {
      pooledStatus = "FAIL";
      failureMessage = redactSecrets(err instanceof Error ? err.message : String(err));
    } finally {
      await pooledClient.$disconnect().catch(() => {});
    }
  } else {
    pooledStatus = "FAIL (DATABASE_URL not set)";
  }

  // 4. Test Direct Connection (DIRECT_URL)
  if (process.env.DIRECT_URL) {
    const directClient = createPrismaClientWithUrl(process.env.DIRECT_URL);
    try {
      const start = performance.now();
      await directClient.$queryRaw`SELECT 1 as ping`;
      const latencyMs = Math.round(performance.now() - start);
      directStatus = `PASS (${latencyMs}ms)`;
    } catch (err) {
      directStatus = "FAIL";
      if (!failureMessage) {
        failureMessage = redactSecrets(err instanceof Error ? err.message : String(err));
      }
    } finally {
      await directClient.$disconnect().catch(() => {});
    }
  } else {
    directStatus = "FAIL (DIRECT_URL not set)";
  }

  console.log("\n---------------- RESULTS ----------------");
  console.log(`Prisma adapter initialization: ${adapterInitStatus}`);
  console.log(`Pooled connection:             ${pooledStatus}`);
  console.log(`Direct connection:             ${directStatus}`);

  if (failureMessage) {
    console.log(`\nError details (redacted): ${failureMessage}`);
  }
  console.log("-----------------------------------------\n");
}

runConnectivityTest().catch((err) => {
  console.error("Test execution failed:", redactSecrets(err instanceof Error ? err.message : String(err)));
  process.exit(1);
});
