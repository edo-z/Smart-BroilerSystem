// src/app/(dashboard)/layout.tsx
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaHome,
  FaCog,
  FaThermometerHalf,
  FaBars,
  FaHistory,
} from "react-icons/fa";
import LogoutButton from "@/components/auth/LogoutButton";
import SidebarNav from "@/components/dashboard/SidebarNav";
export const dynamic = "force-dynamic";
// ─────────────────────────────────────────────
// Active state ditangani via CSS data-attribute
// yang di-set dari pathname server-side,
// sehingga layout tetap murni Server Component
// tanpa perlu memisahkan ke Client Component.
// ─────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: <FaHome className="w-4" /> },
  { href: "/dashboard/riwayat", label: "Riwayat", icon: <FaHistory className="w-4" /> },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: <FaCog className="w-4" /> },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Ambil session di Server Side
  const session = await auth();

  // 2. Redirect jika tidak ada session
  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  // 3. Ambil pathname dari headers untuk active state sidebar

  return (
    <div className="drawer lg:drawer-open bg-slate-50 min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* ─── SIDEBAR ─── */}
      <div className="drawer-side z-40 border-r border-slate-200 bg-white">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <div className="flex flex-col h-full w-64 relative p-4 bg-white">

          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <FaThermometerHalf />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">
                BroilerSmart
              </h1>
              <span className="text-xs text-slate-400 font-medium">Dashboard</span>
            </div>
          </div>

          {/* Navigasi dengan active state server-side */}
          <SidebarNav />

          {/* Profil User */}
          <div className="border-t border-slate-200 pt-4 mt-4">
            <div className="flex items-center gap-3 px-2 mb-4">
              {/* FIX 1 & 2: Gunakan next/image + avatar lokal sebagai fallback */}
              <div className="relative w-10 h-10 rounded-full ring-2 ring-slate-900 ring-offset-2 flex-shrink-0 overflow-hidden">
                <Image
                  src={user?.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "User")}&background=0f172a&color=fff`}
                  alt={user?.name ?? "Profile"}
                  fill
                  sizes="40px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="drawer-content flex flex-col">
        {/* Navbar Mobile */}
        <div className="navbar bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 px-6 lg:hidden">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-square btn-ghost text-slate-600"
          >
            <FaBars className="text-xl" />
          </label>
          <div className="flex-1 px-2 font-bold text-slate-900 uppercase text-sm tracking-widest">
            BroilerSmart
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}