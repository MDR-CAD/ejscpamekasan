import {redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {canWrite} from "@/lib/schema";
import {EventForm} from "@/components/EventForm";
import {createEvent} from "../actions";

export const metadata = {title: "Tambah kegiatan"};

export default async function NewEventPage() {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Tambah kegiatan</h1>
      <EventForm action={createEvent} />
    </div>
  );
}
