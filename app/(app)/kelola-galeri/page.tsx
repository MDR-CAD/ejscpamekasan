import Link from "next/link";
import {redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {getAll} from "@/lib/sheets";
import {canWrite} from "@/lib/schema";
import {formatDate} from "@/lib/format";
import {DeleteButton} from "@/components/DeleteButton";
import {Photo} from "@/components/ui/Photo";
import {deletePhoto} from "./actions";

export const metadata = {title: "Galeri"};

export default async function KelolaGaleriPage() {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  const rows = (await getAll("gallery")).sort(
    (a, b) =>
      b.tanggal.localeCompare(a.tanggal) ||
      b.created_at.localeCompare(a.created_at),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Galeri</h1>
          <p className="text-sm text-slate-500">{rows.length} foto</p>
        </div>
        <Link href="/kelola-galeri/baru" className="btn btn-primary">
          + Tambah foto
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="card text-center text-slate-500">
          Belum ada foto. Klik “Tambah foto” untuk memulai.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((g) => (
            <div key={g.id} className="card overflow-hidden p-0">
              <Photo
                src={g.gambar || null}
                alt={g.judul}
                className="aspect-4/3"
              />
              <div className="space-y-2 p-4">
                <div>
                  <p className="truncate font-medium text-slate-900">
                    {g.judul}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(g.tanggal)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/kelola-galeri/${g.id}`}
                    className="btn-link text-brand-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deletePhoto.bind(null, g.id)}
                    confirmText={`Hapus foto “${g.judul}”? Tindakan ini tidak bisa dibatalkan.`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
