"use client";

import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="btn btn-ghost btn-sm text-slate-500 hover:text-red-600 hover:bg-red-50 justify-start pl-2 w-full transition-colors"
    >
      <FaSignOutAlt className="w-4" /> Keluar
    </button>
  );
}