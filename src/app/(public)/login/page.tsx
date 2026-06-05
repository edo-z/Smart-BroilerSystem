"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock, FaArrowRight, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginWithCredentials, loginWithGoogle } from "@/actions/auth-actions";
import GradientText from "@/component/GradientText";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // 1. Handler Login Email Manual
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginWithCredentials(formData);

      if (result) {
        setError(result);
        setIsLoading(false);
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  // 2. Handler Khusus Google Login
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      await loginWithGoogle();
    } catch {
      setGoogleError("Gagal masuk dengan Google. Silakan coba lagi.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">

      {/* ========================================= */}
      {/* 1. BAGIAN KIRI (BRANDING)                 */}
      {/* ========================================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col justify-center h-full px-12 py-32 lg:px-20">


          {/* Tagline */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Monitor Kandang <br />
            <span className="inline-block align-top">
              <GradientText
                colors={["#003cbd", "#0ea5e9", "#00c3ff"]}
                animationSpeed={8}
                showBorder={false}
              >
                Lebih Ceras.
              </GradientText>
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-md mb-12">
            Akses Dashboard monitoring suhu dan kelembapan real-time Anda. Optimalkan hasil panen dengan data yang akurat.
          </p>

          {/* Spacer */}
          <div className="mt-auto" />
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. BAGIAN KANAN (LOGIN FORM)              */}
      {/* ========================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 py-32">
        <div className="w-full max-w-md">

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Selamat Datang Kembali</h2>
              <p className="text-slate-500 text-sm mt-2">
                Silakan masukkan detail akun Anda untuk melanjutkan.
              </p>
            </div>

            {/* Alert Error */}
            {(error || googleError) && (
              <div className="mt-4 p-3 bg-red-50 text-red-500 border border-red-100 rounded-lg text-sm text-center">
                {error || googleError}
              </div>
            )}

            {/* FORM EMAIL MANUAL */}
            <form onSubmit={handleLogin} className="space-y-6 mt-6">

              {/* Input Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-slate-700">Alamat Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 bg-slate-50 focus:bg-white transition-colors">
                  <FaEnvelope className="text-slate-400 text-lg" />
                  <input name="email" type="email" placeholder="email@contoh.com" className="grow" required />
                </label>
              </div>

              {/* Input Password */}
              <div className="form-control">
                <div className="label flex justify-between">
                  <span className="label-text font-medium text-slate-700">Kata Sandi</span>
                  <span className="label-text-alt link link-primary text-xs hover:cursor-pointer">
                    Lupa kata sandi?
                  </span>
                </div>
                <label className="input input-bordered flex items-center gap-3 bg-slate-50 focus:bg-white transition-colors">
                  <FaLock className="text-slate-400 text-lg" />
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan kata sandi" className="grow" required />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword((s) => !s)}
                    className="text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                    aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </label>
              </div>

              {/* Checkbox Remember Me */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input type="checkbox" name="remember" className="checkbox checkbox-primary checkbox-sm" />
                  <span className="label-text text-sm text-slate-600">Ingat saya di perangkat ini</span>
                </label>
              </div>

              {/* Tombol Login Email */}
              {/* Disabled jika sedang loading Email ATAU Google */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className={`w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'pointer-events-none' : ''}`}
              >
                {isLoading ? "Memverifikasi..." : <><span>Masuk ke Dashboard</span><FaArrowRight /></>}
              </button>
            </form>

            {/* Divider Social Login */}
            <div className="divider text-xs text-slate-400 my-8 font-medium uppercase tracking-wider">
              Atau masuk dengan
            </div>

            {/* BUTTON GOOGLE */}
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className={`w-full border border-slate-300 hover:bg-slate-50 text-slate-600 h-11 rounded-xl transition-all font-medium flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {!isGoogleLoading ? (
                  <><FaGoogle className="text-red-500" /><span>Google</span></>
                ) : (
                  <span>Menghubungkan ke Google...</span>
                )}
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