"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {navItems, type NavItem} from "@/config/site";
import {Logo} from "./Logo";

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href)
    return item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href);
  return item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
}

const linkClass = (active: boolean) =>
  `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
    active
      ? "text-brand-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // menu mobile terbuka?
  const [expanded, setExpanded] = useState<string | null>(null); // dropdown mobile yang terbuka
  const [scrolled, setScrolled] = useState(false);

  // Garis bawah + bayangan muncul setelah halaman di-scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur transition-shadow ${
        scrolled || open ? "border-slate-200 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Logo />

        {/* Menu desktop */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Menu utama"
        >
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className={linkClass(isActive(pathname, item))}
                >
                  {item.label} <Chevron />
                </button>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="min-w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={`block rounded-lg px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand-700 ${
                            pathname.startsWith(c.href)
                              ? "text-brand-700"
                              : "text-slate-700"
                          }`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className={linkClass(isActive(pathname, item))}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <Link href="/login" className="btn-solid hidden lg:inline-flex">
          Login
        </Link>

        {/* Tombol hamburger (mobile) */}
        <button
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile: dropdown (Profil, Info) tertutup dulu, buka dengan klik */}
      {open && (
        <nav
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden"
          aria-label="Menu mobile"
        >
          <div className="container-page pb-6 pt-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(pathname, item);
                const isOpen = expanded === item.label;
                return (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(isOpen ? null : item.label)
                          }
                          aria-expanded={isOpen}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-medium hover:bg-slate-100 ${
                            active ? "text-brand-700" : "text-slate-700"
                          }`}
                        >
                          {item.label}
                          <span
                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          >
                            <Chevron />
                          </span>
                        </button>
                        {isOpen && (
                          <ul className="mb-1 ml-4 mt-1 space-y-0.5 border-l border-slate-200 pl-3">
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  onClick={close}
                                  className={`block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 ${
                                    pathname.startsWith(c.href)
                                      ? "font-semibold text-brand-700"
                                      : "text-slate-600"
                                  }`}
                                >
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={close}
                        className={`block rounded-lg px-3 py-2.5 font-medium ${
                          active
                            ? "text-brand-700"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link
              href="/login"
              onClick={close}
              className="btn-solid mt-4 w-full"
            >
              Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
