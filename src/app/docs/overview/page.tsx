import Link from "next/link";
import { 
  FaBook, 
  FaCogs, 
  FaWifi, 
  FaServer, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaChevronRight,
  FaChevronLeft,
  FaThermometerHalf,
  FaCheckCircle,
  FaUsers,
  FaRocket
} from "react-icons/fa";

export default function OverviewPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ========================================= */}
          {/* 1. SIDEBAR NAVIGATION                    */}
          {/* ========================================= */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-2 hidden lg:block space-y-8 pb-4">
              
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">
                  Panduan Pengguna
                </h3>
                <ul className="menu bg-white rounded-xl shadow-sm border border-slate-200 w-full text-sm font-medium">
                  {/* Overview Active Link */}
                  <li>
                    <Link href="#" className="text-primary bg-blue-50/50 border-r-4 border-primary font-semibold">
                      Overview Produk
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/cara-kerja" className="hover:text-slate-600">
                      Cara Kerja
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/install" className="hover:text-slate-600">
                      Instalasi Hardware
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/config" className="hover:text-slate-600">
                      Konfigurasi App
                    </Link>
                  </li>
                </ul>
              </div>
 </div>
            
            {/* Mobile Dropdown */}
            <div className="lg:hidden mb-8">
               <div className="collapse collapse-arrow bg-base-100 shadow-sm border border-slate-200">
                 <input type="radio" name="docs-accordion" defaultChecked /> 
                 <div className="collapse-title font-medium text-sm py-4">
                   Daftar Isi Dokumentasi
                 </div>
                 <div className="collapse-content text-sm bg-white border-t border-slate-100"> 
                   <ul className="menu w-full">
                     <li><Link href="#" className="active">Overview Produk</Link></li>
                     <li><Link href="/docs/cara-kerja">Cara Kerja</Link></li>
                   </ul>
                 </div>
               </div>
            </div>
          </aside>

          {/* ========================================= */}
          {/* 2. KONTEN UTAMA                          */}
          {/* ========================================= */}
          <main className="flex-1 min-w-0">
            
            <article className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-200">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-8 mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="badge badge-primary badge-outline p-3">V2.0</span>
                  <span className="badge badge-neutral p-3">IoT Solution</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Overview Produk BroilerSmart
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Solusi pemantauan lingkungan kandang ayam broiler secara cerdas. Tingkatkan efisiensi, kurangi mortalitas, dan optimalkan bobot panen.
                </p>
              </div>

              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
                
                {/* INTRO SECTION */}
                <div className="alert alert-info mb-8 not-prose shadow-sm">
                  <FaInfoCircle className="text-xl shrink-0" />
                  <div>
                    <h3 className="font-bold">Apa itu BroilerSmart?</h3>
                    <div className="text-xs text-slate-500">
                      BroilerSmart adalah perangkat alat monitoring IoT yang otomatis mendeteksi suhu dan kelembapan kandang ayam secara real-time, lalu mengirim peringatan ke peternak jika kondisi tidak ideal.
                    </div>
                  </div>
                </div>

                {/* TIMELINE: MASALAH VS SOLUSI */}
                <h2 id="masalah">Perjalanan Menuju Peternakan Modern</h2>
                <p>
                  Banyak peternak masih mengandalkan manual checking (thermometer analog) yang cenderung terlambat mendeteksi perubahan suhu mendadak. Berikut adalah perbandingan metode tradisional dengan BroilerSmart.
                </p>

                <div className="my-8 not-prose">
                  <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                    <li>
                      <div className="timeline-middle">
                        <FaExclamationTriangle className="text-red-500 text-lg" />
                      </div>
                      <div className="timeline-start md:text-end mb-10">
                        <time className="font-mono italic">Metode Lama</time>
                        <div className="text-lg font-black text-base-content">Manual Checking</div>
                        <p className="text-sm text-slate-500">
                          Petugas harus memasuki kandang setiap 2 jam. Sering terjadi kesalahan manusia, data tidak tersimpan, dan respons lambat saat kejadian malam.
                        </p>
                      </div>
                      <hr className="bg-slate-200"/>
                    </li>
                    <li>
                      <hr className="bg-slate-200"/>
                      <div className="timeline-middle">
                        <FaRocket className="text-primary text-lg" />
                      </div>
                      <div className="timeline-end mb-10">
                        <time className="font-mono italic">Metode Baru</time>
                        <div className="text-lg font-black text-primary">BroilerSmart IoT</div>
                        <p className="text-sm text-slate-500">
                          Sensor terpasang 24/7. Data tersimpan otomatis di Cloud. Notifikasi instan ke HP jika suhu naik/drop drastis, bahkan saat Anda tidur.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* TARGET PENGGUNA */}
                <h2 id="target">Target Pengguna</h2>
                <p>
                  Sistem kami didesain untuk skala peternakan mulai dari ribuan hingga ratusan ribu ekor.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
                  <div className="card bg-base-100 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4 text-center">
                      <FaUsers className="text-3xl text-blue-500 mx-auto mb-2" />
                      <h4 className="font-bold text-sm">Peternak Mandiri</h4>
                      <p className="text-xs text-slate-500">Skala 2.000 - 10.000 ekor</p>
                    </div>
                  </div>
                  <div className="card bg-base-100 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4 text-center">
                      <FaServer className="text-3xl text-indigo-500 mx-auto mb-2" />
                      <h4 className="font-bold text-sm">Manajer Farm</h4>
                      <p className="text-xs text-slate-500">Multi-kandang terpusat</p>
                    </div>
                  </div>
                  <div className="card bg-base-100 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4 text-center">
                      <FaCogs className="text-3xl text-purple-500 mx-auto mb-2" />
                      <h4 className="font-bold text-sm">Konsultan Ternak</h4>
                      <p className="text-xs text-slate-500">Analisa data klien</p>
                    </div>
                  </div>
                </div>

                {/* ARSITEKTUR SISTEM VISUAL */}
                <h2 id="architecture">Arsitektur Sistem</h2>
                <p>
                  Data mengalir secara terus menerus dari fisik kandang ke aplikasi Anda.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 not-prose my-8 relative overflow-hidden">
                  {/* Background Decoration */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-2">
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center w-full md:w-1/4">
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl text-orange-500 border-2 border-orange-100 mb-3">
                        <FaThermometerHalf />
                      </div>
                      <h4 className="font-bold text-sm">Sensor</h4>
                      <p className="text-xs text-slate-500">Membaca Suhu/Kelembapan</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-slate-300 text-2xl hidden md:block">→</div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center w-full md:w-1/4">
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl text-blue-500 border-2 border-blue-100 mb-3">
                        <FaWifi />
                      </div>
                      <h4 className="font-bold text-sm">Microcontroller</h4>
                      <p className="text-xs text-slate-500">Kirim data via Wi-Fi</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-slate-300 text-2xl hidden md:block">→</div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center w-full md:w-1/4">
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl text-purple-500 border-2 border-purple-100 mb-3">
                        <FaServer />
                      </div>
                      <h4 className="font-bold text-sm">Cloud Server</h4>
                      <p className="text-xs text-slate-500">Proses & Simpan</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-slate-300 text-2xl hidden md:block">→</div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center text-center w-full md:w-1/4">
                      <div className="w-16 h-16 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-2xl text-white border-2 border-primary/20 mb-3">
                        <FaCheckCircle />
                      </div>
                      <h4 className="font-bold text-sm text-primary">User App</h4>
                      <p className="text-xs text-slate-500">Monitoring & Notif</p>
                    </div>

                  </div>
                </div>

                {/* KEY FEATURES LIST */}
                <h2 id="features">Keunggulan Utama</h2>
                <ul>
                  <li><strong>Real-time Monitoring:</strong> Update data setiap detik tanpa jeda.</li>
                  <li><strong>Notifikasi Multi-channel:</strong> Aplikasi Android, iOS, dan WhatsApp (Otomatis).</li>
                  <li><strong>Backup Data:</strong> Riwayat suhu tersimpan hingga 6 bulan untuk analisa trend.</li>
                  <li><strong>Plug & Play:</strong> Instalasi mudah, tidak butuh coding tambahan.</li>
                </ul>

              </div>

              {/* Footer Navigasi */}
              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="btn btn-sm btn-ghost text-slate-400 w-full md:w-auto justify-start opacity-50 cursor-not-allowed">
                  <FaChevronLeft /> Dokumentasi Utama
                </div>
                <div className="text-sm text-slate-400 italic">
                  Version 2.0.1 (Stable)
                </div>
                <Link href="/docs/cara-kerja" className="btn btn-sm btn-primary w-full md:w-auto justify-end">
                  Lihat Cara Kerja <FaChevronRight />
                </Link>
              </div>

            </article>
          </main>
        </div>
      </div>
    </div>
  );
}