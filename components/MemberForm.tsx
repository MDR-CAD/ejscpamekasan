"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import type { FormState } from "@/lib/form-state";

type Division = { id: string; nama_divisi: string };
type MemberValues = {
  nama: string;
  nim: string;
  divisi_id: string;
  jabatan: string;
  no_hp: string;
  tgl_bergabung: string;
  status: string;
};

const EMPTY: MemberValues = {
  nama: "",
  nim: "",
  divisi_id: "",
  jabatan: "",
  no_hp: "",
  tgl_bergabung: "",
  status: "aktif",
};

export function MemberForm({
  action,
  divisions,
  initial,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  divisions: Division[];
  initial?: Partial<MemberValues>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  // Saat validasi gagal, isian pengguna dikembalikan dari state; jika tidak, pakai data awal.
  const v: MemberValues = { ...EMPTY, ...initial, ...state.values };

  return (
    <form action={formAction} className="card max-w-2xl space-y-4">
      {state.error && <p className="error-box">{state.error}</p>}

      <div>
        <label htmlFor="nama" className="label">
          Nama lengkap *
        </label>
        <input id="nama" name="nama" required defaultValue={v.nama} className="input" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nim" className="label">
            NIM / No. anggota
          </label>
          <input id="nim" name="nim" defaultValue={v.nim} className="input" />
        </div>
        <div>
          <label htmlFor="no_hp" className="label">
            No. HP
          </label>
          <input
            id="no_hp"
            name="no_hp"
            type="tel"
            placeholder="08xxxxxxxxxx"
            defaultValue={v.no_hp}
            className="input"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="divisi_id" className="label">
            Divisi
          </label>
          <select id="divisi_id" name="divisi_id" defaultValue={v.divisi_id} className="input">
            <option value="">— Tanpa divisi —</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama_divisi}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="jabatan" className="label">
            Jabatan
          </label>
          <input
            id="jabatan"
            name="jabatan"
            placeholder="mis. Ketua, Sekretaris, Anggota"
            defaultValue={v.jabatan}
            className="input"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tgl_bergabung" className="label">
            Tanggal bergabung
          </label>
          <input
            id="tgl_bergabung"
            name="tgl_bergabung"
            type="date"
            defaultValue={v.tgl_bergabung}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="status" className="label">
            Status
          </label>
          <select id="status" name="status" defaultValue={v.status} className="input">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>Simpan</SubmitButton>
        <Link href="/anggota" className="btn btn-secondary">
          Batal
        </Link>
      </div>
    </form>
  );
}
