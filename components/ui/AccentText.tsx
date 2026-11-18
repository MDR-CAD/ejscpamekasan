// Judul dengan satu/beberapa kata berwarna. Tandai kata dengan [kurung siku].
//   <AccentText text="Temukan Berita [Terbaru]" />  →  "Terbaru" berwarna teal
export function AccentText({
  text,
  accentClass = "text-brand-600",
}: {
  text: string;
  accentClass?: string;
}) {
  const parts = text.split(/\[([^\]]+)\]/); // indeks ganjil = teks di dalam [ ]
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={accentClass}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Beri tanda [ ] pada N kata terakhir: ("Tentang Organisasi Kami", 2) → "Tentang [Organisasi Kami]" */
export function accentLastWords(text: string, count = 1): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) return `[${text.trim()}]`;
  const n = Math.min(count, words.length - 1);
  return `${words.slice(0, -n).join(" ")} [${words.slice(-n).join(" ")}]`;
}
