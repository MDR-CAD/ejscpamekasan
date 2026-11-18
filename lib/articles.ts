// Membaca berita & opini dari Google Sheets untuk ditampilkan di situs publik.
// Hanya artikel berstatus "terbit" yang diambil; draft tidak pernah keluar dari sini.
import {getAllPublic} from "./sheets"; // ← diubah dari getAll
import type {ArticleCategory, RowOf} from "./schema";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  category: ArticleCategory;
  author: string;
  image: string | null;
  content: string[]; // satu elemen = satu paragraf
};

function toArticle(r: RowOf<"articles">): Article {
  const paragraphs = r.isi
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Jika ringkasan kosong, ambil potongan awal isi.
  const excerpt = r.ringkasan || (paragraphs[0] ?? "").slice(0, 160);

  return {
    slug: r.slug,
    title: r.judul,
    excerpt,
    date: r.tanggal,
    category: r.kategori as ArticleCategory,
    author: r.penulis || "Admin",
    image: r.gambar || null,
    content: paragraphs,
  };
}

/** Artikel terbit pada satu kategori, terbaru lebih dulu. */
export async function getArticles(
  category: ArticleCategory,
): Promise<Article[]> {
  const rows = await getAllPublic("articles"); // ← diubah dari getAll
  return rows
    .filter((r) => r.kategori === category && r.status === "terbit" && r.slug)
    .sort(
      (a, b) =>
        b.tanggal.localeCompare(a.tanggal) ||
        b.created_at.localeCompare(a.created_at),
    )
    .map(toArticle);
}

export async function findArticle(
  category: ArticleCategory,
  slug: string,
): Promise<Article | null> {
  const rows = await getAllPublic("articles"); // ← diubah dari getAll
  const row = rows.find(
    (r) => r.kategori === category && r.slug === slug && r.status === "terbit",
  );
  return row ? toArticle(row) : null;
}
