"use server"

// Perhatikan: Kita mengimpor signIn dari file konfigurasi UTAMA kita di src/auth.ts
import { signIn, signOut } from "@/auth"
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function loginWithGoogle() {
  try {
    await signIn("google", { redirectTo: "/dashboard" })
  } catch (error) {
    throw error;
  }
}

// LOGIN
export async function loginWithCredentials(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // 1. Lakukan SignIn
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // 2. Jika error adalah AuthError, kembalikan pesan ke UI
    if (error instanceof AuthError) {
      return "Email atau Password salah.";
    }
    throw error;
  }
}

// REGISTER
export async function registerUser(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password") as string;

  const client = await clientPromise;
  const db = client.db();

  const existing = await db.collection("users").findOne({ email });
  if (existing) return { error: "Email sudah terdaftar" };

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return { success: true };
}

// LOGOUT
export async function logout() {
  await signOut({ redirectTo: "/login" })
}