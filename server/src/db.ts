import { PrismaClient } from "../generated/prisma";

const globalPrisma = new PrismaClient({
  transactionOptions: {
    maxWait: 60000,
    timeout: 60000,
    isolationLevel: "ReadCommitted", // Default isolation level
  },
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

export const prisma = globalPrisma;

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await globalPrisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await globalPrisma.$disconnect();
  process.exit(0);
});
