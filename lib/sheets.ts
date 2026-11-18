import { cache } from "react";
import { randomUUID } from "node:crypto";
import { sheetsClient, spreadsheetId } from "./google";
import { TABLES, type RowOf, type TableName } from "./schema";

function colLetter(n: number): string {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

const lastCol = (table: TableName) => colLetter(TABLES[table].length);

/** Ulangi otomatis untuk error sementara (kuota 429 / error server 5xx). */
async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const code = (err as { code?: number | string }).code;
      const retryable = code === 429 || (typeof code === "number" && code >= 500);
      if (!retryable || attempt >= tries) throw err;
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    }
  }
}

type StoredRow<T extends TableName> = { data: RowOf<T>; rowNumber: number };

/** Baca semua baris (tanpa cache) beserta nomor barisnya di sheet. */
async function readRows<T extends TableName>(table: T): Promise<StoredRow<T>[]> {
  const cols = TABLES[table] as readonly string[];
  let values: unknown[][];
  try {
    const res = await withRetry(() =>
      sheetsClient().spreadsheets.values.get({
        spreadsheetId: spreadsheetId(),
        range: `${table}!A2:${lastCol(table)}`,
      }),
    );
    values = (res.data.values ?? []) as unknown[][];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/Unable to parse range/i.test(message)) {
      throw new Error(`Tab "${table}" tidak ditemukan di spreadsheet. Jalankan: npm run setup-sheets`);
    }
    throw err;
  }

  const out: StoredRow<T>[] = [];
  values.forEach((row, i) => {
    const data = Object.fromEntries(cols.map((c, j) => [c, String(row[j] ?? "")])) as RowOf<T>;
    // Lewati baris kosong; nomor baris tetap dihitung dari posisi aslinya.
    if ((data as Record<string, string>).id) out.push({ data, rowNumber: i + 2 });
  });
  return out;
}

/**
 * Ambil semua baris sebuah tab. Dibungkus React cache(): dalam satu request
 * yang sama, tab yang sama hanya dibaca sekali dari Google Sheets.
 */
export const getAll = cache(async <T extends TableName>(table: T): Promise<RowOf<T>[]> => {
  return (await readRows(table)).map((r) => r.data);
});

export async function getById<T extends TableName>(table: T, id: string): Promise<RowOf<T> | null> {
  const rows = await getAll(table);
  return rows.find((r) => (r as Record<string, string>).id === id) ?? null;
}

type Writable<T extends TableName> = Partial<Omit<RowOf<T>, "id" | "created_at" | "updated_at">>;

export async function create<T extends TableName>(table: T, data: Writable<T>): Promise<RowOf<T>> {
  const cols = TABLES[table] as readonly string[];
  const now = new Date().toISOString();
  const row: Record<string, string> = {
    ...(data as Record<string, string>),
    id: randomUUID(),
    created_at: now,
    updated_at: now,
  };

  await withRetry(() =>
    sheetsClient().spreadsheets.values.append({
      spreadsheetId: spreadsheetId(),
      range: `${table}!A1`,
      // RAW = nilai disimpan apa adanya sebagai teks (tidak ada interpretasi rumus "=...").
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [cols.map((c) => row[c] ?? "")] },
    }),
  );
  return row as unknown as RowOf<T>;
}

export async function update<T extends TableName>(
  table: T,
  id: string,
  patch: Writable<T>,
): Promise<RowOf<T>> {
  const cols = TABLES[table] as readonly string[];
  const found = (await readRows(table)).find((r) => (r.data as Record<string, string>).id === id);
  if (!found) throw new Error("Data tidak ditemukan.");

  const next: Record<string, string> = {
    ...(found.data as Record<string, string>),
    ...(patch as Record<string, string>),
    id,
    updated_at: new Date().toISOString(),
  };

  await withRetry(() =>
    sheetsClient().spreadsheets.values.update({
      spreadsheetId: spreadsheetId(),
      range: `${table}!A${found.rowNumber}:${lastCol(table)}${found.rowNumber}`,
      valueInputOption: "RAW",
      requestBody: { values: [cols.map((c) => next[c] ?? "")] },
    }),
  );
  return next as unknown as RowOf<T>;
}

async function sheetIdOf(table: TableName): Promise<number> {
  const res = await withRetry(() =>
    sheetsClient().spreadsheets.get({
      spreadsheetId: spreadsheetId(),
      fields: "sheets.properties(sheetId,title)",
    }),
  );
  const found = res.data.sheets?.find((s) => s.properties?.title === table);
  const sheetId = found?.properties?.sheetId;
  if (sheetId == null) throw new Error(`Tab "${table}" tidak ditemukan di spreadsheet.`);
  return sheetId;
}

export async function remove(table: TableName, id: string): Promise<void> {
  const found = (await readRows(table)).find((r) => (r.data as Record<string, string>).id === id);
  if (!found) return; // sudah terhapus
  const sheetId = await sheetIdOf(table);

  await withRetry(() =>
    sheetsClient().spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId(),
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: found.rowNumber - 1,
                endIndex: found.rowNumber,
              },
            },
          },
        ],
      },
    }),
  );
}
