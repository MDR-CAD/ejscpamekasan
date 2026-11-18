import {Section} from "@/components/ui/Section";
import {dateParts, upcomingEvents} from "@/lib/events";

export async function EventSection() {
  const upcoming = await upcomingEvents(3);
  return (
    <Section tone="dark" eyebrow="Event" title="Ikuti [Kegiatan Kami]">
      {upcoming.length === 0 ? (
        <p className="text-white/65">Belum ada kegiatan mendatang.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {upcoming.map((e) => {
            const p = dateParts(e.date);
            return (
              <article
                key={e.id}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-brand-600 text-center leading-none text-white">
                  <span>
                    <span className="block text-2xl font-extrabold">
                      {p.day}
                    </span>
                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-brand-100">
                      {p.month}
                    </span>
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold leading-snug text-white">
                    {e.title}
                  </h3>
                  {e.time && (
                    <p className="mt-1.5 text-sm text-white/65">{e.time}</p>
                  )}
                  {e.place && (
                    <p className="text-sm text-white/65">{e.place}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
}
