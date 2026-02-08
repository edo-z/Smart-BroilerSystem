"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarDocs() {
  const pathname = usePathname();

  // Fungsi helper untuk styling aktif vs non-aktif
  const getLinkClass = (href: string) => {
    // Cek apakah pathname persis sama dengan href
    const isActive = pathname === href;
    
    return isActive
      ? "text-primary bg-blue-50/50 border-r-4 border-primary font-semibold transition-all"
      : "hover:text-slate-600 border-r-4 border-transparent hover:bg-slate-50 transition-all";
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-24 h-[calc(100vh-5rem)] overflow-y-auto pr-2 hidden lg:block space-y-8 pb-20">
        
        {/* Group 1: Panduan Pengguna */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">
            Selamat Datang
          </h3>
          <ul className="menu bg-white rounded-xl shadow-sm border border-slate-200 w-full text-sm font-medium">
            
            <li>
              <Link href="/docs/welcome" className={getLinkClass("/docs/welcome")}>
                Selamat Datang!
              </Link>
            </li>
          </ul>
        </div>
        {/* Groud 2: Referensi Teknis */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">
           Referensi Teknis
          </h3>
          <ul className="menu bg-white rounded-xl shadow-sm border border-slate-200 w-full text-sm font-medium">
            <li>
              <Link href="/docs/overview" className={getLinkClass("/docs/overview")}>
                Overview
              </Link>
            </li>
            <li>
              <Link href="/docs" className={getLinkClass("/docs")}>
                System Architecture
              </Link>
            </li>
            <li>
              <Link href="/docs/logic" className={getLinkClass("/docs/logic")}>
                Logic & Algorithms
              </Link>
            </li>
            <li>
              <Link href="/docs/software" className={getLinkClass("/docs/software")}>
                Software Architecture
              </Link>
            </li>
            <li>
              <Link href="/docs/install" className={getLinkClass("/docs/install")}>
                Installation & Usage
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </aside>
  );
}