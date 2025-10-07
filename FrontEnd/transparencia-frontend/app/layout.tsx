import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🪪 Metadatos de tu proyecto
export const metadata: Metadata = {
  title: "Transparencia Colombia",
  description:
    "Plataforma digital para acceder fácilmente a información sobre subsidios y programas del Estado colombiano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        
        <Navbar />

        
        <main className="flex-1 min-h-screen">{children}</main>

      </body>
    </html>
  );
}
