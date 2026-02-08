"use server"

// Perhatikan: Kita mengimpor signIn dari file konfigurasi UTAMA kita di src/auth.ts
import { signIn, signOut } from "@/auth"

export async function loginWithGoogle() {
  try {
    await signIn("google", { redirectTo: "/dashboard" })
  } catch (error) {
    // Penting: NextAuth melempar error redirect secara internal, 
    // jadi kita perlu melemparnya kembali agar redirect bekerja.
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}