import {PageHeader} from "@/components/ui/PageHeader";
import {Section} from "@/components/ui/Section";
import {misi, visi} from "@/data/profil";

export const metadata = {title: "Visi dan Misi"};

export default function VisiMisiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profil"
        title="Visi dan Misi"
        description="Arah dan tujuan yang kami perjuangkan bersama."
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="relative overflow-hidden rounded-3xl bg-brand-900 p-8 text-white sm:p-12">
            <div
              className="grid-pattern absolute inset-0 [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]"
              aria-hidden
            />
            <div className="relative">
              <span className="eyebrow eyebrow-on-dark">Visi</span>
              <p className="mt-5 text-2xl font-bold leading-snug sm:text-3xl">
                {visi}
              </p>
            </div>
          </div>

          <div>
            <span className="eyebrow">Misi</span>
            <ol className="mt-6 space-y-3">
              {misi.map((m, i) => (
                <li key={i} className="surface flex gap-4 p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-100">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-slate-700">{m}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </>
  );
}
