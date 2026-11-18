"use server";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireWriter} from "@/lib/auth";
import {create, getAll, remove, update} from "@/lib/sheets";
import {articleSchema} from "@/lib/validations";
import {slugify, uniqueSlug} from "@/lib/slug";
import {formValues, type FormState} from "@/lib/form-state";
import {deleteImage, uploadImage} from "@/lib/upload";

/** Setelah data berubah, paksa halaman publik membaca ulang dari spreadsheet. */
function refreshPublicPages(...articlePaths: string[]) {
  for (const path of articlePaths) revalidatePath(path);

  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath("/berita/[slug]", "page");
  revalidatePath("/opini");
  revalidatePath("/opini/[slug]", "page");
  revalidatePath("/artikel");
}

/** Validasi input form. Mengembalikan data bersih, atau pesan error + isian pengguna. */
function validate(fd: FormData, authorFallback: string) {
  const values = formValues(fd);
  const parsed = articleSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      values,
    } as const;
  }
  const data = parsed.data;
  return {data: {...data, penulis: data.penulis || authorFallback}} as const;
}

/** Kumpulan slug yang sudah dipakai pada satu kategori (kecuali artikel yang sedang diedit). */
async function takenSlugs(kategori: string, exceptId?: string) {
  const rows = await getAll("articles");
  return new Set(
    rows
      .filter((r) => r.kategori === kategori && r.id !== exceptId)
      .map((r) => r.slug),
  );
}

/**
 * Tentukan link gambar akhir:
 * - ada file baru dipilih  → upload, pakai link barunya
 * - centang "hapus gambar" → kosongkan
 * - selain itu             → pertahankan gambar lama yang tersimpan di spreadsheet
 */
async function resolveImage(fd: FormData, current: string): Promise<string> {
  const file = fd.get("gambar_file");
  if (file instanceof File && file.size > 0) return uploadImage(file);
  if (fd.get("hapus_gambar") === "on") return "";
  return current;
}

export async function createArticle(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const user = await requireWriter();
  const result = validate(fd, user.nama);
  if ("error" in result) return {error: result.error, values: result.values};

  let gambar: string;
  try {
    gambar = await resolveImage(fd, "");
  } catch (e) {
    return {error: (e as Error).message, values: formValues(fd)};
  }

  const slug = uniqueSlug(
    slugify(result.data.judul),
    await takenSlugs(result.data.kategori),
  );
  await create("articles", {...result.data, gambar, slug});

  refreshPublicPages(`/${result.data.kategori}/${slug}`);
  redirect("/artikel");
}

export async function updateArticle(
  id: string,
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const user = await requireWriter();
  const result = validate(fd, user.nama);
  if ("error" in result) return {error: result.error, values: result.values};

  const existing = (await getAll("articles")).find((r) => r.id === id);
  if (!existing)
    return {error: "Artikel tidak ditemukan.", values: formValues(fd)};

  // Slug dibiarkan tetap supaya link lama tidak rusak. Hanya diganti bila pindah kategori
  // dan slug yang sama ternyata sudah dipakai di kategori tujuan.
  const taken = await takenSlugs(result.data.kategori, id);
  const slug = taken.has(existing.slug)
    ? uniqueSlug(existing.slug, taken)
    : existing.slug;

  let gambar: string;
  try {
    gambar = await resolveImage(fd, existing.gambar);
  } catch (e) {
    return {error: (e as Error).message, values: formValues(fd)};
  }

  await update("articles", id, {...result.data, gambar, slug});
  if (existing.gambar && existing.gambar !== gambar)
    await deleteImage(existing.gambar);

  refreshPublicPages(
    `/${existing.kategori}/${existing.slug}`,
    `/${result.data.kategori}/${slug}`,
  );
  redirect("/artikel");
}

export async function deleteArticle(id: string): Promise<void> {
  await requireWriter();
  const existing = (await getAll("articles")).find((r) => r.id === id);
  await remove("articles", id);
  if (existing?.gambar) await deleteImage(existing.gambar);
  refreshPublicPages(
    ...(existing ? [`/${existing.kategori}/${existing.slug}`] : []),
  );
}
