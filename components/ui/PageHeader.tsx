// Banner di bagian atas setiap halaman selain Beranda.
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-slate-200 bg-linear-to-b from-brand-50 to-white">
      <div
        className="grid-pattern-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        aria-hidden
      />
      <div className="container-page relative py-14 sm:py-20">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-slate-600 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
