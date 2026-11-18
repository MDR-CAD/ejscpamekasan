"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAll } from "@/lib/sheets";
import { createSession } from "@/lib/session";
import { clearFailures, isLimited, recordFailure } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations";

export type LoginState = { error?: string };

// Dipakai agar waktu respons tetap mirip walau username tidak ada.
const DUMMY_HASH = bcrypt.hashSync("tidak-dipakai", 12);

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Username dan password wajib diisi." };

  const { username, password } = parsed.data;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${ip}:${username.toLowerCase()}`;

  if (isLimited(key)) {
    return { error: "Terlalu banyak percobaan. Coba lagi dalam beberapa menit." };
  }

  const users = await getAll("users");
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  const passwordOk = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);

  if (!user || !passwordOk || user.status !== "aktif") {
    recordFailure(key);
    return { error: "Username atau password salah." };
  }

  clearFailures(key);
  await createSession(user.id);
  redirect("/dashboard");
}
