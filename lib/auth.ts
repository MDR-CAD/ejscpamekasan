import { cache } from "react";
import { redirect } from "next/navigation";
import { getAll } from "./sheets";
import { readSessionUserId } from "./session";
import { canWrite, type Role } from "./schema";

export type CurrentUser = {
  id: string;
  username: string;
  nama: string;
  role: Role;
};

/**
 * User yang sedang login. Data diverifikasi ulang ke spreadsheet di setiap request,
 * jadi akun yang dinonaktifkan atau diubah perannya langsung berlaku.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const id = await readSessionUserId();
  if (!id) return null;

  const users = await getAll("users");
  const user = users.find((u) => u.id === id);
  if (!user || user.status !== "aktif") return null;

  return {
    id: user.id,
    username: user.username,
    nama: user.nama,
    role: user.role as Role,
  };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Untuk server action yang mengubah data: wajib login dan punya hak tulis. */
export async function requireWriter(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!canWrite(user.role)) throw new Error("Anda tidak punya akses untuk mengubah data.");
  return user;
}
