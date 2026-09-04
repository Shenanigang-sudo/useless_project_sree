import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "IRIKK — AI Seating Assistant",
  description:
    "Because choosing a seat apparently needed AI. Upload a photo, tell us what you're doing, we'll overthink the seat for you.",
  keywords: [
    "AI",
    "seating",
    "chair",
    "classroom",
    "seat finder",
    "seat analysis",
  ],
  authors: [{ name: "IRIKK" }],
  openGraph: {
    title: "IRIKK — AI Seating Assistant",
    description: "Because choosing a seat apparently needed AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#E63226",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable}`}
    >
      <body className="bg-irikk-off-white text-irikk-black antialiased">
        {children}
      </body>
    </html>
  );
}
