import Link from "next/link";
import {Photo} from "@/components/ui/Photo";
import {formatDate} from "@/lib/format";
import type {Article} from "@/lib/articles";

export function ArticleCard({article}: {article: Article}) {
  const href = `/${article.category}/${article.slug}`;
  return (
    <article className="group surface flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-slate-900/5">
      <Link href={href} className="block" tabIndex={-1} aria-hidden>
        <Photo
          src={article.image}
          alt={article.title}
          className="aspect-video"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold text-brand-700">
          {formatDate(article.date)}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900">
          <Link href={href} className="hover:text-brand-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
          {article.excerpt}
        </p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700"
        >
          Baca selengkapnya
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
