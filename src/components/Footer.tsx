"use client";

import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaThermometerHalf 
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Kolom 1: Brand & Identitas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-white">
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
              <li>
                <Link href="/fitur" className="hover:text-secondary transition-colors">
                  Fitur & Keunggulan
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-secondary transition-colors">
                  Cara Kerja Alat
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-secondary transition-colors">
                  Akses Aplikasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Dukungan & Kontak */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Hubungi Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-secondary w-5 flex-shrink-0" />
                <span className="text-slate-400">
                  Jl. Teknologi Peternakan No. 88, <br />Jawa Barat, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-secondary w-5 flex-shrink-0" />
                <span className="text-slate-400">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-secondary w-5 flex-shrink-0" />
                <span className="text-slate-400">support@broilersmart.id</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Sosial Media</h3>
            <div className="flex gap-4 mb-6">
              <a 
                href="#" 
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all border border-slate-700"
              >
                <FaFacebook />
              </a>
              <a 
                href="#" 
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all border border-slate-700"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all border border-slate-700"
              >
                <FaYoutube />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all border border-slate-700"
              >
                <FaLinkedin />
              </a>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ikuti kami untuk update teknologi peternakan terbaru dan tips manajemen kandang.
            </p>
          </div>

        </div>
      </div>

      {/* Bagian Copyright */}
      <div className="border-t border-slate-800 mt-16 pt-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; {currentYear} BroilerSmart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}