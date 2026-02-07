"use client"; // Wajib karena kita pakai state (useState)
import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          {/* TABS UNTUK SWAP LOGIN/REGISTER */}
          <div className="tabs tabs-boxed mb-6">
            <button 
              className={`tab flex-1 ${isLogin ? "tab-active" : ""}`} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`tab flex-1 ${!isLogin ? "tab-active" : ""}`} 
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <h2 className="card-title text-2xl font-bold justify-center mb-4">
            {isLogin ? "Selamat Datang Kembali!" : "Buat Akun Baru"}
          </h2>

          <form className="space-y-4">
            {!isLogin && (
              <label className="input input-bordered flex items-center gap-2">
                <FaUser className="text-gray-400" />
                <input type="text" className="grow" placeholder="Username" />
              </label>
            )}
            
            <label className="input input-bordered flex items-center gap-2">
              <FaEnvelope className="text-gray-400" />
              <input type="email" className="grow" placeholder="Email" />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <FaLock className="text-gray-400" />
              <input type="password" className="grow" placeholder="Password" />
            </label>

            <div className="form-control mt-6">
              <button className="btn btn-primary uppercase">
                {isLogin ? "Masuk" : "Daftar Sekarang"}
              </button>
            </div>
          </form>

          <div className="divider text-xs text-gray-400">ATAU LOGIN DENGAN</div>
          
          <button className="btn btn-outline btn-secondary w-full">
            Google
          </button>
        </div>
      </div>
    </div>
  );
}