import Image from "next/image";

// Foto dengan latar cadangan: jika src kosong, tampil latar teal muda + pola kotak + ikon gambar.
export function Photo({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br from-brand-100 to-brand-50 ${className}`}
    >
      {src ? (
        // Gambar dari link luar (https://...) ditampilkan apa adanya (unoptimized), jadi tidak perlu
        // mendaftarkan domainnya di next.config. Gambar lokal (/images/...) tetap dioptimasi.
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={src.startsWith("http")}
          className="object-cover"
        />
      ) : (
        <>
          <div className="grid-pattern-light absolute inset-0" aria-hidden />
          <svg
            className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-brand-600/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="m21 16-5-5-8 8" />
          </svg>
        </>
      )}
    </div>
  );
}
