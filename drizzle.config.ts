import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { parse } from 'pg-connection-string';
dotenv.config();

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: (() => {
    if (process.env.DATABASE_URL) {
      const parsed = parse(process.env.DATABASE_URL);
      return {
        host: parsed.host || "localhost",
        port: parsed.port ? Number(parsed.port) : 5432,
        database: parsed.database || "pension_optimizer",
        user: parsed.user || "postgres",
        password: parsed.password || "",
        ssl: process.env.DB_SSL === "true"
      };
    }
    return {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "pension_optimizer",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl: process.env.DB_SSL === "true"
    };
  })(),
  verbose: true,
  strict: true,
} satisfies Config;
