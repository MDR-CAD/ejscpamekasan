// Menambah pengguna (password di-hash dengan bcrypt sebelum disimpan).
//   npm run add-user -- <username> "<Nama Lengkap>" <admin|pengurus|anggota>
// Password diminta saat dijalankan (atau isi env USER_PASSWORD untuk mode non-interaktif).
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import readline from "node:readline";
import { sheetsClient, spreadsheetId } from "../lib/google";
import { ROLES, TABLES, type Role } from "../lib/schema";

config({ path: ".env.local", quiet: true });

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const out = rl as unknown as { _writeToOutput: (s: string) => void };
    let muted = false;
    out._writeToOutput = (s: string) => {
      if (!muted) process.stdout.write(s);
      else if (s.includes("\n") || s.includes("\r")) process.stdout.write("\n");
    };
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
    muted = true; // prompt sudah tercetak; sembunyikan ketikan password
  });
}

async function main() {
  const [username, nama, role = "anggota"] = process.argv.slice(2);

  if (!username || !nama) {
    console.error('Pemakaian: npm run add-user -- <username> "<Nama Lengkap>" <admin|pengurus|anggota>');
    process.exit(1);
  }
  if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {
    console.error("Username 3-30 karakter: huruf, angka, titik, garis bawah, atau strip.");
    process.exit(1);
  }
  if (!ROLES.includes(role as Role)) {
    console.error(`Role harus salah satu dari: ${ROLES.join(", ")}`);
    process.exit(1);
  }

  const password = process.env.USER_PASSWORD ?? (await askHidden("Password (min. 8 karakter): "));
  if (password.length < 8) {
    console.error("Password minimal 8 karakter.");
    process.exit(1);
  }

  const api = sheetsClient();
  const id = spreadsheetId();

  const existing = await api.spreadsheets.values.get({ spreadsheetId: id, range: "users!B2:B" });
  const usernames = (existing.data.values ?? []).map((r) => String(r[0] ?? "").toLowerCase());
  if (usernames.includes(username.toLowerCase())) {
    console.error(`Username "${username}" sudah dipakai.`);
    process.exit(1);
  }

  const now = new Date().toISOString();
  const row: Record<string, string> = {
    id: randomUUID(),
    username,
    nama,
    password_hash: await bcrypt.hash(password, 12),
    role,
    status: "aktif",
    created_at: now,
    updated_at: now,
  };

  await api.spreadsheets.values.append({
    spreadsheetId: id,
    range: "users!A1",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [TABLES.users.map((c) => row[c] ?? "")] },
  });

  console.log(`Pengguna "${username}" (${role}) berhasil dibuat.`);
}

main().catch((err) => {
  console.error("Gagal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
