"use server";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireWriter} from "@/lib/auth";
import {create, remove, update} from "@/lib/sheets";
import {eventSchema} from "@/lib/validations";
import {formValues, type FormState} from "@/lib/form-state";

/** Setelah data berubah, paksa Beranda membaca ulang dari spreadsheet. */
function refreshPages() {
  revalidatePath("/");
  revalidatePath("/kegiatan");
}

function validate(fd: FormData) {
  const values = formValues(fd);
  const parsed = eventSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      values,
    } as const;
  }
  return {data: parsed.data} as const;
}

export async function createEvent(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireWriter();
  const result = validate(fd);
  if ("error" in result) return {error: result.error, values: result.values};

  await create("kegiatan", result.data);
  refreshPages();
  redirect("/kegiatan");
}

export async function updateEvent(
  id: string,
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireWriter();
  const result = validate(fd);
  if ("error" in result) return {error: result.error, values: result.values};

  try {
    await update("kegiatan", id, result.data);
  } catch {
    return {error: "Kegiatan tidak ditemukan.", values: formValues(fd)};
  }
  refreshPages();
  redirect("/kegiatan");
}

export async function deleteEvent(id: string): Promise<void> {
  await requireWriter();
  await remove("kegiatan", id);
  refreshPages();
}
