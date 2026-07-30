import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = global as unknown as { prisma_v3: PrismaClient }

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres"
  const pool = new Pool({ 
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  })
}

export const prisma = globalForPrisma.prisma_v3 || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v3 = prisma
