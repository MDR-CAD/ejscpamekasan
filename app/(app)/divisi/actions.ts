"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireWriter } from "@/lib/auth";
import { create, getAll, remove, update } from "@/lib/sheets";
import { divisionSchema } from "@/lib/validations";
import { formValues, type FormState } from "@/lib/form-state";

async function validate(fd: FormData, currentId?: string) {
  const values = formValues(fd);
  const parsed = divisionSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid.", values } as const;
  }
  const data = parsed.data;

  const divisions = await getAll("divisions");
  if (divisions.some((d) => d.id !== currentId && d.nama_divisi.toLowerCase() === data.nama_divisi.toLowerCase())) {
    return { error: `Divisi "${data.nama_divisi}" sudah ada.`, values } as const;
  }

  if (data.ketua_id) {
    const members = await getAll("members");
    if (!members.some((m) => m.id === data.ketua_id)) {
      return { error: "Ketua yang dipilih tidak ditemukan.", values } as const;
    }
  }

  return { data } as const;
}

export async function createDivision(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireWriter();
  const result = await validate(fd);
  if ("error" in result) return { error: result.error, values: result.values };

  await create("divisions", result.data);
  revalidatePath("/divisi");
  revalidatePath("/dashboard");
  redirect("/divisi");
}

export async function updateDivision(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireWriter();
  const result = await validate(fd, id);
  if ("error" in result) return { error: result.error, values: result.values };

  await update("divisions", id, result.data);
  revalidatePath("/divisi");
  revalidatePath("/dashboard");
  redirect("/divisi");
}

export async function deleteDivision(id: string): Promise<void> {
  await requireWriter();

  const members = await getAll("members");
  if (members.some((m) => m.divisi_id === id)) {
    throw new Error("Divisi masih dipakai anggota. Pindahkan anggotanya terlebih dahulu.");
  }

  await remove("divisions", id);
  revalidatePath("/divisi");
  revalidatePath("/dashboard");
}
