"use client";

import Link from "next/link";
import {ImageInput} from "@/components/ImageInput";
import {useActionState} from "react";
import {SubmitButton} from "@/components/SubmitButton";
import type {FormState} from "@/lib/form-state";

type ArticleValues = {
  judul: string;
  kategori: string;
  tanggal: string;
  status: string;
  penulis: string;
  gambar: string;
  ringkasan: string;
  isi: string;
};

const today = () => new Date().toISOString().slice(0, 10);

export function ArticleForm({
  action,
  initial,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  initial?: Partial<ArticleValues>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  // Saat validasi gagal, isian pengguna dikembalikan dari state; jika tidak, pakai data awal.
  const v: ArticleValues = {
    judul: "",
    kategori: "berita",
    tanggal: today(),
    status: "terbit",
    penulis: "",
    gambar: "",
    ringkasan: "",
    isi: "",
    ...initial,
    ...state.values,
  };

  return (
    <form action={formAction} className="card max-w-3xl space-y-4">
      {state.error && <p className="error-box">{state.error}</p>}

      <div>
        <label htmlFor="judul" className="label">
          Judul *
        </label>
        <input
          id="judul"
          name="judul"
          required
          defaultValue={v.judul}
          className="input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="kategori" className="label">
            Kategori
          </label>
          <select
            id="kategori"
            name="kategori"
            defaultValue={v.kategori}
            className="input"
          >
            <option value="berita">Berita</option>
            <option value="opini">Opini</option>
          </select>
        </div>
        <div>
          <label htmlFor="tanggal" className="label">
            Tanggal
          </label>
          <input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            defaultValue={v.tanggal}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="status" className="label">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={v.status}
            className="input"
          >
            <option value="terbit">Terbit (tampil di situs)</option>
            <option value="draft">Draft (disembunyikan)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="penulis" className="label">
            Penulis
          </label>
          <input
            id="penulis"
            name="penulis"
            placeholder="Kosongkan untuk memakai nama Anda"
            defaultValue={v.penulis}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="gambar_file" className="label">
            Gambar sampul
          </label>
          <ImageInput id="gambar_file" name="gambar_file" />
          <p className="mt-1 text-xs text-slate-500">
            JPG, JPEG, atau PNG. Maksimal 3 MB.
          </p>
          {initial?.gambar && (
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={initial.gambar}
                alt="Gambar saat ini"
                className="h-16 w-24 rounded-md object-cover"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="hapus_gambar" /> Hapus gambar ini
              </label>
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="ringkasan" className="label">
          Ringkasan
        </label>
        <textarea
          id="ringkasan"
          name="ringkasan"
          rows={2}
          maxLength={300}
          placeholder="1-2 kalimat untuk kartu berita. Kosongkan untuk memakai potongan awal isi."
          defaultValue={v.ringkasan}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="isi" className="label">
          Isi *
        </label>
        <textarea
          id="isi"
          name="isi"
          required
          rows={14}
          defaultValue={v.isi}
          className="input"
        />
        <p className="mt-1 text-xs text-slate-500">
          Pisahkan paragraf dengan satu baris kosong.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>Simpan</SubmitButton>
        <Link href="/artikel" className="btn btn-secondary">
          Batal
        </Link>
      </div>
    </form>
  );
}
