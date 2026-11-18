import {z} from "zod";
import {ARTICLE_CATEGORIES, ARTICLE_STATUSES, MEMBER_STATUSES} from "./schema";

const text = (max: number) =>
  z.string().trim().max(max, `Maksimal ${max} karakter`).default("");

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const memberSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  nim: text(30),
  divisi_id: z.string().trim().default(""),
  jabatan: text(60),
  no_hp: z
    .string()
    .trim()
    .regex(/^([0-9+\-\s]{8,20})?$/, "Format nomor HP tidak valid")
    .default(""),
  tgl_bergabung: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Format tanggal tidak valid")
    .default(""),
  status: z.enum(MEMBER_STATUSES, {error: "Status tidak valid"}),
});

export const divisionSchema = z.object({
  nama_divisi: z
    .string()
    .trim()
    .min(2, "Nama divisi minimal 2 karakter")
    .max(80, "Nama divisi maksimal 80 karakter"),
  deskripsi: text(300),
  ketua_id: z.string().trim().default(""),
});

export const articleSchema = z.object({
  judul: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter")
    .max(150, "Judul maksimal 150 karakter"),
  kategori: z.enum(ARTICLE_CATEGORIES, {error: "Kategori tidak valid"}),
  ringkasan: text(300),
  // Satu sel Google Sheets maksimal 50.000 karakter, jadi isi dibatasi 30.000.
  isi: z
    .string()
    .trim()
    .min(10, "Isi minimal 10 karakter")
    .max(30000, "Isi maksimal 30.000 karakter"),
  penulis: text(80),
  // Hanya link http(s):// atau path lokal diawali "/" (tapi bukan "//"). Menolak "javascript:" dsb.
  gambar: z
    .string()
    .trim()
    .max(500, "Alamat gambar maksimal 500 karakter")
    .regex(
      /^(\/(?!\/)[^\s]*|https?:\/\/[^\s]+)?$/,
      "Alamat gambar harus link https://... atau diawali / (mis. /images/foto.jpg)",
    )
    .default(""),
  tanggal: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
    .refine((v) => {
      const d = new Date(v);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    }, "Tanggal tidak valid"),
  status: z.enum(ARTICLE_STATUSES, {error: "Status tidak valid"}),
});

export const gallerySchema = z.object({
  judul: z
    .string()
    .trim()
    .min(2, "Judul minimal 2 karakter")
    .max(100, "Judul maksimal 100 karakter"),
  tanggal: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
    .refine((v) => {
      const d = new Date(v);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    }, "Tanggal tidak valid"),
});

export const eventSchema = z.object({
  judul: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter")
    .max(120, "Judul maksimal 120 karakter"),
  tanggal: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
    .refine((v) => {
      const d = new Date(v);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    }, "Tanggal tidak valid"),
  waktu: text(40),
  lokasi: text(100),
});
