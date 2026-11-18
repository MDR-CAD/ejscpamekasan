"use client";

import { useFormStatus } from "react-dom";

function Button() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-link text-red-600 disabled:opacity-50">
      {pending ? "Menghapus..." : "Hapus"}
    </button>
  );
}

export function DeleteButton({
  action,
  confirmText,
}: {
  action: () => Promise<void>;
  confirmText: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <Button />
    </form>
  );
}
