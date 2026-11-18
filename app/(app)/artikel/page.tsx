import Link from "next/link";
import {redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {getAll} from "@/lib/sheets";
import {canWrite} from "@/lib/schema";
import {formatDate} from "@/lib/format";
import {DeleteButton} from "@/components/DeleteButton";
import {StatusBadge} from "@/components/StatusBadge";
import {deleteArticle} from "./actions";

export const metadata = {title: "Berita & Opini"};

type SearchParams = Promise<{q?: string; kategori?: string; status?: string}>;

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  const {q = "", kategori = "", status = ""} = await searchParams;
  const all = await getAll("articles");

  const needle = q.trim().toLowerCase();
  const rows = all
    .filter(
      (a) =>
        (!needle || a.judul.toLowerCase().includes(needle)) &&
        (!kategori || a.kategori === kategori) &&
        (!status || a.status === status),
    )
    .sort(
      (a, b) =>
        b.tanggal.localeCompare(a.tanggal) ||
        b.created_at.localeCompare(a.created_at),
    );

  const filtered = Boolean(needle || kategori || status);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Berita & Opini</h1>
          <p className="text-sm text-slate-500">
            {rows.length} dari {all.length} tulisan
          </p>
        </div>
        <Link href="/artikel/baru" className="btn btn-primary">
          + Tulis baru
        </Link>
      </div>

      <form
        method="get"
        className="card grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari judul..."
          className="input"
          aria-label="Cari judul"
        />
        <select
          name="kategori"
          defaultValue={kategori}
          className="input"
          aria-label="Filter kategori"
        >
          <option value="">Semua kategori</option>
          <option value="berita">Berita</option>
          <option value="opini">Opini</option>
        </select>
        <select
          name="status"
          defaultValue={status}
          className="input"
          aria-label="Filter status"
        >
          <option value="">Semua status</option>
          <option value="terbit">Terbit</option>
          <option value="draft">Draft</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-secondary">
            Terapkan
          </button>
          {filtered && (
            <Link href="/artikel" className="btn btn-secondary">
              Reset
            </Link>
          )}
        </div>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Judul</th>
              <th className="th">Kategori</th>
              <th className="th">Tanggal</th>
              <th className="th">Penulis</th>
              <th className="th">Status</th>
              <th className="th text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="td py-10 text-center text-slate-500">
                  {filtered
                    ? "Tidak ada tulisan yang cocok."
                    : "Belum ada tulisan. Klik “Tulis baru” untuk memulai."}
                </td>
              </tr>
            )}
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="td max-w-xs">
                  <p className="truncate font-medium text-slate-900">
                    {a.judul}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    /{a.kategori}/{a.slug}
                  </p>
                </td>
                <td className="td capitalize">{a.kategori}</td>
                <td className="td whitespace-nowrap">
                  {formatDate(a.tanggal)}
                </td>
                <td className="td">{a.penulis || "-"}</td>
                <td className="td">
                  <StatusBadge status={a.status} />
                </td>
                <td className="td">
                  <div className="flex items-center justify-end gap-4">
                    {a.status === "terbit" && (
                      <Link
                        href={`/${a.kategori}/${a.slug}`}
                        target="_blank"
                        className="btn-link text-slate-600"
                      >
                        Lihat
                      </Link>
                    )}
                    <Link
                      href={`/artikel/${a.id}`}
                      className="btn-link text-brand-600"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteArticle.bind(null, a.id)}
                      confirmText={`Hapus “${a.judul}”? Tindakan ini tidak bisa dibatalkan.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
