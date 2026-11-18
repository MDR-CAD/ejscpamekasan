const styles: Record<string, string> = {
  aktif: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  terbit: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  nonaktif: "bg-slate-100 text-slate-600 ring-slate-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
  alumni: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function StatusBadge({status}: {status: string}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${
        styles[status] ?? styles.nonaktif
      }`}
    >
      {status || "-"}
    </span>
  );
}
