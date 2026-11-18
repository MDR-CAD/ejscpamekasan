// Upload gambar sampul ke Vercel Blob (penyimpanan file gratis dari Vercel).
// Kenapa bukan folder public/? Di Vercel, folder proyek bersifat read-only: file yang di-upload
// saat website berjalan tidak bisa disimpan di sana.
import {randomUUID} from "node:crypto";
import {del, put} from "@vercel/blob";

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3 MB (batas body Vercel ±4,5 MB)

/** Kenali jenis gambar dari isi file (bukan dari nama/ekstensi, karena itu mudah dipalsukan). */
function detectType(
  bytes: Uint8Array,
): {ext: "jpg" | "png"; mime: string} | null {
  const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (isJpg) return {ext: "jpg", mime: "image/jpeg"};
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((b, i) => bytes[i] === b))
    return {ext: "png", mime: "image/png"};
  return null;
}

/**
 * Simpan file gambar dan kembalikan link publiknya.
 * Melempar Error berisi pesan yang aman ditampilkan ke pengguna.
 */
export async function uploadImage(
  file: File,
  folder = "artikel",
): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error("Ukuran gambar maksimal 3 MB.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectType(bytes);
  if (!type) throw new Error("Format gambar harus JPG, JPEG, atau PNG.");

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Penyimpanan gambar belum disiapkan (BLOB_READ_WRITE_TOKEN belum diisi).",
    );
  }

  try {
    const blob = await put(
      `${folder}/${randomUUID()}.${type.ext}`,
      Buffer.from(bytes),
      {
        access: "public",
        contentType: type.mime,
        addRandomSuffix: false,
      },
    );
    return blob.url;
  } catch (err) {
    console.error("Upload gambar gagal:", err);
    throw new Error("Gagal mengunggah gambar. Coba lagi beberapa saat.");
  }
}

/** Hapus gambar lama dari Blob (hanya yang memang disimpan di sana). Gagal pun tidak masalah. */
export async function deleteImage(url: string): Promise<void> {
  if (!url || !/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(url))
    return;
  try {
    await del(url);
  } catch (err) {
    console.error("Hapus gambar lama gagal:", err);
  }
}
