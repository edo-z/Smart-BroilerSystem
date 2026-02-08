// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [], // Providers akan diisi lengkap di auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; 
      }
      return true;
    },
  },
} satisfies NextAuthConfig;