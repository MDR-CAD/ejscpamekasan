import {notFound, redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {getById} from "@/lib/sheets";
import {canWrite} from "@/lib/schema";
import {ArticleForm} from "@/components/ArticleForm";
import {updateArticle} from "../actions";

export const metadata = {title: "Edit tulisan"};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  const {id} = await params;
  const article = await getById("articles", id);
  if (!article) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Edit tulisan</h1>
      <ArticleForm
        action={updateArticle.bind(null, id)}
        initial={{
          judul: article.judul,
          kategori: article.kategori,
          tanggal: article.tanggal,
          status: article.status,
          penulis: article.penulis,
          gambar: article.gambar,
          ringkasan: article.ringkasan,
          isi: article.isi,
        }}
      />
    </div>
  );
}
