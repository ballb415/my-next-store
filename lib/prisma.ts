import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = global as unknown as { prisma_v3: PrismaClient }

const SUPABASE_DB_URL = "postgres://postgres:Az14012550%23123@db.qyqqzuzoworkectsuwan.supabase.co:5432/postgres"

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || SUPABASE_DB_URL
  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false },
  })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  })
}

export const prisma = globalForPrisma.prisma_v3 || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v3 = prisma
