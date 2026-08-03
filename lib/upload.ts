import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = process.cwd() + "/public/uploads";

/** Persist an uploaded file to /public/uploads and return its public URL. */
export async function saveUpload(file: File, folder = "general"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/\.[^.]+$/, (m) => m.toLowerCase())
    .slice(0, 80);
  const ext = sanitizedName.split(".").pop()?.toLowerCase() ?? "bin";
  const allowed = ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg", "pdf"];
  if (!allowed.includes(ext)) throw new Error(`File type ".${ext}" is not allowed`);

  const maxBytes = 8 * 1024 * 1024;
  if (buffer.length > maxBytes) throw new Error("File exceeds the 8 MB limit");

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${id}.${ext}`;
  const dir = `${UPLOAD_DIR}/${folder}`;
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/${filename}`, buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function removeUpload(path: string) {
  const { unlink } = await import("node:fs/promises");
  if (!path.startsWith("/uploads/")) return;
  try {
    await unlink(process.cwd() + "/public" + path);
  } catch {
    /* file already gone */
  }
}

export async function listUploads(folder?: string): Promise<{ url: string; name: string; size: number; modified: Date }[]> {
  const { readdir, stat } = await import("node:fs/promises");
  const dir = folder ? `${UPLOAD_DIR}/${folder}` : UPLOAD_DIR;
  const files = await readdir(dir, { recursive: true });
  const out: { url: string; name: string; size: number; modified: Date }[] = [];
  for (const f of files) {
    const full = `${dir}/${f}`;
    const s = await stat(full);
    if (!s.isFile()) continue;
    out.push({
      url: `/uploads/${f.replaceAll("\\", "/")}`,
      name: f,
      size: s.size,
      modified: s.mtime,
    });
  }
  return out.sort((a, b) => b.modified.getTime() - a.modified.getTime());
}

export { prisma };