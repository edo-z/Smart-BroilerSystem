import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Image from 'next/image';
import heroImg from '../../public/logo.png'; // Import langsung untuk gambar lokal

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

        {/* 1. Navbar (Global) */}
        <Navbar />

        {/* 2. Main Content (Halaman) */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* 3. Footer Global (Disesuaikan tema Peternakan) */}
        <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

              {/* Kolom 1: Brand & Identitas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  {/* Icon representasi alat/IoT */}
                  BroilerSmart
                </div>
                <p className="text-sm leading-relaxed text-slate-400">
                  Solusi cerdas monitoring lingkungan kandang ayam broiler.
                  Menjaga suhu dan kelembapan optimal untuk hasil ternak yang maksimal dan berkelanjutan.
                </p>
              </div>

              {/* Kolom 2: Link Cepat */}
              <div>
                <h3 className="text-white text-lg font-bold mb-6">Produk</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="/soon" className="hover:text-secondary transition-colors">Fitur & Keunggulan</a></li>
                  <li><a href="/docs/overview" className="hover:text-secondary transition-colors">Cara Kerja Alat</a></li>
                  <li><a href="/soon" className="hover:text-secondary transition-colors">Akses Aplikasi</a></li>
                </ul>
              </div>

              {/* Kolom 3: Dukungan & Kontak */}
              <div>
                <h3 className="text-white text-lg font-bold mb-6">Hubungi Kami</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <FaMapMarkerAlt className="mt-1 text-secondary" />
                    <span>Jl. Teknologi Peternakan No. 88, <br />Jawa Barat, Indonesia</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaPhone className="text-secondary" />
                    <span>+62 812-3456-7890</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaEnvelope className="text-secondary" />
                    <span>support@broilersmart.id</span>
                  </li>
                </ul>
              </div>

              {/* Kolom 4: Newsletter & Sosial Media */}
              <div>
                <h3 className="text-white text-lg font-bold mb-6">Sosial Media</h3>
                <div className="flex gap-4 mb-6">
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all">
                    <FaFacebook />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all">
                    <FaInstagram />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all">
                    <FaYoutube />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all">
                    <FaLinkedin />
                  </a>
                </div>
                <p className="text-xs text-slate-500">
                  Ikuti kami untuk tips manajemen kandang terbaru.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} BroilerSmart Technologies. All rights reserved.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}