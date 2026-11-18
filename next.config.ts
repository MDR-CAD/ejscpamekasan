import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  // googleapis besar; biarkan di-load apa adanya di server, bukan di-bundle.
  serverExternalPackages: ["googleapis"],

  // Form tulisan bisa membawa gambar sampul (maks 3 MB); batas bawaan Next.js hanya 1 MB.
  experimental: {serverActions: {bodySizeLimit: "4mb"}},
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {key: "X-Frame-Options", value: "DENY"},
          {key: "X-Content-Type-Options", value: "nosniff"},
          {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
        ],
      },
    ];
  },
};

export default nextConfig;
