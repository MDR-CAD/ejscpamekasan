import {PageHeader} from "@/components/ui/PageHeader";
import {Section} from "@/components/ui/Section";
import {siteConfig} from "@/config/site";

export const metadata = {title: "Kontak"};

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
        {title}
      </p>
      <div className="mt-2 text-slate-700">{children}</div>
    </div>
  );
}

export default function KontakPage() {
  const {contact} = siteConfig;
  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi Kami"
        description="Sampaikan pertanyaan, masukan, atau pengaduan kepada pengurus."
      />
      <Section tone="muted">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <InfoCard title="Alamat">{contact.address}</InfoCard>
            <InfoCard title="Email">
              <a
                href={`mailto:${contact.email}`}
                className="font-medium text-brand-700 hover:underline"
              >
                {contact.email}
              </a>
            </InfoCard>
            <InfoCard title="Telepon / WhatsApp">
              <p className="mb-4">{contact.phone}</p>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid"
              >
                Chat via WhatsApp
              </a>
            </InfoCard>
          </div>

          <div className="surface min-h-72 overflow-hidden">
            {contact.mapEmbed ? (
              <iframe
                src={contact.mapEmbed}
                title="Lokasi sekretariat"
                className="h-full min-h-72 w-full"
                loading="lazy"
              />
            ) : (
              <div className="grid h-full min-h-72 place-items-center p-6 text-center text-sm text-slate-500">
                <span>
                  Peta belum diatur. Isi{" "}
                  <code className="mx-1 rounded bg-slate-100 px-1">
                    mapEmbed
                  </code>{" "}
                  di config/site.ts.
                </span>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
