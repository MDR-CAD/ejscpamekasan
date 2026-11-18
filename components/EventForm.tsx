"use client";

import Link from "next/link";
import {useActionState} from "react";
import {SubmitButton} from "@/components/SubmitButton";
import type {FormState} from "@/lib/form-state";

type Values = {judul: string; tanggal: string; waktu: string; lokasi: string};

const today = () => new Date().toISOString().slice(0, 10);

export function EventForm({
  action,
  initial,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  initial?: Partial<Values>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const v: Values = {
    judul: "",
    tanggal: today(),
    waktu: "",
    lokasi: "",
    ...initial,
    ...state.values,
  };

  return (
    <form action={formAction} className="card max-w-xl space-y-4">
      {state.error && <p className="error-box">{state.error}</p>}

      <div>
        <label htmlFor="judul" className="label">
          Nama kegiatan *
        </label>
        <input
          id="judul"
          name="judul"
          required
          defaultValue={v.judul}
          className="input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tanggal" className="label">
            Tanggal *
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
          <label htmlFor="waktu" className="label">
            Waktu
          </label>
          <input
            id="waktu"
            name="waktu"
            placeholder="mis. 15:00 WIB"
            defaultValue={v.waktu}
            className="input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lokasi" className="label">
          Tempat
        </label>
        <input
          id="lokasi"
          name="lokasi"
          placeholder="mis. Aula Kampus atau Via Zoom (Online)"
          defaultValue={v.lokasi}
          className="input"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>Simpan</SubmitButton>
        <Link href="/kegiatan" className="btn btn-secondary">
          Batal
        </Link>
      </div>
    </form>
  );
}
