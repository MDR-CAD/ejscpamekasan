import {ArticleList} from "@/components/content/ArticleList";

export const metadata = {title: "Berita"};

// Halaman dibuat ulang dari spreadsheet paling lama tiap 60 detik (dan langsung saat admin menyimpan).
export const revalidate = 60;

export default function BeritaPage() {
  return (
    <ArticleList
      category="berita"
      title="Berita"
      description="Kabar dan informasi terbaru dari organisasi."
    />
  );
}
