import "dotenv/config";
import { defineConfig } from "prisma/config";

const SUPABASE_DB_URL = "postgres://postgres.qyqqzuzoworkectsuwan:Az14012550%23123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || SUPABASE_DB_URL,
  },
});
