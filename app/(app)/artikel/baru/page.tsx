import {redirect} from "next/navigation";
import {requireUser} from "@/lib/auth";
import {canWrite} from "@/lib/schema";
import {ArticleForm} from "@/components/ArticleForm";
import {createArticle} from "../actions";

export const metadata = {title: "Tulis baru"};

export default async function NewArticlePage() {
  const user = await requireUser();
  if (!canWrite(user.role)) redirect("/dashboard");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Tulis baru</h1>
      <ArticleForm action={createArticle} />
    </div>
  );
}
