import {notFound, redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {getById} from "@/lib/sheets";
import {canWrite} from "@/lib/schema";
import {GalleryForm} from "@/components/GalleryForm";
import {updatePhoto} from "../actions";

export const metadata = {title: "Edit foto"};

export default async function EditPhotoPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  const {id} = await params;
  const photo = await getById("gallery", id);
  if (!photo) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Edit foto</h1>
      <GalleryForm
        action={updatePhoto.bind(null, id)}
        initial={{judul: photo.judul, tanggal: photo.tanggal}}
        currentImage={photo.gambar || undefined}
      />
    </div>
  );
}
