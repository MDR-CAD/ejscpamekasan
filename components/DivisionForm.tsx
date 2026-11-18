"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import type { FormState } from "@/lib/form-state";

type Option = { id: string; nama: string };
type DivisionValues = { nama_divisi: string; deskripsi: string; ketua_id: string };

const EMPTY: DivisionValues = { nama_divisi: "", deskripsi: "", ketua_id: "" };

export function DivisionForm({
  action,
  members,
  initial,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  members: Option[];
  initial?: Partial<DivisionValues>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const v: DivisionValues = { ...EMPTY, ...initial, ...state.values };

  return (
    <form action={formAction} className="card max-w-2xl space-y-4">
      {state.error && <p className="error-box">{state.error}</p>}

      <div>
        <label htmlFor="nama_divisi" className="label">
          Nama divisi *
        </label>
        <input
          id="nama_divisi"
          name="nama_divisi"
          required
          defaultValue={v.nama_divisi}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="deskripsi" className="label">
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={3}
          defaultValue={v.deskripsi}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="ketua_id" className="label">
          Ketua divisi
        </label>
        <select id="ketua_id" name="ketua_id" defaultValue={v.ketua_id} className="input">
          <option value="">— Belum ditentukan —</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nama}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>Simpan</SubmitButton>
        <Link href="/divisi" className="btn btn-secondary">
          Batal
        </Link>
      </div>
    </form>
  );
}
