import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  dialect: "mysql",
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "mysql://root@127.0.0.1:3306/ichibot_kanban" },
});
