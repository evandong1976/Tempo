import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load Next.js local env file for Prisma CLI usage
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
