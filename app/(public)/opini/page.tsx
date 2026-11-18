import {ArticleList} from "@/components/content/ArticleList";

export const metadata = {title: "Opini"};

export const revalidate = 60;

export default function OpiniPage() {
  return (
    <ArticleList
      category="opini"
      title="Opini"
      description="Gagasan dan pandangan dari anggota dan pengurus."
    />
  );
}
