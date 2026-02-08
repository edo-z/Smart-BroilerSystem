"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaRocket, FaEnvelope, FaLock, FaArrowRight, FaGoogle } from "react-icons/fa";
// Import action yang Anda sebutkan
import { loginWithGoogle } from "@/actions/auth-actions";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  // State khusus untuk loading Google
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 1. Handler Login Email Manual
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Logika login manual (Email & Password) di sini
    console.log("Email login clicked");
    
    // Simulasi loading
    setTimeout(() => {
      setIsLoading(false);
      // window.location.href = "/dashboard"; // Redirect disini jika login sukses
    }, 2000);
  };

  // 2. Handler Khusus Google Login
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google Login error:", error);
    } finally {
      // Stop loading jika terjadi error (jika sukses biasanya redirect otomatis)
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      
      {/* ========================================= */}
      {/* 1. BAGIAN KIRI (BRANDING)                 */}
      {/* ========================================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col justify-center h-full px-12 py-34 lg:px-20">


          {/* Tagline */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Monitor Kandang <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Lebih Cerdas.
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-md mb-12">
            Akses Dashboard monitoring suhu dan kelembapan real-time Anda. Optimalkan hasil panen dengan data yang akurat.
          </p>

          {/* Dummy Footer Left */}
          <div className="mt-auto">
            <div className="flex gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Sistem Online</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              &copy; {new Date().getFullYear()} BroilerSmart Technologies
            </p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. BAGIAN KANAN (LOGIN FORM)              */}
      {/* ========================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 py-34">
        <div className="w-full max-w-md">

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Selamat Datang Kembali</h2>
              <p className="text-slate-500 text-sm mt-2">
                Silakan masukkan detail akun Anda untuk melanjutkan.
              </p>
            </div>

            {/* FORM EMAIL MANUAL */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Input Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-slate-700">Alamat Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 bg-slate-50 focus:bg-white transition-colors">
                  <FaEnvelope className="text-slate-400 text-lg" />
                  <input type="email" placeholder="email@contoh.com" className="grow" required />
                </label>
              </div>

              {/* Input Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-slate-700">Kata Sandi</span>
                  <label className="label-text-alt link link-primary text-xs hover:cursor-pointer">
                    Lupa kata sandi?
                  </label>
                </label>
                <label className="input input-bordered flex items-center gap-3 bg-slate-50 focus:bg-white transition-colors">
                  <FaLock className="text-slate-400 text-lg" />
                  <input type="password" placeholder="Masukkan kata sandi" className="grow" required />
                </label>
              </div>

              {/* Checkbox Remember Me */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                  <span className="label-text text-sm text-slate-600">Ingat saya di perangkat ini</span>
                </label>
              </div>

              {/* Tombol Login Email */}
              {/* Disabled jika sedang loading Email ATAU Google */}
              <button 
                type="submit" 
                disabled={isLoading || isGoogleLoading}
                className={`btn btn-primary w-full bg-slate-900 hover:bg-slate-800 text-white border-none h-12 shadow-lg hover:shadow-xl transition-all ${isLoading ? 'loading' : ''}`}
              >
                {!isLoading && <span className="flex items-center gap-2">Masuk ke Dashboard <FaArrowRight className="text-xs" /></span>}
              </button>
            </form>

            {/* Divider Social Login */}
            <div className="divider text-xs text-slate-400 my-8 font-medium uppercase tracking-wider">
              Atau masuk dengan
            </div>

            {/* BUTTON GOOGLE (SUDAH DIPERBAIKI) */}
            <div className="grid grid-cols-1 gap-4">
              <button 
                type="button" // PENTING: type="button" agar tidak submit form email
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className={`btn btn-outline border-slate-300 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 text-slate-600 normal-case h-11 flex items-center gap-3 ${isGoogleLoading ? 'loading' : ''}`}
              >
                {!isGoogleLoading && (
                  <>
                    <FaGoogle className="text-red-500" />
                    <span>Google</span>
                  </>
                )}
                {isGoogleLoading && <span>Menghubungkan ke Google...</span>}
              </button>
            </div>

            {/* Link Registrasi */}
            <div className="text-center mt-8 text-sm text-slate-600">
              Belum punya akun peternak?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Daftar disini
              </Link>
            </div>

          </div>
          
          {/* Footer Mobile */}
          <p className="text-center text-xs text-slate-400 mt-8 lg:hidden">
            &copy; {new Date().getFullYear()} BroilerSmart Technologies
          </p>

        </div>
      </div>
    </div>
  );
}