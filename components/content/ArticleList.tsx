import {PageHeader} from "@/components/ui/PageHeader";
import {Section} from "@/components/ui/Section";
import {ArticleCard} from "./ArticleCard";
import {getArticles} from "@/lib/articles";
import type {ArticleCategory} from "@/lib/schema";

// Dipakai bersama oleh halaman /berita dan /opini. Data dibaca dari Google Sheets.
export async function ArticleList({
  category,
  title,
  description,
}: {
  category: ArticleCategory;
  title: string;
  description: string;
}) {
  const items = await getArticles(category);
  return (
    <>
      <PageHeader eyebrow="Info" title={title} description={description} />
      <Section tone="muted">
        {items.length === 0 ? (
          <p className="text-center text-slate-500">Belum ada tulisan.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
