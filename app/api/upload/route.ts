import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/** Simpan file lampiran ke `public/uploads/` dan kembalikan URL relatif + nama asli. */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ error: "File tidak ditemukan atau kosong" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: "Ukuran file maksimal 10 MB" }, { status: 400 });
    }

    const base = path.basename(file.name).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^\.+/, "") || "file";
    const filename = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}-${base}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

    return Response.json({ url: `/uploads/${filename}`, name: file.name }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Gagal mengunggah file" }, { status: 500 });
  }
}
