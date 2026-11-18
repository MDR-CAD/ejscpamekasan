import {getAll} from "./sheets";

export type EventItem = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // teks bebas, mis. "15:00 WIB"
  place: string;
};

/** Tanggal hari ini menurut WIB (UTC+7), format YYYY-MM-DD. */
export function todayWIB(): string {
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Kegiatan yang belum lewat, tanggal terdekat lebih dulu. Dibaca dari Google Sheets. */
export async function upcomingEvents(limit = 3): Promise<EventItem[]> {
  const today = todayWIB();
  return (await getAll("kegiatan"))
    .filter((r) => r.tanggal >= today)
    .sort(
      (a, b) =>
        a.tanggal.localeCompare(b.tanggal) ||
        a.created_at.localeCompare(b.created_at),
    )
    .slice(0, limit)
    .map((r) => ({
      id: r.id,
      title: r.judul,
      date: r.tanggal,
      time: r.waktu,
      place: r.lokasi,
    }));
}

/** "2026-12-14" → { day: 14, month: "Des" } untuk lencana tanggal. */
export function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getUTCDate(),
    month: d.toLocaleString("id-ID", {month: "short", timeZone: "UTC"}),
  };
}
