import Link from "next/link";
import {PageHeader} from "@/components/ui/PageHeader";
import {Photo} from "@/components/ui/Photo";
import {formatDate} from "@/lib/format";
import type {Article} from "@/lib/articles";

export function ArticleDetail({article}: {article: Article}) {
  const label = article.category === "berita" ? "Berita" : "Opini";
  return (
    <>
      <PageHeader
        eyebrow={label}
        title={article.title}
        description={`${formatDate(article.date)} · ${article.author}`}
      />
      <section className="bg-white py-14 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            {article.image && (
              <Photo
                src={article.image}
                alt={article.title}
                sizes="768px"
                className="mb-10 aspect-video rounded-2xl"
              />
            )}
            {/* whitespace-pre-line: baris baru tunggal di dalam paragraf tetap tampil */}
            <div className="space-y-5 text-lg leading-8 text-slate-700">
              {article.content.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
            <Link
              href={`/${article.category}`}
              className="mt-10 inline-block text-sm font-semibold text-brand-700"
            >
              ← Kembali ke {label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
