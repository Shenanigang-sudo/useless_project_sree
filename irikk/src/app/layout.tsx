import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "IRIKK — Overengineered Seating Intelligence",
  description:
    "An unnecessarily intelligent AI seating assistant. We overthink the chair so your butt doesn't have to.",
  keywords: [
    "AI",
    "seating",
    "chair",
    "classroom",
    "seat finder",
    "seat analysis",
    "zine",
  ],
  authors: [{ name: "IRIKK PUNK LABS" }],
  openGraph: {
    title: "IRIKK — Overengineered Seating Intelligence",
    description: "Because choosing a seat apparently needed AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#E62B1E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="text-irikk-black antialiased selection:bg-irikk-red selection:text-white">
        {/* Top Underground Inspection Header Strip */}
        <header className="w-full bg-irikk-black text-irikk-white border-b-3 border-irikk-black py-1 px-3 text-[10px] md:text-xs font-mono flex items-center justify-between tracking-widest uppercase overflow-hidden">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-irikk-red animate-pulse inline-block" />
            IRIKK // SEAT INSPECTOR GEN-3.6
          </span>
          <span className="hidden sm:inline-block">
            DOC_REF: #IRK-990-VERDICT
          </span>
          <span className="text-irikk-red font-bold">
            UNNECESSARILY SERIOUS
          </span>
        </header>

        {children}
      </body>
    </html>
  );
}
