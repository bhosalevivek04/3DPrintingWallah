import { checkDatabaseConnection } from "./prisma";

async function main() {
  console.log("Checking NewtronLabs database connectivity...");
  const result = await checkDatabaseConnection();
  console.log("Status:", result.isConnected ? "CONNECTED" : "OFFLINE / MOCK MODE");
  console.log("Details:", result.message);
  if (result.latencyMs !== undefined) {
    console.log("Latency:", `${result.latencyMs}ms`);
  }
}

main().catch((err) => {
  console.error("Connectivity check unexpected error:", err);
  process.exit(1);
});
