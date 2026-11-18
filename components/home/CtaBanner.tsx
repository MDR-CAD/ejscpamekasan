import Link from "next/link";

// Banner ajakan: kartu hijau besar dengan satu tombol.
export function CtaBanner() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-12 text-white sm:px-12 sm:py-14 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div
            className="grid-pattern absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black)]"
            aria-hidden
          />
          <div
            className="absolute -right-12 -top-24 h-64 w-64 rounded-full bg-brand-500/40 blur-2xl"
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ingin tahu lebih banyak tentang kami?
            </h2>
            <p className="mt-3 text-white/80">
              Kenali sejarah, visi, dan susunan pengurus organisasi kami.
            </p>
          </div>
          <div className="relative mt-8 lg:mt-0 lg:shrink-0">
            <Link href="/profil/sejarah" className="btn-light">
              Kenali Kami
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
