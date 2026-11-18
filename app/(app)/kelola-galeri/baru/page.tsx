import {redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {canWrite} from "@/lib/schema";
import {GalleryForm} from "@/components/GalleryForm";
import {createPhoto} from "../actions";

export const metadata = {title: "Tambah foto"};

export default async function NewPhotoPage() {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Tambah foto</h1>
      <GalleryForm action={createPhoto} />
    </div>
  );
}
