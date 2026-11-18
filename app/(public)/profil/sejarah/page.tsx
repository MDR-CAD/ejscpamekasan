import {PageHeader} from "@/components/ui/PageHeader";
import {Section} from "@/components/ui/Section";
import {sejarah} from "@/data/profil";

export const metadata = {title: "Sejarah"};

export default function SejarahPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profil"
        title="Sejarah"
        description="Perjalanan organisasi dari awal berdiri hingga kini."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {sejarah.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <ol className="mt-12 space-y-8 border-l-2 border-brand-100 pl-8">
            {sejarah.timeline.map((t) => (
              <li key={t.tahun} className="relative">
                <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-white bg-brand-600 ring-2 ring-brand-100" />
                <p className="text-sm font-bold text-brand-700">{t.tahun}</p>
                <p className="mt-1 text-slate-600">{t.teks}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
