"use client";

import {useState} from "react";

// Foto dikecilkan otomatis di browser sebelum dikirim:
// sisi terpanjang maksimal 1600 px, format JPEG kualitas 80%.
const MAX_SIDE = 1600;
const QUALITY = 0.8;

async function compress(file: File): Promise<File> {
  if (file.type !== "image/jpeg" && file.type !== "image/png") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#fff"; // PNG transparan → latar putih (JPEG tidak mengenal transparansi)
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  // Kalau hasilnya tidak lebih kecil dan ukurannya tidak diubah, pakai file asli.
  if (!blob || (scale === 1 && blob.size >= file.size)) return file;

  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
    type: "image/jpeg",
  });
}

const fmt = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function ImageInput({
  id,
  name,
  required,
}: {
  id: string;
  name: string;
  required?: boolean;
}) {
  const [info, setInfo] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const original = input.files?.[0];
    if (!original) {
      setInfo("");
      return;
    }
    setInfo("Memproses gambar...");
    try {
      const result = await compress(original);
      if (result !== original) {
        // Ganti file di input dengan versi yang sudah dikompres.
        const dt = new DataTransfer();
        dt.items.add(result);
        input.files = dt.files;
        setInfo(
          `Dikompres otomatis: ${fmt(original.size)} → ${fmt(result.size)}`,
        );
      } else {
        setInfo(`Ukuran: ${fmt(original.size)}`);
      }
    } catch {
      // Gagal kompres (mis. browser lama): kirim file asli, server tetap memeriksa ukurannya.
      setInfo(`Ukuran: ${fmt(original.size)}`);
    }
  }

  return (
    <>
      <input
        id={id}
        name={name}
        type="file"
        accept="image/jpeg,image/png"
        required={required}
        onChange={onChange}
        className="input file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-700"
      />
      <p className="mt-1 text-xs text-slate-500" aria-live="polite">
        {info || "JPG, JPEG, atau PNG. Dikompres otomatis sebelum diunggah."}
      </p>
    </>
  );
}
