import {PageHeader} from "@/components/ui/PageHeader";
import {Photo} from "@/components/ui/Photo";
import {Section} from "@/components/ui/Section";
import {struktur} from "@/data/profil";

export const metadata = {title: "Struktur Pengurus"};

export default function StrukturPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profil"
        title="Struktur Pengurus"
        description="Susunan pengurus yang menjalankan roda organisasi."
      />
      {struktur.map((g, i) => (
        <Section
          key={g.grup}
          tone={i % 2 === 0 ? "light" : "muted"}
          title={g.grup}
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {g.anggota.map((a, j) => (
              <div key={j} className="surface p-3 text-center sm:p-4">
                <Photo
                  src={a.foto}
                  alt={a.nama}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="aspect-square w-full rounded-xl"
                />
                <p className="mt-4 font-bold text-slate-900">{a.nama}</p>
                <p className="mb-1 text-sm text-brand-700">{a.jabatan}</p>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </>
  );
}
