import Image from "next/image";
import Link from "next/link";
import {siteConfig} from "@/config/site";
import {about} from "@/data/home";
import {AccentText, accentLastWords} from "@/components/ui/AccentText";

export function About() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Blok logo */}
        <div className="relative mx-auto grid aspect-5/4 w-full max-w-md place-items-center overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 to-brand-900 shadow-xl shadow-brand-900/15 lg:max-w-none">
          <div
            className="grid-pattern absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]"
            aria-hidden
          />
          <div
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/15"
            aria-hidden
          />
          <div
            className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full border border-white/10"
            aria-hidden
          />
          {siteConfig.logo ? (
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={160}
              height={160}
              className="relative h-28 w-auto sm:h-32"
            />
          ) : (
            <span className="relative text-5xl font-black tracking-tight text-white sm:text-6xl">
              {siteConfig.shortName}
            </span>
          )}
        </div>

        <div>
          <span className="eyebrow">{about.eyebrow}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            <AccentText text={accentLastWords(about.title, 2)} />
          </h2>
          <div className="mt-5 space-y-4 leading-7 text-slate-600">
            {about.text.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link href="/profil/sejarah" className="btn-solid mt-8">
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </div>
    </section>
  );
}
