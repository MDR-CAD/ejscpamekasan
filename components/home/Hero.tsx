import Image from "next/image";
import Link from "next/link";
import {siteConfig} from "@/config/site";
import {dateParts, upcomingEvents} from "@/lib/events";
import {AccentText, accentLastWords} from "@/components/ui/AccentText";

// Panel di sisi kanan hero. Jika siteConfig.heroImage diisi, tampil foto; jika tidak, kartu kegiatan.
async function HeroVisual() {
  if (siteConfig.heroImage) {
    return (
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-2xl shadow-brand-900/15 ring-1 ring-slate-900/5">
        <Image
          src={siteConfig.heroImage}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const items = await upcomingEvents(3);
  return (
    <div className="relative">
      <div className="rounded-3xl bg-brand-950 p-5 shadow-2xl shadow-brand-900/20 ring-1 ring-white/10 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 text-xs font-medium text-white/50">
            Kegiatan Mendatang
          </span>
        </div>
        {items.length === 0 && (
          <p className="px-1 pb-2 text-sm text-white/60">
            Belum ada kegiatan mendatang.
          </p>
        )}
        <ul className="space-y-3">
          {items.map((e) => {
            const p = dateParts(e.date);
            return (
              <li
                key={e.id}
                className="flex items-center gap-4 rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10 sm:p-4"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-600 text-center leading-none text-white">
                  <span>
                    <span className="block text-xl font-extrabold">
                      {p.day}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-brand-100">
                      {p.month}
                    </span>
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{e.title}</p>
                  <p className="truncate text-sm text-white/55">
                    {[e.time, e.place].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Lencana melayang di pojok kanan atas (area header kartu yang kosong); disembunyikan di HP */}
      <div className="absolute -right-3 -top-6 hidden max-w-[15rem] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 sm:flex">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-700 text-xs font-extrabold text-white">
          {siteConfig.shortName.slice(0, 2).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-slate-900">
            {siteConfig.shortName}
          </span>
          <span className="block truncate text-xs text-slate-500">
            {siteConfig.name}
          </span>
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="grid-pattern-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        aria-hidden
      />
      <div
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl"
        aria-hidden
      />

      {/* grid-cols-1 + minmax(0, ...) = kolom boleh menyusut, jadi teks panjang tidak mendorong lebar layar */}
      <div className="container-page relative grid grid-cols-1 items-center gap-14 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-24">
        <div>
          <span className="eyebrow">Website Resmi</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            <AccentText text={accentLastWords(siteConfig.name, 1)} />
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/profil/sejarah" className="btn-solid">
              Selengkapnya
            </Link>
            <Link href="/kontak" className="btn-ghost">
              Hubungi Kami
            </Link>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
