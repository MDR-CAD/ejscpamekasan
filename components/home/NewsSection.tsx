import Link from "next/link";
import {ArticleCard} from "@/components/content/ArticleCard";
import {Section} from "@/components/ui/Section";
import {getArticles} from "@/lib/articles";

export async function NewsSection() {
  const latest = (await getArticles("berita")).slice(0, 3);
  return (
    <Section
      tone="muted"
      eyebrow="Berita"
      title="Temukan Berita [Terbaru]"
      action={
        <Link href="/berita" className="btn-ghost">
          Semua Berita
        </Link>
      }
    >
      {latest.length === 0 ? (
        <p className="text-slate-500">Belum ada berita.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </Section>
  );
}
