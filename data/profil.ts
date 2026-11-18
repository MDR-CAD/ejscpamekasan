// ✏️ ISI MENU PROFIL: Sejarah, Visi & Misi, Struktur Pengurus.

export const sejarah = {
  intro: [
    "EJSC Pamekasan (EJSC Madura Coworking Space) berdiri di Pamekasan, Madura, sebagai ruang kolaborasi bagi anak muda.",
  ],
  // Tonggak penting, urut dari yang terlama.
  timeline: [
    {tahun: "2015", teks: "Organisasi didirikan."},
    {tahun: "2018", teks: "Pembentukan divisi-divisi baru."},
    {tahun: "2022", teks: "Peluncuran program unggulan pertama."},
  ],
};

export const visi =
  "Tulis visi organisasi di sini dalam satu kalimat yang kuat.";

export const misi = [
  "Misi pertama organisasi.",
  "Misi kedua organisasi.",
  "Misi ketiga organisasi.",
];

// foto = "/images/nama.jpg" atau null (akan tampil latar hijau polos).
export const struktur = [
  {
    grup: "Pimpinan Harian",
    anggota: [
      {
        nama: "Nama Ketua Umum",
        jabatan: "Ketua Umum",
        foto: null as string | null,
      },
      {
        nama: "Nama Sekretaris",
        jabatan: "Sekretaris Umum",
        foto: null as string | null,
      },
      {
        nama: "Nama Bendahara",
        jabatan: "Bendahara Umum",
        foto: null as string | null,
      },
    ],
  },
  {
    grup: "Koordinator Divisi",
    anggota: [
      {
        nama: "Nama Koordinator",
        jabatan: "Divisi Humas",
        foto: null as string | null,
      },
      {
        nama: "Nama Koordinator",
        jabatan: "Divisi Media",
        foto: null as string | null,
      },
      {
        nama: "Nama Koordinator",
        jabatan: "Divisi Kaderisasi",
        foto: null as string | null,
      },
    ],
  },
];
