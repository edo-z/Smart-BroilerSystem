import Link from "next/link";
import { FaHammer, FaArrowLeft, FaBell } from "react-icons/fa";

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* Container Utama */}
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Visual */}
        <div className="bg-primary/10 p-12 flex flex-col items-center justify-center text-center border-b border-primary/10">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <FaHammer className="relative text-6xl text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-6 tracking-tight">
            Coming Soon
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Fitur Konfigurasi Sistem
          </p>
        </div>

        {/* Konten Utama */}
        <div className="card-body items-center text-center space-y-6">
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">
              Sedang Dalam Pengembangan
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              Halaman konfigurasi pengaturan dashboard dan profil peternak sedang kami finalisasikan.
            </p>
          </div>

          {/* Progress Bar Visual (Opsional) */}
          <div className="w-full max-w-xs bg-slate-100 rounded-full h-2.5 dark:bg-slate-700 mt-4">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-primary font-semibold tracking-wide uppercase">
            Progress: 75% Selesai
          </p>

          {/* Form Notifikasi (Dummy) */}
          <div className="form-control w-full max-w-xs mt-4">
            <label className="label">
              <span className="label-text text-xs font-bold text-slate-500 uppercase">
                Dapatkan notifikasi saat rilis
              </span>
            </label>
            <div className="join w-full">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="input input-bordered join-item w-full focus:outline-none focus:border-primary" 
              />
              <button className="btn btn-primary join-item">
                <FaBell className="text-xs" />
              </button>
            </div>
          </div>

          {/* Tombol Kembali */}
          <div className="divider my-2"></div>
          
          <Link href="/docs/install" className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-100 w-full max-w-xs">
            <FaArrowLeft /> Kembali ke Instalasi
          </Link>
        </div>
      </div>

      {/* Dekorasi Background Halaman */}
      <div className="fixed inset-0 z-[-1] opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
    </div>
  );
}