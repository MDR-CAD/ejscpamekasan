import {Navbar} from "@/components/layout/Navbar";
import {Footer} from "@/components/layout/Footer";

// Bingkai semua halaman publik: navbar di atas, footer di bawah.
export default function PublicLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
