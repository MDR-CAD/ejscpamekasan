import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAll, getById } from "@/lib/sheets";
import { canWrite } from "@/lib/schema";
import { MemberForm } from "@/components/MemberForm";
import { updateMember } from "../actions";

export const metadata = { title: "Edit anggota" };

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/anggota");

  const { id } = await params;
  const [member, divisions] = await Promise.all([getById("members", id), getAll("divisions")]);
  if (!member) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Edit anggota</h1>
      <MemberForm
        action={updateMember.bind(null, id)}
        divisions={divisions.map((d) => ({ id: d.id, nama_divisi: d.nama_divisi }))}
        initial={{
          nama: member.nama,
          nim: member.nim,
          divisi_id: member.divisi_id,
          jabatan: member.jabatan,
          no_hp: member.no_hp,
          tgl_bergabung: member.tgl_bergabung,
          status: member.status,
        }}
      />
    </div>
  );
}
