import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAll } from "@/lib/sheets";
import { canWrite } from "@/lib/schema";
import { DivisionForm } from "@/components/DivisionForm";
import { createDivision } from "../actions";

export const metadata = { title: "Tambah divisi" };

export default async function NewDivisionPage() {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/divisi");

  const members = await getAll("members");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Tambah divisi</h1>
      <DivisionForm
        action={createDivision}
        members={members
          .filter((m) => m.status === "aktif")
          .sort((a, b) => a.nama.localeCompare(b.nama, "id"))
          .map((m) => ({ id: m.id, nama: m.nama }))}
      />
    </div>
  );
}
