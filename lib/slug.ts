/** "Rapat Kerja Tahunan 2026!" → "rapat-kerja-tahunan-2026" (aman dipakai di alamat URL). */
export function slugify(input: string, max = 80): string {
  const slug = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // buang aksen
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/, "");
  return slug || "artikel";
}

/** Jika slug sudah dipakai, tambahkan -2, -3, dst. sampai unik. */
export function uniqueSlug(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
