// src/app/(dashboard)/layout.tsx
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  FaHome, 
  FaCog, 
  FaThermometerHalf, 
  FaBars, 
  FaChartBar, 
  FaHistory 
} from "react-icons/fa";
import LogoutButton from "@/components/auth/LogoutButton"; 

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Ambil session di Server Side
  const session = await auth();

  // 2. Redirect jika tidak ada session (Ganda layer security bersama middleware)
  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="drawer lg:drawer-open bg-slate-50 min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* --- SIDEBAR --- */}
      <div className="drawer-side z-40 border-r border-slate-200 bg-white">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="flex flex-col h-full w-auto relative p-4 bg-white">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FaThermometerHalf />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">BroilerSmart</h1>
              <span className="text-xs text-slate-400 font-medium">Dashboard v2.0</span>
            </div>
          </div>

          {/* Navigasi */}
          <ul className="menu flex-1 gap-2 px-2 text-slate-600">
            <li>
              <Link href="/dashboard" className="hover:bg-slate-100 rounded-lg">
                <FaHome className="w-5" /> Overview
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:bg-slate-100 rounded-lg">
                <FaChartBar className="w-5" /> Data Real-time
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:bg-slate-100 rounded-lg">
                <FaHistory className="w-5" /> Riwayat
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:bg-slate-100 rounded-lg">
                <FaCog className="w-5" /> Pengaturan
              </Link>
            </li>
          </ul>

          {/* Profil User di Bawah */}
          <div className="border-t border-slate-200 pt-4 mt-4">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="avatar online">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100">
                  {/* 
                     TAMBAHKAN referrerPolicy="no-referrer" 
                     Agar gambar dari Google (NextAuth) bisa muncul tanpa error 403
                  */}
                  <img 
                    src={user?.image ?? "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            {/* Tombol Logout (Client Component) */}
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="drawer-content flex flex-col">
        {/* Navbar Mobile (Hanya muncul di layar kecil) */}
        <div className="navbar bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 px-6 lg:hidden">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost text-slate-600">
            <FaBars className="text-xl" />
          </label>
          <div className="flex-1 px-2 font-bold text-slate-900 uppercase text-sm tracking-widest">
            BroilerSmart
          </div>
        </div>

        {/* Content Area (Halaman page.tsx akan muncul di sini) */}
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}