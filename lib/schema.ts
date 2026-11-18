// Definisi tab (tabel) di Google Sheets. Urutan kolom = urutan kolom di sheet.
// Baris 1 tiap tab adalah header. Jalankan `npm run setup-sheets` untuk membuatnya otomatis.
export const TABLES = {
  users: [
    "id",
    "username",
    "nama",
    "password_hash",
    "role",
    "status",
    "created_at",
    "updated_at",
  ],
  divisions: [
    "id",
    "nama_divisi",
    "deskripsi",
    "ketua_id",
    "created_at",
    "updated_at",
  ],
  members: [
    "id",
    "nama",
    "nim",
    "divisi_id",
    "jabatan",
    "no_hp",
    "tgl_bergabung",
    "status",
    "created_at",
    "updated_at",
  ],
  // Berita & opini. isi = teks panjang; paragraf dipisah baris kosong.
  // status: "terbit" tampil di situs, "draft" hanya terlihat di dashboard.
  articles: [
    "id",
    "slug",
    "judul",
    "ringkasan",
    "isi",
    "kategori",
    "penulis",
    "gambar",
    "tanggal",
    "status",
    "created_at",
    "updated_at",
  ],
  // Galeri foto kegiatan. gambar = link foto yang diunggah ke Vercel Blob.
  gallery: ["id", "judul", "gambar", "tanggal", "created_at", "updated_at"],
  // Tabel di bawah disiapkan untuk tahap 2 (belum ada halamannya).
  // Kegiatan/event yang tampil di Beranda (hanya teks). waktu = teks bebas, mis. "15:00 WIB".
  kegiatan: [
    "id",
    "judul",
    "tanggal",
    "waktu",
    "lokasi",
    "created_at",
    "updated_at",
  ],
  attendance: [
    "id",
    "event_id",
    "member_id",
    "status_hadir",
    "created_at",
    "updated_at",
  ],
  announcements: [
    "id",
    "judul",
    "isi",
    "tanggal",
    "penulis_id",
    "created_at",
    "updated_at",
  ],
  finance: [
    "id",
    "tanggal",
    "jenis",
    "nominal",
    "keterangan",
    "dicatat_oleh",
    "created_at",
    "updated_at",
  ],
} as const;

export type TableName = keyof typeof TABLES;

// Satu baris = objek dengan semua kolom bertipe string (Sheets menyimpan teks).
export type RowOf<T extends TableName> = {
  [K in (typeof TABLES)[T][number]]: string;
};

export type Role = "admin" | "pengurus" | "anggota";
export const ROLES: readonly Role[] = ["admin", "pengurus", "anggota"];

export const MEMBER_STATUSES = ["aktif", "nonaktif", "alumni"] as const;

export const ARTICLE_CATEGORIES = ["berita", "opini"] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];
export const ARTICLE_STATUSES = ["terbit", "draft"] as const;

/** Admin dan pengurus boleh mengubah data; anggota hanya melihat. */
export function canWrite(role: string): boolean {
  return role === "admin" || role === "pengurus";
}
