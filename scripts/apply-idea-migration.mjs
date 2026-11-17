import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

const MIGRATIONS_DIR = resolve("db/migrations");

async function applyMigrations() {
  if (existsSync(resolve(".env.local"))) {
    process.loadEnvFile(resolve(".env.local"));
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Missing database URL");

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
  const sql = neon(connectionString);

  for (const file of files) {
    const migration = await readFile(resolve(MIGRATIONS_DIR, file), "utf8");
    const statements = migration
      .split(/\r?\n-- migrate:split\r?\n/)
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await sql.query(statement);
    }
    console.log(`Applied ${file}.`);
  }
}

try {
  await applyMigrations();
  console.log("All idea/career migrations applied.");
} catch {
  console.error("Unable to apply migrations.");
  process.exitCode = 1;
}
