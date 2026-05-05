import { describe, expect, it } from "vitest";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const hasNeonUrl = process.env.DATABASE_URL?.includes("neon.tech") ?? false;

describe.skipIf(!hasNeonUrl)("database", () => {
  it("connects to Neon and returns SELECT 1", async () => {
    const databaseUrl = process.env.DATABASE_URL;
    expect(databaseUrl).toBeDefined();

    const sql = neon(databaseUrl as string);
    const rows = await sql`SELECT 1 AS one`;
    expect(rows[0]?.one).toBe(1);
  });
});
