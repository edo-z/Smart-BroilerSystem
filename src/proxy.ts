// src/middleware.ts
import authConfig from "./auth.config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)
export const { auth: middleware } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")

  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }
})

export const config = {
  // Melindungi semua yang ada di dalam folder dashboard
  matcher: ["/dashboard/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"]
}   