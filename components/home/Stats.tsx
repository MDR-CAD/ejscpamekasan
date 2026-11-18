import {stats} from "@/data/home";

// Deretan angka: 2 kolom di HP, 4 kolom di layar lebar. Garis pemisah dibuat dari gap-px.
export function Stats() {
  return (
    <section className="bg-white pb-16 sm:pb-20">
      <div className="container-page">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col-reverse bg-white px-5 py-6 text-center sm:py-8"
            >
              <dt className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">
                {s.label}
              </dt>
              <dd className="text-3xl font-extrabold tracking-tight text-brand-700 sm:text-4xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
