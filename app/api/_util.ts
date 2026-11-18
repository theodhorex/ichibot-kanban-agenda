import { DbConfigError } from "../db";

const UNREACHABLE = new Set(["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "PROTOCOL_CONNECTION_LOST", "ER_BAD_DB_ERROR"]);
const isUnreachable = (code: string) => UNREACHABLE.has(code) || code.startsWith("ER_ACCESS_DENIED"); // termasuk varian MariaDB

// Drizzle membungkus galat driver di `cause`; telusuri rantainya.
function dbCode(e: unknown): string | undefined {
  for (let cur: unknown = e, i = 0; cur && i < 5; i++) {
    const code = (cur as { code?: unknown }).code;
    if (typeof code === "string" && isUnreachable(code)) return code;
    cur = (cur as { cause?: unknown }).cause;
  }
  return undefined;
}

/** Galat server -> respons JSON. Pesan rinci hanya ke log server, bukan ke klien. */
export function fail(e: unknown) {
  console.error("[api]", e);
  if (e instanceof DbConfigError) return Response.json({ error: e.message, code: "config" }, { status: 503 });
  const code = dbCode(e);
  if (code) return Response.json({ error: "Tidak bisa terhubung ke database", code }, { status: 503 });
  return Response.json({ error: "Galat server" }, { status: 500 });
}

export const bad = (error: string) => Response.json({ error }, { status: 400 });
