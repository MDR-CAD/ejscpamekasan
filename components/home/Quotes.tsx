import {Section} from "@/components/ui/Section";
import {quotes} from "@/data/home";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export function Quotes() {
  return (
    <Section tone="muted" eyebrow="Kata Mereka" title="Tokoh dan [Inspirasi]">
      <div className="grid gap-5 md:grid-cols-3">
        {quotes.map((q, i) => (
          <figure key={i} className="surface flex flex-col p-6 sm:p-7">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              className="text-brand-200"
              fill="currentColor"
              aria-hidden
            >
              <path d="M9.5 6C6.5 7 4 9.8 4 13.5V18h6v-6H7.2c.2-2 1.4-3.3 3.3-4L9.5 6zm9 0c-3 1-5.5 3.8-5.5 7.5V18h6v-6h-2.8c.2-2 1.4-3.3 3.3-4L18.5 6z" />
            </svg>
            <blockquote className="mt-3 flex-1 leading-7 text-slate-700">
              {q.text}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-100">
                {initials(q.nama)}
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {q.nama}
                </span>
                <span className="block text-xs text-slate-500">
                  {q.jabatan}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
