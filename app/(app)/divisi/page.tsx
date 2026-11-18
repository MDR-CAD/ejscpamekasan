import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAll } from "@/lib/sheets";
import { canWrite } from "@/lib/schema";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteDivision } from "./actions";

export const metadata = { title: "Divisi" };

export default async function DivisiPage() {
  const user = await requireUser();
  const writable = canWrite(user.role);

  const [divisions, members] = await Promise.all([getAll("divisions"), getAll("members")]);
  const memberName = new Map(members.map((m) => [m.id, m.nama]));
  const sorted = [...divisions].sort((a, b) => a.nama_divisi.localeCompare(b.nama_divisi, "id"));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Divisi</h1>
          <p className="text-sm text-slate-500">{divisions.length} divisi</p>
        </div>
        {writable && (
          <Link href="/divisi/baru" className="btn btn-primary">
            + Tambah divisi
          </Link>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="card py-10 text-center text-sm text-slate-500">Belum ada divisi.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((d) => {
            const count = members.filter((m) => m.divisi_id === d.id).length;
            return (
              <article key={d.id} className="card flex flex-col">
                <h2 className="font-semibold text-slate-900">{d.nama_divisi}</h2>
                <p className="mt-1 flex-1 text-sm text-slate-600">
                  {d.deskripsi || <span className="text-slate-400">Tanpa deskripsi</span>}
                </p>
                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Ketua</dt>
                    <dd className="font-medium text-slate-900">{memberName.get(d.ketua_id) ?? "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Anggota</dt>
                    <dd className="font-medium text-slate-900">{count}</dd>
                  </div>
                </dl>
                {writable && (
                  <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
                    <Link href={`/divisi/${d.id}`} className="btn-link text-brand-600">
                      Edit
                    </Link>
                    {count === 0 ? (
                      <DeleteButton
                        action={deleteDivision.bind(null, d.id)}
                        confirmText={`Hapus divisi "${d.nama_divisi}"?`}
                      />
                    ) : (
                      <span className="text-xs text-slate-400">Dipakai {count} anggota</span>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
