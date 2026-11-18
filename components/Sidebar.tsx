import Link from "next/link";
import {logout} from "@/app/actions";
import type {CurrentUser} from "@/lib/auth";
import {canWrite} from "@/lib/schema";

export function Sidebar({user, orgName}: {user: CurrentUser; orgName: string}) {
  // Menu "Berita & Opini" hanya untuk yang boleh mengubah data (admin & pengurus).
  const links = [
    {href: "/dashboard", label: "Dashboard"},
    {href: "/anggota", label: "Anggota"},
    {href: "/divisi", label: "Divisi"},
    ...(canWrite(user.role)
      ? [
          {href: "/artikel", label: "Berita & Opini"},
          {href: "/kelola-galeri", label: "Galeri"},
          {href: "/kegiatan", label: "Kegiatan"},
        ]
      : []),
    {href: "/", label: "← Situs publik"},
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Sistem
        </p>
        <p className="text-lg font-bold text-slate-900">{orgName}</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 md:block">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            {user.nama}
          </p>
          <p className="text-xs capitalize text-slate-500">{user.role}</p>
        </div>
        <form action={logout} className="md:mt-2">
          <button type="submit" className="btn-link text-slate-600">
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
