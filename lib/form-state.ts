// State yang dikembalikan server action ke form (dipakai useActionState).
export type FormState = {
  error?: string;
  values?: Record<string, string>;
};

/** Ubah FormData menjadi objek string biasa (untuk mengisi ulang form saat error). */
export function formValues(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of fd.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) out[key] = value;
  }
  return out;
}
