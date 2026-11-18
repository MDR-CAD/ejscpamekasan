import {notFound} from "next/navigation";
import {ArticleDetail} from "@/components/content/ArticleDetail";
import {findArticle} from "@/lib/articles";

type Props = {params: Promise<{slug: string}>};

export const revalidate = 60;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({params}: Props) {
  const {slug} = await params;
  const article = await findArticle("opini", slug);
  return {title: article?.title ?? "Opini"};
}

export default async function OpiniDetailPage({params}: Props) {
  const {slug} = await params;
  const article = await findArticle("opini", slug);
  if (!article) notFound();
  return <ArticleDetail article={article} />;
}
