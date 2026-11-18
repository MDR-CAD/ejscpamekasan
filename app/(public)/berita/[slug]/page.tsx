import {notFound} from "next/navigation";
import {ArticleDetail} from "@/components/content/ArticleDetail";
import {findArticle} from "@/lib/articles";

type Props = {params: Promise<{slug: string}>};

// Artikel baru bisa muncul kapan saja, jadi halaman detail dibuat saat pertama kali dibuka
// lalu disimpan (cache) dan diperbarui tiap 60 detik.
export const revalidate = 60;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({params}: Props) {
  const {slug} = await params;
  const article = await findArticle("berita", slug);
  return {title: article?.title ?? "Berita"};
}

export default async function BeritaDetailPage({params}: Props) {
  const {slug} = await params;
  const article = await findArticle("berita", slug);
  if (!article) notFound();
  return <ArticleDetail article={article} />;
}
