"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaCog, FaHistory } from "react-icons/fa";

const NAV_ITEMS = [
  { href: "/dashboard",            label: "Dashboard",  icon: <FaHome className="w-4" /> },
  { href: "/dashboard/riwayat",    label: "Riwayat",    icon: <FaHistory className="w-4" /> },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: <FaCog className="w-4" /> },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <ul className="menu flex-1 gap-1 px-0 text-slate-600">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);

        return (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {icon}
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}