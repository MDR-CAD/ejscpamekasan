// ✏️ PENGATURAN UTAMA SITUS: nama, kontak, sosial media, dan menu navbar.
// Cukup ubah file ini, seluruh situs ikut berubah.

export const siteConfig = {
  name: "EJSC BAKORWIL PAMEKASAN",
  shortName: "EJSC", // singkatan, tampil di logo
  description:
    "EJSC Pamekasan adalah ruang kolaborasi di Madura untuk belajar, berkarya, dan bertumbuh bersama.",
  logo: null as string | null, // contoh: "/logo.png" (taruh file di folder public/)
  heroImage: null as string | null, // contoh: "/images/hero.jpg"
  contact: {
    address:
      "EJSC Pamekasan (EJSC Madura Coworking Space), Jl. Slamet Riadi No. 01, Barurambat Kota, Kec. Pamekasan, Kabupaten Pamekasan, Jawa Timur 69317",
    email: "ejsc@jatimprov.go.id",
    phone: "082234186308",
    whatsapp: "6282234186308", // format internasional, tanpa + dan tanpa spasi
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.7170740296897!2d113.47958427403934!3d-7.158672370233337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd77d33aa19f059%3A0xd6e3220a7c06d1e0!2sEJSC%20PAMEKASAN%20(EJSC%20MADURA%20Coworking%20Space)!5e0!3m2!1sid!2sid!4v1794976128163!5m2!1sid!2sid", // URL "src" dari Google Maps → Bagikan → Sematkan peta
  },
  social: [
    {label: "Instagram", href: "https://instagram.com/"},
    {label: "Facebook", href: "https://facebook.com/"},
    {label: "YouTube", href: "https://youtube.com/"},
  ],
};

export type NavItem = {
  label: string;
  href?: string; // menu biasa
  children?: {label: string; href: string}[]; // menu dropdown
};

// Urutan di sini = urutan di navbar. Tombol "Login" ada di komponen Navbar.
export const navItems: NavItem[] = [
  {label: "Beranda", href: "/"},
  {
    label: "Profil",
    children: [
      {label: "Sejarah", href: "/profil/sejarah"},
      {label: "Visi dan Misi", href: "/profil/visi-misi"},
      {label: "Struktur Pengurus", href: "/profil/struktur-pengurus"},
    ],
  },
  {
    label: "Info",
    children: [
      {label: "Berita", href: "/berita"},
      {label: "Opini", href: "/opini"},
    ],
  },
  {label: "Galeri", href: "/galeri"},
  {label: "Dokumen", href: "/dokumen"},
  {label: "Kontak", href: "/kontak"},
];
