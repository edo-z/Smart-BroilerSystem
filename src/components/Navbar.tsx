import Link from 'next/link';
import { HiMenuAlt3 } from "react-icons/hi";
import { FaMicrochip } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100/95 backdrop-blur-md fixed top-0 z-50 px-6 md:px-12 transition-all duration-300 shadow-sm h-20 border-b border-slate-100">
      
      {/* 1. BRANDING (Modern Logo Style) */}
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Icon Box dengan background tipis */}
          <div className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <FaMicrochip className="text-xl" />
          </div>
          
          {/* Teks Logo dengan Subtitle */}
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
              BroilerSmart
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              IoT Monitoring
            </span>
          </div>
        </Link>
      </div>

      {/* 2. DESKTOP MENU (Minimalist & Clean) */}
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal px-1 gap-8 font-medium text-slate-600">
          <li>
            <Link href="/soon" className="hover:text-primary hover:bg-transparent transition-all text-sm">
              Fitur & Spesifikasi
            </Link>
          </li>
          <li>
            <Link href="/docs/overview" className="hover:text-primary hover:bg-transparent transition-all text-sm">
              Documentations
            </Link>
          </li>
          <li>
            <Link href="/soon" className="hover:text-primary hover:bg-transparent transition-all text-sm">
              Tips Peternak
            </Link>
          </li>
          
          {/* CTA Button (Outline Style for minimal look) */}
          <li className="ml-4">
            <Link 
              href="/login" 
              className="btn btn-sm btn-outline border-primary text-primary hover:bg-primary hover:text-white hover:border-primary rounded-full px-6 shadow-none"
            >
              Mulai Sekarang
            </Link>
          </li>
        </ul>
      </div>

      {/* 3. MOBILE MENU (Clean Dropdown) */}
      <div className="dropdown dropdown-end lg:hidden">
        <div 
          tabIndex={0} 
          role="button" 
          className="btn btn-ghost btn-circle hover:bg-slate-100 text-slate-600"
          aria-label="Open menu"
        >
          <HiMenuAlt3 className="text-2xl" />
        </div>
        
        <ul 
          tabIndex={0} 
          className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-xl bg-base-100 rounded-2xl w-60 border border-slate-100"
        >
          <li className="mb-2">
            <Link href="/soon" className="font-medium text-slate-700">Fitur Produk</Link>
          </li>
          <li className="mb-2">
            <Link href="/docs/overview" className="font-medium text-slate-700">Documentations</Link>
          </li>
          <li className="mb-4">
            <Link href="/soon" className="font-medium text-slate-700">Tips Peternak</Link>
          </li>
          
          <div className="divider my-0"></div>
          
          <li>
            <Link href="/soon" className="bg-primary text-white hover:bg-primary/90">
              Hubungi Kami
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}