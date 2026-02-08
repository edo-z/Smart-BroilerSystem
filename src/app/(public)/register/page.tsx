"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaRocket, FaUser, FaIndustry, FaEnvelope, FaLock, FaArrowRight, FaCheck } from "react-icons/fa";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi proses register
    setTimeout(() => {
      setIsLoading(false);
      console.log("Register clicked");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      
      {/* ========================================= */}
      {/* 1. BAGIAN KIRI (BRANDING)                */}
      {/* Sama persis dengan Login Page             */}
      {/* ========================================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col justify-center h-full px-12 py-24 lg:px-20">

          {/* Tagline */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Bergabunglah Bersama <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Peternak Modern.
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-md mb-12">
            Daftar sekarang untuk memanfaatkan teknologi monitoring cerdas yang meningkatkan produktivitas kandang Anda.
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
      {/* 2. BAGIAN KANAN (REGISTER FORM)           */}
      {/* ========================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 py-34">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h2>
              <p className="text-slate-500 text-sm mt-2">
                Lengkapi formulir di bawah untuk mendaftarkan peternakan Anda.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Input Nama Lengkap */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-slate-700">Nama Lengkap</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 bg-slate-50 focus:bg-white transition-colors">
                  <FaUser className="text-slate-400 text-lg" />
                  <input type="text" placeholder="Contoh: Budi Santoso" className="grow" required />
                </label>
              </div>

              {/* Input Nama Peternakan (Kontekstual) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-slate-700">Nama Peternakan</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 bg-slate-50 focus:bg-white transition-colors">
                  <FaIndustry className="text-slate-400 text-lg" />
                  <input type="text" placeholder="Contoh: UD. Berkah Tani" className="grow" required />
                </label>
              </div>

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
                  <label className="label-text-alt text-slate-400 text-xs">Min. 8 karakter</label>
                </label>
                <label className="input input-bordered flex items-center gap-3 bg-slate-50 focus:bg-white transition-colors">
                  <FaLock className="text-slate-400 text-lg" />
                  <input type="password" placeholder="Buat kata sandi kuat" className="grow" required minLength={8} />
                </label>
              </div>

              {/* Input Konfirmasi Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-slate-700">Ulangi Kata Sandi</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 bg-slate-50 focus:bg-white transition-colors">
                  <FaCheck className="text-slate-400 text-lg" />
                  <input type="password" placeholder="Ketik ulang kata sandi" className="grow" required />
                </label>
              </div>

              {/* Checkbox Terms */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" required />
                  <span className="label-text text-xs text-slate-600">
                    Saya setuju dengan <a href="#" className="text-primary hover:underline">Syarat & Ketentuan</a> serta Kebijakan Privasi.
                  </span>
                </label>
              </div>

              {/* Tombol Register */}
              <button 
                type="submit" 
                className={`btn btn-primary w-full bg-slate-900 hover:bg-slate-800 text-white border-none h-12 shadow-lg hover:shadow-xl transition-all ${isLoading ? 'loading' : ''}`}
              >
                {!isLoading && <span className="flex items-center gap-2">Daftar Akun <FaArrowRight className="text-xs" /></span>}
              </button>

            </form>

            {/* Link Login */}
            <div className="text-center mt-8 text-sm text-slate-600">
              Sudah punya akun peternak?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Masuk disini
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