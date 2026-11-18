import Image from "next/image";
import Link from "next/link";
import {siteConfig} from "@/config/site";

// Logo di navbar & footer. Isi siteConfig.logo untuk memakai gambar logo sendiri.
// tone="dark" dipakai di atas latar gelap (footer): teks jadi putih.
export function Logo({tone = "light"}: {tone?: "light" | "dark"}) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label={siteConfig.name}
    >
      {siteConfig.logo ? (
        <Image
          src={siteConfig.logo}
          alt=""
          width={40}
          height={40}
          className="h-9 w-auto"
        />
      ) : (
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-xs font-extrabold text-white ring-1 ring-black/5">
          {siteConfig.shortName.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span
        className={`text-lg font-extrabold tracking-tight ${tone === "dark" ? "text-white" : "text-slate-900"}`}
      >
        {siteConfig.shortName}
      </span>
    </Link>
  );
}
