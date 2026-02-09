// src/proxy.ts
import { auth } from "@/auth";

// Auth.js v5 (NextAuth) mendukung penggunaan 'auth' sebagai middleware/proxy secara langsung
export const proxy = auth;

export const config = {
  // Gunakan matcher yang bersih
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};