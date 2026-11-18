import {PageHeader} from "@/components/ui/PageHeader";
import {Photo} from "@/components/ui/Photo";
import {Section} from "@/components/ui/Section";
import {getAll} from "@/lib/sheets";

export const metadata = {title: "Galeri"};

// Foto dibaca dari spreadsheet; halaman diperbarui paling lama tiap 60 detik (dan langsung saat admin menyimpan).
export const revalidate = 60;

export default async function GaleriPage() {
  const photos = (await getAll("gallery"))
    .filter((g) => g.gambar)
    .sort(
      (a, b) =>
        b.tanggal.localeCompare(a.tanggal) ||
        b.created_at.localeCompare(a.created_at),
    );

  return (
    <>
      <PageHeader
        eyebrow="Galeri"
        title="Galeri Kegiatan"
        description="Dokumentasi momen-momen kegiatan organisasi."
      />
      <Section tone="muted">
        {photos.length === 0 ? (
          <p className="text-center text-slate-500">Belum ada foto.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {photos.map((g) => (
              <figure key={g.id} className="surface group overflow-hidden">
                <div className="overflow-hidden">
                  <Photo
                    src={g.gambar}
                    alt={g.judul}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="aspect-4/3 transition duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="px-4 py-3 text-sm font-medium text-slate-700">
                  {g.judul}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
