// Membuat semua tab + header di spreadsheet. Aman dijalankan berulang kali.
//   npm run setup-sheets
import { config } from "dotenv";
import { sheetsClient, spreadsheetId } from "../lib/google";
import { TABLES, type TableName } from "../lib/schema";

config({ path: ".env.local", quiet: true });

function colLetter(n: number): string {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function listSheets() {
  const api = sheetsClient();
  const meta = await api.spreadsheets.get({
    spreadsheetId: spreadsheetId(),
    fields: "sheets.properties(sheetId,title)",
  });
  return new Map(
    (meta.data.sheets ?? []).map((s) => [s.properties!.title!, s.properties!.sheetId!] as const),
  );
}

async function main() {
  const api = sheetsClient();
  const id = spreadsheetId();
  const tables = Object.keys(TABLES) as TableName[];

  let existing = await listSheets();
  const missing = tables.filter((t) => !existing.has(t));

  if (missing.length > 0) {
    await api.spreadsheets.batchUpdate({
      spreadsheetId: id,
      requestBody: {
        requests: missing.map((title) => ({
          addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } },
        })),
      },
    });
    existing = await listSheets();
    console.log(`+ Tab dibuat: ${missing.join(", ")}`);
  }

  for (const table of tables) {
    const header = [...TABLES[table]] as string[];
    const range = `${table}!A1:${colLetter(header.length)}1`;
    const current = await api.spreadsheets.values.get({ spreadsheetId: id, range });
    const row = (current.data.values?.[0] ?? []) as string[];

    if (row.length === 0) {
      await api.spreadsheets.values.update({
        spreadsheetId: id,
        range,
        valueInputOption: "RAW",
        requestBody: { values: [header] },
      });
      await api.spreadsheets.batchUpdate({
        spreadsheetId: id,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: { sheetId: existing.get(table)!, startRowIndex: 0, endRowIndex: 1 },
                cell: { userEnteredFormat: { textFormat: { bold: true } } },
                fields: "userEnteredFormat.textFormat.bold",
              },
            },
          ],
        },
      });
      console.log(`+ Header ditulis: ${table}`);
    } else if (row.join("|") === header.join("|")) {
      console.log(`= ${table}: header sudah sesuai`);
    } else {
      console.warn(
        `! ${table}: header berbeda dari yang diharapkan, tidak diubah.\n` +
          `    Diharapkan: ${header.join(", ")}\n    Ditemukan : ${row.join(", ")}`,
      );
    }
  }

  console.log("\nSelesai. Berikutnya: npm run add-user -- <username> \"<Nama Lengkap>\" admin");
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error("Gagal:", message);
  if (/permission|caller does not have/i.test(message)) {
    console.error(
      "Pastikan spreadsheet sudah di-Share ke GOOGLE_CLIENT_EMAIL dengan akses Editor.",
    );
  }
  process.exit(1);
});
