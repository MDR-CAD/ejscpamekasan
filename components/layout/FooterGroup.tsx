"use client";

import {useState} from "react";

// Satu kolom footer. Di HP: judul bisa diklik untuk buka/tutup (accordion).
// Di layar lebar (md ke atas): selalu terbuka seperti kolom biasa.
export function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-white md:pointer-events-none md:cursor-default md:pb-4 md:pt-0"
      >
        {title}
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className={`transition-transform duration-200 md:hidden ${open ? "rotate-180" : ""}`}
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
      <div className={`${open ? "block" : "hidden"} pb-4 md:block md:pb-0`}>
        {children}
      </div>
    </div>
  );
}
