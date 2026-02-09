import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import authConfig from "./auth.config";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Gunakan restAuthConfig di awal agar bisa ditimpa oleh konfigurasi spesifik di bawahnya
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await clientPromise;
        const user = await client.db().collection("users").findOne({ email: credentials.email });

        if (user && user.password) {
          const isMatch = await bcrypt.compare(credentials.password as string, user.password);
          if (isMatch) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
            };
          }
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      checks: ["none"],
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
  callbacks: {
    // Panggil callback authorized dari config jika ada
    ...authConfig.callbacks,
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error", 
  },
});