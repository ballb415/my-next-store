import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = global as unknown as { prisma_v3: PrismaClient }

const SUPABASE_DB_URL = "postgres://postgres.qyqqzuzoworkectsuwan:Az14012550%23123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

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
