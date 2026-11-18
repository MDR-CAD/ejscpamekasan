import {AccentText} from "./AccentText";

// Pembungkus satu bagian halaman: judul rata kiri (+ tombol opsional di kanan) lalu isi.
// tone = warna latar: light (putih), muted (abu sangat muda), dark (hijau tua).
// Pada title, kata dalam [kurung siku] akan diberi warna aksen.
const tones = {
  light: "bg-white text-slate-700",
  muted: "bg-slate-50 text-slate-700",
  dark: "bg-brand-900 text-white",
};

export function Section({
  eyebrow,
  title,
  intro,
  tone = "light",
  id,
  action,
  children,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  tone?: keyof typeof tones;
  id?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      className={`relative overflow-hidden py-16 sm:py-20 lg:py-24 ${tones[tone]}`}
    >
      {dark && (
        <div
          className="grid-pattern absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          aria-hidden
        />
      )}
      <div className="container-page relative">
        {(eyebrow || title) && (
          <header className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              {eyebrow && (
                <span className={`eyebrow ${dark ? "eyebrow-on-dark" : ""}`}>
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2
                  className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${
                    dark ? "text-white" : "text-slate-900"
                  }`}
                >
                  <AccentText
                    text={title}
                    accentClass={dark ? "text-brand-300" : "text-brand-600"}
                  />
                </h2>
              )}
              {intro && (
                <p
                  className={`mt-3 ${dark ? "text-white/70" : "text-slate-600"}`}
                >
                  {intro}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
