// src/middleware.ts
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");

  // Redirect ke login jika akses dashboard tanpa session
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Redirect ke dashboard jika sudah login tapi akses halaman auth
  if (
    isLoggedIn &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Teruskan request + tambah x-pathname header
  const response = NextResponse.next({
    request: {
      headers: new Headers(req.headers), // salin semua headers asli
    },
  });
  response.headers.set("x-pathname", nextUrl.pathname);

  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};