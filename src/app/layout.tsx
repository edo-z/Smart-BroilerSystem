import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { AuthProvider } from "@/components/providers/SessionProvider"; // Sesuaikan pathnya

export const metadata: Metadata = {
  title: "BroilerSmart - Monitoring Suhu Kandang Ayam IoT",
  description: "Alat pintar IoT monitoring suhu dan kelembapan kandang ayam broiler secara real-time. Cegah stres panas dan tingkatkan produktivitas peternakan Anda.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="emerald">
      <body className="min-h-screen flex flex-col font-sans bg-base-100 text-base-content">
        <AuthProvider>
          {/* 2. Main Content (Halaman) */}
          <main className="grow flex flex-col">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}