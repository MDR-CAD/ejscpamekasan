import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const orgName = process.env.ORG_NAME || "Organisasi Kampus";

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar user={user} orgName={orgName} />
      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
