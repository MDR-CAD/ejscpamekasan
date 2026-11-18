// ✏️ ISI HALAMAN BERANDA (selain berita & event, yang ada di file sendiri).
import {siteConfig} from "@/config/site";

export const about = {
  eyebrow: "Siapa Kami",
  title: "Tentang EJSC Pamekasan",
  text: [
    "EJSC Pamekasan (EJSC Madura Coworking Space) adalah ruang kolaborasi di Pamekasan, Madura, tempat anak muda belajar, bekerja, dan berkarya bersama dalam satu komunitas.",
    "Kami percaya bahwa kemajuan tumbuh dari kolaborasi dan saling berbagi. Lewat berbagai kegiatan, kami mendorong anggota untuk mengembangkan kemampuan, memperluas jaringan, dan memberi manfaat bagi masyarakat sekitar.",
  ],
};

export const stats = [
  {label: "Divisi", value: "5"},
  {label: "Anggota Aktif", value: "120+"},
  {label: "Program Kerja", value: "24"},
  {label: "Tahun Berdiri", value: "2015"},
];

// Kartu akses cepat di bawah statistik. Kartu pertama tampil lebih lebar.
export const quickLinks = [
  {
    title: "Program Unggulan",
    desc: "Kenali visi, misi, dan program kerja yang sedang kami jalankan.",
    href: "/profil/visi-misi",
    cta: "Lihat program",
  },
  {
    title: "Aktivitas",
    desc: "Temukan informasi dan kabar terbaru dari organisasi.",
    href: "/berita",
    cta: "Baca berita",
  },
  {
    title: "Hotline",
    desc: `Hubungi kami lewat WhatsApp di ${siteConfig.contact.phone}.`,
    href: `https://wa.me/${siteConfig.contact.whatsapp}`,
    cta: "Kirim pesan",
  },
  {
    title: "Dokumen",
    desc: "Kumpulan dokumen resmi, formulir, dan panduan organisasi.",
    href: "/dokumen",
    cta: "Buka dokumen",
  },
  {
    title: "Kontak & Pengaduan",
    desc: "Sampaikan masukan, kritik, atau pengaduan kepada pengurus.",
    href: "/kontak",
    cta: "Hubungi kami",
  },
];

// Ganti dengan kutipan nyata dari tokoh / pendiri / alumni (dengan izin).
export const quotes = [
  {
    text: "Tulis kutipan tokoh atau pendiri di sini.",
    nama: "Nama Tokoh",
    jabatan: "Pendiri",
  },
  {
    text: "Kutipan kedua tentang semangat berorganisasi.",
    nama: "Nama Tokoh",
    jabatan: "Alumni",
  },
  {
    text: "Kutipan ketiga dari pembina atau dosen.",
    nama: "Nama Tokoh",
    jabatan: "Pembina",
  },
];
