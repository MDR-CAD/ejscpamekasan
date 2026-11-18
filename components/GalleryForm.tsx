"use client";

import Link from "next/link";
import {ImageInput} from "@/components/ImageInput";
import {useActionState} from "react";
import {SubmitButton} from "@/components/SubmitButton";
import type {FormState} from "@/lib/form-state";

type Values = {judul: string; tanggal: string};

const today = () => new Date().toISOString().slice(0, 10);

export function GalleryForm({
  action,
  initial,
  currentImage,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  initial?: Partial<Values>;
  /** Link foto saat ini (hanya saat mengedit). */
  currentImage?: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const v: Values = {judul: "", tanggal: today(), ...initial, ...state.values};
  const editing = Boolean(currentImage);

  return (
    <form action={formAction} className="card max-w-xl space-y-4">
      {state.error && <p className="error-box">{state.error}</p>}

      <div>
        <label htmlFor="judul" className="label">
          Judul kegiatan *
        </label>
        <input
          id="judul"
          name="judul"
          required
          defaultValue={v.judul}
          className="input"
        />
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
        <label htmlFor="foto" className="label">
          {editing ? "Ganti foto (opsional)" : "Foto *"}
        </label>
        <ImageInput id="foto" name="foto" required={!editing} />
        <p className="mt-1 text-xs text-slate-500">
          JPG, JPEG, atau PNG. Maksimal 3 MB.
        </p>
        {currentImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImage}
            alt="Foto saat ini"
            className="mt-3 h-32 w-48 rounded-md object-cover"
          />
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>Simpan</SubmitButton>
        <Link href="/kelola-galeri" className="btn btn-secondary">
          Batal
        </Link>
      </div>
    </form>
  );
}
