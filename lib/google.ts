import { google } from "googleapis";

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} belum diisi. Lihat .env.example.`);
  }
  return value;
}

let cached: ReturnType<typeof google.sheets> | null = null;

/** Klien Google Sheets (service account). Hanya boleh dipakai di server. */
export function sheetsClient() {
  if (cached) return cached;

  // Kunci privat sering tersimpan dengan "\n" literal dan/atau tanda kutip di env var.
  const key = requireEnv("GOOGLE_PRIVATE_KEY")
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: requireEnv("GOOGLE_CLIENT_EMAIL"),
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cached = google.sheets({ version: "v4", auth });
  return cached;
}

export const spreadsheetId = () => requireEnv("SPREADSHEET_ID");
