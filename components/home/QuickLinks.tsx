import Link from "next/link";
import {quickLinks} from "@/data/home";

// Ikon sederhana, dipakai berurutan sesuai urutan kartu di data/home.ts.
const icons = [
  "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z",
  "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 21h15",
  "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
  "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5",
  "M4 6h16v12H4zM4 7l8 6 8-6",
];

function Icon({index, dark}: {index: number; dark: boolean}) {
  return (
    <span
      className={`grid h-11 w-11 place-items-center rounded-xl ${
        dark
          ? "bg-white/10 text-brand-300 ring-1 ring-white/15"
          : "bg-brand-50 text-brand-700 ring-1 ring-brand-100"
      }`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={icons[index % icons.length]} />
      </svg>
    </span>
  );
}

export function QuickLinks() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="container-page grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((q, i) => {
          const dark = i === 0; // kartu pertama: gelap & lebih lebar
          const external = q.href.startsWith("http");
          const className = `group relative flex min-h-52 flex-col justify-between overflow-hidden rounded-2xl p-6 transition sm:p-7 ${
            dark
              ? "bg-brand-950 text-white md:col-span-2 lg:col-span-2"
              : "border border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-slate-900/5"
          }`;
          const body = (
            <>
              {dark && (
                <div
                  className="grid-pattern absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_70%)]"
                  aria-hidden
                />
              )}
              <div className="relative">
                <Icon index={i} dark={dark} />
                <h3
                  className={`mt-5 text-xl font-bold ${dark ? "text-white" : "text-slate-900"}`}
                >
                  {q.title}
                </h3>
                <p
                  className={`mt-2 max-w-md text-sm leading-6 ${dark ? "text-white/70" : "text-slate-600"}`}
                >
                  {q.desc}
                </p>
              </div>
              <span
                className={`relative mt-6 inline-flex items-center gap-1 text-sm font-semibold ${
                  dark ? "text-brand-300" : "text-brand-700"
                }`}
              >
                {q.cta}
                <span
                  aria-hidden
                  className="transition group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </>
          );
          return external ? (
            <a
              key={q.title}
              href={q.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {body}
            </a>
          ) : (
            <Link key={q.title} href={q.href} className={className}>
              {body}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
