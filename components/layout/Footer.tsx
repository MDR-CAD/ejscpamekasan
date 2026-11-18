import Link from "next/link";
import {navItems, siteConfig} from "@/config/site";
import {FooterGroup} from "./FooterGroup";
import {Logo} from "./Logo";

// Kolom footer dibuat otomatis dari menu navbar:
// menu dropdown (Profil, Info) jadi kolom sendiri, menu biasa digabung di kolom "Menu".
const groups = [
  ...navItems
    .filter((i) => i.children)
    .map((i) => ({title: i.label, links: i.children!})),
  {
    title: "Menu",
    links: navItems
      .filter((i) => i.href)
      .map((i) => ({label: i.label, href: i.href!})),
  },
];

const linkClass = "block py-1.5 text-sm transition hover:text-brand-300";

export function Footer() {
  const {contact, social} = siteConfig;
  return (
    <footer className="bg-brand-950 text-white/70">
      <div className="container-page grid gap-x-8 py-12 md:grid-cols-4 md:gap-y-10 md:py-16 lg:grid-cols-6">
        {/* Kolom merek */}
        <div className="pb-8 md:col-span-4 md:pb-0 lg:col-span-2">
          <Logo tone="dark" />
          <p className="mt-4 max-w-sm text-sm leading-6">
            {siteConfig.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/80 transition hover:border-brand-300 hover:text-brand-300"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Kolom tautan (accordion di HP) */}
        {groups.map((g) => (
          <FooterGroup key={g.title} title={g.title}>
            <ul>
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterGroup>
        ))}

        <FooterGroup title="Kontak">
          <ul className="space-y-1.5 text-sm">
            <li className="py-1">{contact.address}</li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="py-1 hover:text-brand-300"
              >
                {contact.email}
              </a>
            </li>
            <li className="py-1">{contact.phone}</li>
          </ul>
        </FooterGroup>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} {siteConfig.name}. Hak cipta dilindungi.
      </div>
    </footer>
  );
}
