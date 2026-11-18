import {Hero} from "@/components/home/Hero";
import {Stats} from "@/components/home/Stats";
import {QuickLinks} from "@/components/home/QuickLinks";
import {About} from "@/components/home/About";
import {NewsSection} from "@/components/home/NewsSection";
import {EventSection} from "@/components/home/EventSection";
import {CtaBanner} from "@/components/home/CtaBanner";
import {Quotes} from "@/components/home/Quotes";

// Berita terbaru di Beranda dibaca dari spreadsheet; halaman diperbarui paling lama tiap 60 detik.
export const revalidate = 60;

// Halaman Beranda = susunan bagian dari atas ke bawah.
// Mau memindah / menghapus bagian? Cukup ubah urutan atau hapus barisnya.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <QuickLinks />
      <About />
      <NewsSection />
      <EventSection />
      <CtaBanner />
      <Quotes />
    </>
  );
}
