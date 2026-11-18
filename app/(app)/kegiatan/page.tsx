import Link from "next/link";
import {redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {getAll} from "@/lib/sheets";
import {canWrite} from "@/lib/schema";
import {formatDate} from "@/lib/format";
import {todayWIB} from "@/lib/events";
import {DeleteButton} from "@/components/DeleteButton";
import {deleteEvent} from "./actions";

export const metadata = {title: "Kegiatan"};

export default async function KegiatanPage() {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  const today = todayWIB();
  const rows = (await getAll("kegiatan")).sort(
    (a, b) =>
      b.tanggal.localeCompare(a.tanggal) ||
      b.created_at.localeCompare(a.created_at),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kegiatan</h1>
          <p className="text-sm text-slate-500">
            {rows.length} kegiatan. Beranda menampilkan 3 kegiatan terdekat yang
            belum lewat.
          </p>
        </div>
        <Link href="/kegiatan/baru" className="btn btn-primary">
          + Tambah kegiatan
        </Link>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Kegiatan</th>
              <th className="th">Tanggal</th>
              <th className="th">Waktu</th>
              <th className="th">Tempat</th>
              <th className="th text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="td py-10 text-center text-slate-500">
                  Belum ada kegiatan. Klik “Tambah kegiatan” untuk memulai.
                </td>
              </tr>
            )}
            {rows.map((e) => {
              const past = e.tanggal < today;
              return (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="td font-medium text-slate-900">{e.judul}</td>
                  <td className="td whitespace-nowrap">
                    {formatDate(e.tanggal)}
                    {past && (
                      <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        Lewat
                      </span>
                    )}
                  </td>
                  <td className="td">{e.waktu || "-"}</td>
                  <td className="td">{e.lokasi || "-"}</td>
                  <td className="td">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/kegiatan/${e.id}`}
                        className="btn-link text-brand-600"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteEvent.bind(null, e.id)}
                        confirmText={`Hapus kegiatan “${e.judul}”? Tindakan ini tidak bisa dibatalkan.`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
