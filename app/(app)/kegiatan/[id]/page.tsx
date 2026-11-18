import {notFound, redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {getById} from "@/lib/sheets";
import {canWrite} from "@/lib/schema";
import {EventForm} from "@/components/EventForm";
import {updateEvent} from "../actions";

export const metadata = {title: "Edit kegiatan"};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  const {id} = await params;
  const event = await getById("kegiatan", id);
  if (!event) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Edit kegiatan</h1>
      <EventForm
        action={updateEvent.bind(null, id)}
        initial={{
          judul: event.judul,
          tanggal: event.tanggal,
          waktu: event.waktu,
          lokasi: event.lokasi,
        }}
      />
    </div>
  );
}
