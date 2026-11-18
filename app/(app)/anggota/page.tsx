import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAll } from "@/lib/sheets";
import { canWrite, MEMBER_STATUSES } from "@/lib/schema";
import { DeleteButton } from "@/components/DeleteButton";
import { StatusBadge } from "@/components/StatusBadge";
import { deleteMember } from "./actions";

export const metadata = { title: "Anggota" };

type SearchParams = Promise<{ q?: string; divisi?: string; status?: string }>;

export default async function AnggotaPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  const writable = canWrite(user.role);
  const { q = "", divisi = "", status = "" } = await searchParams;

  const [members, divisions] = await Promise.all([getAll("members"), getAll("divisions")]);
  const divName = new Map(divisions.map((d) => [d.id, d.nama_divisi]));

  const needle = q.trim().toLowerCase();
  const rows = members
    .filter(
      (m) =>
        (!needle || m.nama.toLowerCase().includes(needle) || m.nim.toLowerCase().includes(needle)) &&
        (!divisi || m.divisi_id === divisi) &&
        (!status || m.status === status),
    )
    .sort((a, b) => a.nama.localeCompare(b.nama, "id"));

  const filtered = Boolean(needle || divisi || status);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Anggota</h1>
          <p className="text-sm text-slate-500">
            {rows.length} dari {members.length} anggota
          </p>
        </div>
        {writable && (
          <Link href="/anggota/baru" className="btn btn-primary">
            + Tambah anggota
          </Link>
        )}
      </div>

      <form method="get" className="card grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nama atau NIM..."
          className="input"
          aria-label="Cari anggota"
        />
        <select name="divisi" defaultValue={divisi} className="input" aria-label="Filter divisi">
          <option value="">Semua divisi</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nama_divisi}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="input" aria-label="Filter status">
          <option value="">Semua status</option>
          {MEMBER_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-secondary">
            Terapkan
          </button>
          {filtered && (
            <Link href="/anggota" className="btn btn-secondary">
              Reset
            </Link>
          )}
        </div>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Nama</th>
              <th className="th">NIM</th>
              <th className="th">Divisi</th>
              <th className="th">Jabatan</th>
              <th className="th">No. HP</th>
              <th className="th">Status</th>
              {writable && <th className="th text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={writable ? 7 : 6} className="td py-10 text-center text-slate-500">
                  {filtered ? "Tidak ada anggota yang cocok." : "Belum ada anggota."}
                </td>
              </tr>
            )}
            {rows.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="td font-medium text-slate-900">{m.nama}</td>
                <td className="td">{m.nim || "-"}</td>
                <td className="td">{divName.get(m.divisi_id) ?? "-"}</td>
                <td className="td">{m.jabatan || "-"}</td>
                <td className="td">{m.no_hp || "-"}</td>
                <td className="td">
                  <StatusBadge status={m.status} />
                </td>
                {writable && (
                  <td className="td">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/anggota/${m.id}`} className="btn-link text-brand-600">
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteMember.bind(null, m.id)}
                        confirmText={`Hapus anggota "${m.nama}"? Tindakan ini tidak bisa dibatalkan.`}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
