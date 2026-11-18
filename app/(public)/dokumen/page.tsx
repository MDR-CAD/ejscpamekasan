import {PageHeader} from "@/components/ui/PageHeader";
import {Section} from "@/components/ui/Section";
import {dokumen} from "@/data/dokumen";

export const metadata = {title: "Dokumen"};

export default function DokumenPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dokumen"
        title="Dokumen"
        description="Kumpulan dokumen resmi dan formulir organisasi."
      />
      <Section tone="muted">
        <ul className="mx-auto max-w-3xl space-y-3">
          {dokumen.map((d) => (
            <li key={d.title}>
              <a
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group surface flex items-center gap-4 p-4 transition hover:border-brand-300 hover:shadow-md hover:shadow-slate-900/5 sm:p-5"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-900">
                    {d.title}
                  </span>
                  <span className="block text-sm text-slate-600">{d.desc}</span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-brand-700">
                  Buka{" "}
                  <span
                    aria-hidden
                    className="inline-block transition group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
