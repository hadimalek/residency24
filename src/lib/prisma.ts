// Re-export of the existing prisma client singleton at src/lib/db.ts.
//
// New code (CMS queries, auth.ts, etc.) imports from "@/lib/prisma".
// Existing code (chat / admin) imports from "@/lib/db".
// Both refer to the same global instance, so there is exactly one PrismaClient
// per Node process.
export { prisma } from "./db";
