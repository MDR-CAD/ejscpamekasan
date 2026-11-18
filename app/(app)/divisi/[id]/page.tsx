import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAll, getById } from "@/lib/sheets";
import { canWrite } from "@/lib/schema";
import { DivisionForm } from "@/components/DivisionForm";
import { updateDivision } from "../actions";

export const metadata = { title: "Edit divisi" };

export default async function EditDivisionPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/divisi");

  const { id } = await params;
  const [division, members] = await Promise.all([getById("divisions", id), getAll("members")]);
  if (!division) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Edit divisi</h1>
      <DivisionForm
        action={updateDivision.bind(null, id)}
        members={members
          .filter((m) => m.status === "aktif" || m.id === division.ketua_id)
          .sort((a, b) => a.nama.localeCompare(b.nama, "id"))
          .map((m) => ({ id: m.id, nama: m.nama }))}
        initial={{
          nama_divisi: division.nama_divisi,
          deskripsi: division.deskripsi,
          ketua_id: division.ketua_id,
        }}
      />
    </div>
  );
}
