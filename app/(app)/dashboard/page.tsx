import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAll } from "@/lib/sheets";
import { StatusBadge } from "@/components/StatusBadge";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const [members, divisions] = await Promise.all([getAll("members"), getAll("divisions")]);

  const active = members.filter((m) => m.status === "aktif");
  const perDivision = divisions
    .map((d) => ({
      id: d.id,
      nama: d.nama_divisi,
      jumlah: active.filter((m) => m.divisi_id === d.id).length,
    }))
    .sort((a, b) => b.jumlah - a.jumlah);
  const unassigned = active.filter((m) => !m.divisi_id).length;
  const max = Math.max(1, ...perDivision.map((d) => d.jumlah), unassigned);
  const divName = new Map(divisions.map((d) => [d.id, d.nama_divisi]));

  const latest = [...members]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  const stats = [
    { label: "Anggota aktif", value: active.length },
    { label: "Total anggota", value: members.length },
    { label: "Divisi", value: divisions.length },
    { label: "Alumni", value: members.filter((m) => m.status === "alumni").length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Halo, {user.nama.split(" ")[0]}</h1>
        <p className="text-sm text-slate-500">Ringkasan data organisasi.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 font-semibold text-slate-900">Anggota aktif per divisi</h2>
          {perDivision.length === 0 && unassigned === 0 ? (
            <p className="text-sm text-slate-500">Belum ada data.</p>
          ) : (
            <ul className="space-y-3">
              {[...perDivision, ...(unassigned ? [{ id: "-", nama: "Tanpa divisi", jumlah: unassigned }] : [])].map(
                (d) => (
                  <li key={d.id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-700">{d.nama}</span>
                      <span className="font-medium text-slate-900">{d.jumlah}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-brand-600"
                        style={{ width: `${(d.jumlah / max) * 100}%` }}
                      />
                    </div>
                  </li>
                ),
              )}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Anggota terbaru</h2>
            <Link href="/anggota" className="btn-link text-brand-600">
              Lihat semua
            </Link>
          </div>
          {latest.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada anggota.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {latest.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{m.nama}</p>
                    <p className="truncate text-xs text-slate-500">
                      {divName.get(m.divisi_id) ?? "Tanpa divisi"}
                      {m.jabatan ? ` · ${m.jabatan}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
