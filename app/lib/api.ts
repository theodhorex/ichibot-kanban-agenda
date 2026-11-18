import type { AgendaRow } from "./agenda-data";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function req<T>(url: string, init: RequestInit = {}, keepalive = true): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      cache: "no-store",
      keepalive: init.method && init.method !== "GET" ? keepalive : undefined,
      headers: init.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new ApiError("Server tidak bisa dihubungi", 0);
  }
  if (!res.ok) {
    let msg = `Galat ${res.status}`;
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new ApiError(msg, res.status);
  }
  return res.json();
}

export const fetchAll = () => req<{ rows: AgendaRow[]; colors: Record<string, string> }>("/api/agenda");

export const putRow = (r: AgendaRow) =>
  req(`/api/agenda/${encodeURIComponent(r.id)}`, { method: "PUT", body: JSON.stringify(r) });

export const deleteRow = (id: string) => req(`/api/agenda/${encodeURIComponent(id)}`, { method: "DELETE" });

export const putColor = (topic: string, color: string) =>
  req("/api/colors", { method: "PUT", body: JSON.stringify({ topic, color }) });

export const importLegacy = (rows: AgendaRow[], colors: Record<string, string>) =>
  req("/api/import", { method: "POST", body: JSON.stringify({ rows, colors }) }, false);
