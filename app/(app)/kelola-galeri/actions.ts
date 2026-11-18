"use server";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireWriter} from "@/lib/auth";
import {create, getAll, remove, update} from "@/lib/sheets";
import {gallerySchema} from "@/lib/validations";
import {formValues, type FormState} from "@/lib/form-state";
import {deleteImage, uploadImage} from "@/lib/upload";

/** Setelah data berubah, paksa halaman galeri publik membaca ulang dari spreadsheet. */
function refreshPages() {
  revalidatePath("/galeri");
  revalidatePath("/kelola-galeri");
}

function validate(fd: FormData) {
  const values = formValues(fd);
  const parsed = gallerySchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      values,
    } as const;
  }
  return {data: parsed.data} as const;
}

export async function createPhoto(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireWriter();
  const result = validate(fd);
  if ("error" in result) return {error: result.error, values: result.values};

  const file = fd.get("foto");
  if (!(file instanceof File) || file.size === 0) {
    return {error: "Pilih foto terlebih dahulu.", values: formValues(fd)};
  }

  let gambar: string;
  try {
    gambar = await uploadImage(file, "galeri");
  } catch (e) {
    return {error: (e as Error).message, values: formValues(fd)};
  }

  await create("gallery", {...result.data, gambar});
  refreshPages();
  redirect("/kelola-galeri");
}

export async function updatePhoto(
  id: string,
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireWriter();
  const result = validate(fd);
  if ("error" in result) return {error: result.error, values: result.values};

  const existing = (await getAll("gallery")).find((r) => r.id === id);
  if (!existing)
    return {error: "Foto tidak ditemukan.", values: formValues(fd)};

  // Foto baru bersifat opsional: kalau tidak dipilih, foto lama tetap dipakai.
  let gambar = existing.gambar;
  const file = fd.get("foto");
  if (file instanceof File && file.size > 0) {
    try {
      gambar = await uploadImage(file, "galeri");
    } catch (e) {
      return {error: (e as Error).message, values: formValues(fd)};
    }
  }

  await update("gallery", id, {...result.data, gambar});
  if (existing.gambar !== gambar) await deleteImage(existing.gambar);
  refreshPages();
  redirect("/kelola-galeri");
}

export async function deletePhoto(id: string): Promise<void> {
  await requireWriter();
  const existing = (await getAll("gallery")).find((r) => r.id === id);
  await remove("gallery", id);
  if (existing?.gambar) await deleteImage(existing.gambar);
  refreshPages();
}
