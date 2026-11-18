"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireWriter } from "@/lib/auth";
import { create, getAll, remove, update } from "@/lib/sheets";
import { memberSchema } from "@/lib/validations";
import { formValues, type FormState } from "@/lib/form-state";

/** Validasi input + aturan bisnis. Mengembalikan data bersih, atau pesan error. */
async function validate(fd: FormData, currentId?: string) {
  const values = formValues(fd);
  const parsed = memberSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid.", values } as const;
  }
  const data = parsed.data;

  if (data.divisi_id) {
    const divisions = await getAll("divisions");
    if (!divisions.some((d) => d.id === data.divisi_id)) {
      return { error: "Divisi yang dipilih tidak ditemukan.", values } as const;
    }
  }

  if (data.nim) {
    const members = await getAll("members");
    const dup = members.find(
      (m) => m.id !== currentId && m.nim.toLowerCase() === data.nim.toLowerCase(),
    );
    if (dup) return { error: `NIM ${data.nim} sudah dipakai oleh ${dup.nama}.`, values } as const;
  }

  return { data } as const;
}

export async function createMember(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireWriter();
  const result = await validate(fd);
  if ("error" in result) return { error: result.error, values: result.values };

  await create("members", result.data);
  revalidatePath("/anggota");
  revalidatePath("/dashboard");
  redirect("/anggota");
}

export async function updateMember(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireWriter();
  const result = await validate(fd, id);
  if ("error" in result) return { error: result.error, values: result.values };

  await update("members", id, result.data);
  revalidatePath("/anggota");
  revalidatePath("/dashboard");
  redirect("/anggota");
}

export async function deleteMember(id: string): Promise<void> {
  await requireWriter();

  // Jika anggota ini ketua sebuah divisi, kosongkan dulu referensinya.
  const divisions = await getAll("divisions");
  for (const d of divisions.filter((d) => d.ketua_id === id)) {
    await update("divisions", d.id, { ketua_id: "" });
  }

  await remove("members", id);
  revalidatePath("/anggota");
  revalidatePath("/divisi");
  revalidatePath("/dashboard");
}
