import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAll } from "@/lib/sheets";
import { canWrite } from "@/lib/schema";
import { MemberForm } from "@/components/MemberForm";
import { createMember } from "../actions";

export const metadata = { title: "Tambah anggota" };

export default async function NewMemberPage() {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/anggota");

  const divisions = await getAll("divisions");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Tambah anggota</h1>
      <MemberForm
        action={createMember}
        divisions={divisions.map((d) => ({ id: d.id, nama_divisi: d.nama_divisi }))}
      />
    </div>
  );
}
