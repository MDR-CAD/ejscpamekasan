# Sistem Organisasi Kampus

Aplikasi manajemen organisasi kampus: **Next.js (App Router) + React + TypeScript**, database **Google Sheets**, login **username/password**, deploy gratis lewat **GitHub + Vercel**.

**Fitur saat ini (MVP):** login & peran (admin / pengurus / anggota), data anggota (cari, filter, tambah, ubah, hapus), divisi (termasuk ketua), dashboard ringkas.

## Cara kerja singkat

```
Browser → Next.js (Server Actions / Server Components) → Google Sheets API
```

Google Sheets hanya diakses dari **server**. Kunci service account tidak pernah dikirim ke browser.

| Peran | Hak akses |
|---|---|
| `admin` | Lihat + ubah semua data |
| `pengurus` | Lihat + ubah anggota & divisi |
| `anggota` | Hanya lihat |

---

## 1. Siapkan Google Sheets (sekali saja)

1. Buka <https://console.cloud.google.com> → buat **project** baru.
2. **APIs & Services → Library** → cari **Google Sheets API** → **Enable**.
3. **APIs & Services → Credentials → Create credentials → Service account**. Beri nama (mis. `organisasi-app`), lalu selesai.
4. Buka service account tadi → tab **Keys → Add key → Create new key → JSON**. File JSON terunduh. **Simpan baik-baik, jangan di-commit.**
5. Buat **spreadsheet kosong** di <https://sheets.google.com>. Salin ID-nya dari URL:
   `https://docs.google.com/spreadsheets/d/`**`ID_INI`**`/edit`
6. Klik **Share** pada spreadsheet → tambahkan alamat `client_email` dari file JSON → beri akses **Editor**.

## 2. Jalankan di komputer sendiri

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
```

Isi `.env.local`:

| Variabel | Isi |
|---|---|
| `GOOGLE_CLIENT_EMAIL` | field `client_email` dari file JSON |
| `GOOGLE_PRIVATE_KEY` | field `private_key` dari file JSON (satu baris, pakai tanda kutip, `\n` biarkan apa adanya) |
| `SPREADSHEET_ID` | ID spreadsheet dari langkah 1.5 |
| `AUTH_SECRET` | string acak ≥ 32 karakter: `openssl rand -base64 32` |
| `ORG_NAME` | nama organisasi (opsional) |

Lalu:

```bash
npm run setup-sheets                                  # membuat semua tab + header otomatis
npm run add-user -- admin "Nama Anda" admin           # membuat akun admin (password ditanya)
npm run dev                                           # buka http://localhost:3000
```

Akun lain dibuat dengan perintah `add-user` yang sama, mis. `npm run add-user -- sekretaris "Siti Aminah" pengurus`.

## 3. Deploy ke GitHub + Vercel (gratis)

1. Buat repo baru di GitHub, lalu dari folder proyek:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
   Pastikan `.env.local` dan file JSON service account **tidak ikut** ter-commit (sudah ada di `.gitignore`).
2. Buka <https://vercel.com> → login dengan GitHub → **Add New → Project** → pilih repo tadi.
3. Sebelum klik **Deploy**, buka **Environment Variables** dan isi kelima variabel di atas. Untuk `GOOGLE_PRIVATE_KEY`, tempel isi `private_key` apa adanya (boleh multi-baris, tanpa tanda kutip tambahan).
4. **Deploy.** Selanjutnya setiap `git push` ke `main` otomatis di-deploy ulang.

## Struktur proyek

```
app/
  login/                 halaman + server action login
  (app)/                 area yang wajib login (layout cek sesi)
    dashboard/  anggota/  divisi/
lib/
  sheets.ts              CRUD generik: getAll, getById, create, update, remove
  schema.ts              daftar tab & kolom (sumber kebenaran struktur sheet)
  auth.ts, session.ts    sesi (JWT di cookie httpOnly) + pengecekan peran
  validations.ts         validasi input dengan Zod
scripts/
  setup-sheets.ts        buat tab + header
  add-user.ts            tambah user (password di-hash bcrypt)
```

Tab `events`, `attendance`, `announcements`, `finance` sudah disiapkan oleh `setup-sheets` untuk tahap 2, tetapi belum ada halamannya.

## Keamanan yang sudah diterapkan

- Password di-hash **bcrypt** (cost 12); tidak pernah disimpan polos.
- Sesi: JWT bertanda tangan di cookie `httpOnly`, `sameSite=lax`, `secure` di produksi, berlaku 7 hari.
- Peran & status akun dicek ulang ke spreadsheet di **setiap request**, jadi akun yang dinonaktifkan langsung kehilangan akses.
- Semua aksi ubah/hapus mengecek hak akses **di server** (bukan hanya menyembunyikan tombol).
- Input divalidasi dengan Zod; data ditulis dengan mode `RAW` sehingga teks seperti `=RUMUS()` tidak dieksekusi Sheets.
- Pembatas percobaan login (5x / 15 menit per IP+username), dengan catatan di bawah.

## Batasan yang perlu diketahui

- **Jangan share spreadsheet ke publik / "anyone with the link".** Tab `users` berisi hash password. Bagikan hanya ke pengurus yang perlu, dengan sadar bahwa mereka bisa mengedit data langsung.
- **Pembatas login bersifat "seadanya"** karena di Vercel (serverless) memorinya tidak dibagi antar instance. Gunakan password yang kuat.
- **Kuota & kecepatan:** Google Sheets API punya batas request per menit dan terasa lebih lambat (sekitar 0,2-0,8 detik per baca) dibanding database sungguhan. Cukup untuk organisasi kecil-menengah. Cek kuota terbaru di Google Cloud Console.
- **Tidak ada transaksi:** dua orang menyimpan perubahan pada baris yang sama di detik yang sama, yang terakhir menang.
- **Jangan menyimpan data sensitif** (NIK, data keuangan pribadi) di spreadsheet.
- **Vercel Hobby** untuk penggunaan non-komersial; organisasi kampus umumnya sesuai, tetapi baca ketentuan terbarunya.
- **Jalur upgrade:** seluruh akses data lewat `lib/sheets.ts`. Jika kelak pindah ke Supabase/Neon, cukup ganti file itu.

## Ide pengembangan berikutnya (tahap 2)

Halaman kelola pengguna untuk admin, agenda & absensi, pengumuman, kas sederhana, ekspor Excel/PDF.
