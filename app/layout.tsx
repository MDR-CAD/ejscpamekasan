import type {Metadata} from "next";
import {Plus_Jakarta_Sans} from "next/font/google";
import {siteConfig} from "@/config/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {default: siteConfig.name, template: `%s | ${siteConfig.shortName}`},
  description: siteConfig.description,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={jakarta.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
