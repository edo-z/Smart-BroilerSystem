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
  FaMobileAlt,
  FaBell,
  FaThermometerHalf,
  FaTint,
  FaSlidersH
} from "react-icons/fa";

export default function ConfigPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ========================================= */}
          {/* 1. SIDEBAR NAVIGATION (Sticky Perfect)   */}
          {/* ========================================= */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-2 hidden lg:block space-y-8 pb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">
                  Panduan Pengguna
                </h3>
                <ul className="menu bg-white rounded-xl shadow-sm border border-slate-200 w-full text-sm font-medium">
                  <li><Link href="/docs/overview" className="hover:text-slate-600">Overview Produk</Link></li>
                  <li>
                    <Link href="/docs/cara-kerja" className="hover:text-slate-600">
                      Cara Kerja
                    </Link>
                  </li>
                  <li><Link href="/docs/install" className="hover:text-slate-600">Instalasi Hardware</Link></li>
                  <li><Link href="/docs/config" className="text-primary bg-blue-50/50 border-r-4 border-primary font-semibold">Konfigurasi App</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">
                  Referensi Teknis
                </h3>
                <ul className="menu bg-white rounded-xl shadow-sm border border-slate-200 w-full text-sm font-medium">
                  <li><Link href="/docs/hardware" className="hover:text-slate-600">Spesifikasi Hardware</Link></li>
                  <li><Link href="/docs/software" className="hover:text-slate-600">Stack Software</Link></li>
                </ul>
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
                <span className="badge badge-secondary badge-outline p-3 mb-4">Software Guide</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Konfigurasi Aplikasi
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Sesuaikan parameter alert, ambang batas suhu/kelembapan, dan penerima notifikasi di smartphone Anda.
                </p>
              </div>

              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">

                {/* 1. PENGENALAN */}
                <div className="alert alert-info mb-8 not-prose">
                  <FaMobileAlt className="text-xl shrink-0" />
                  <div>
                    <h3 className="font-bold">Akses Menu Pengaturan</h3>
                    <div className="text-xs text-slate-500">
                      Pastikan Anda sudah Login di aplikasi BroilerSmart. Pilih perangkat yang baru saja dipasang, lalu klik icon <strong>Gerigi (Settings)</strong> di pojok kanan atas kartu perangkat.
                    </div>
                  </div>
                </div>

                {/* 2. SETTING AMBANG BATAS (THRESHOLD) */}
                <h2 id="threshold">1. Atur Ambang Batas (Threshold)</h2>
                <p>
                  Ini adalah pengaturan paling krusial. Sistem akan memberikan peringatan (Alert) ketika suhu menyentuh batas yang Anda tentukan.
                </p>

                <div className="alert alert-warning mb-6 not-prose">
                  <FaExclamationTriangle className="text-xl shrink-0" />
                  <div>
                    <h3 className="font-bold">Hindari "Alert Spam"</h3>
                    <div className="text-xs">
                      Berikan jeda (hysteresis) minimal 2°C antara batas Normal dan batas Warning. Misal: Warning di 30°C, Critical di 32°C.
                    </div>
                  </div>
                </div>

                {/* SIMULASI UI APP (VISUALISASI) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8 not-prose">

                  {/* Kiri: Instruksi Teks */}
                  <div className="space-y-4">
                    <div className="card bg-blue-50 border border-blue-100 p-4">
                      <h4 className="font-bold text-blue-800 flex items-center gap-2">
                        <FaThermometerHalf /> Suhu (°C)
                      </h4>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li><strong>Low (Min):</strong> 24°C (Suhu terlalu dingin)</li>
                        <li><strong>High (Max):</strong> 32°C (Awal Heat Stress)</li>
                        <li><strong>Critical:</strong> 35°C (Bahaya Kematian)</li>
                      </ul>
                    </div>

                    <div className="card bg-cyan-50 border border-cyan-100 p-4">
                      <h4 className="font-bold text-cyan-800 flex items-center gap-2">
                        <FaTint /> Kelembapan (%)
                      </h4>
                      <ul className="text-sm text-cyan-700 mt-2 space-y-1">
                        <li><strong>Normal:</strong> 60% - 70% RH</li>
                        <li><strong>Kering (Min):</strong> &lt; 50% RH (Debu banyak)</li>
                        <li><strong>Lembab (Max):</strong> &gt; 80% RH (Jamur)</li>
                      </ul>
                    </div>
                  </div>

                  {/* Kanan: Mockup Aplikasi (Slider) */}
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-6 bg-slate-100 flex items-center justify-center rounded-t-3xl">
                      <div className="w-16 h-1 bg-slate-300 rounded-full"></div>
                    </div>
                    <h4 className="font-bold text-sm text-slate-400 mb-6 mt-4 uppercase tracking-widest">App Interface</h4>

                    <div className="w-full px-2">
                      <label className="label">
                        <span className="label-text text-xs font-bold text-red-500">Batas Atas Suhu</span>
                        <span className="label-text-alt text-red-500">32°C</span>
                      </label>
                      <input type="range" min="0" max="100" value="32" className="range range-error range-xs" disabled />

                      <div className="divider my-4"></div>

                      <label className="label">
                        <span className="label-text text-xs font-bold text-blue-500">Batas Bawah Suhu</span>
                        <span className="label-text-alt text-blue-500">24°C</span>
                      </label>
                      <input type="range" min="0" max="100" value="24" className="range range-primary range-xs" disabled />
                    </div>
                  </div>

                </div>

                {/* 3. PENGATURAN NOTIFIKASI */}
                <h2 id="notif">2. Pengaturan Notifikasi</h2>
                <p>
                  Pilih bagaimana Anda ingin diberitahu jika terjadi masalah di kandang.
                </p>

                <div className="tabs tabs-boxed my-4 not-prose">
                  <a className="tab tab-active">Pemberitahuan Real-time</a>
                  <a className="tab">Laporan Harian</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4 border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50">
                      <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                      <span className="label-text font-medium text-sm">Push Notification (Aplikasi)</span>
                    </label>
                    <p className="text-xs text-slate-400 ml-9 mt-1">Notifikasi masuk langsung ke layar HP.</p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4 border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50">
                      <input type="checkbox" defaultChecked className="checkbox checkbox-secondary" />
                      <span className="label-text font-medium text-sm">SMS Gateway</span>
                    </label>
                    <p className="text-xs text-slate-400 ml-9 mt-1">Kirim SMS jika koneksi app offline.</p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4 border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50">
                      <input type="checkbox" className="checkbox checkbox-accent" />
                      <span className="label-text font-medium text-sm">Integrasi WhatsApp</span>
                    </label>
                    <p className="text-xs text-slate-400 ml-9 mt-1">Kirim pesan ke grup peternak.</p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4 border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50">
                      <input type="checkbox" defaultChecked className="checkbox checkbox-warning" />
                      <span className="label-text font-medium text-sm">Alarm Lokal (Buzzer)</span>
                    </label>
                    <p className="text-xs text-slate-400 ml-9 mt-1">Suara "Beep" dari alat fisik.</p>
                  </div>
                </div>

                {/* 4. FIRMWARE INFO */}
                <h2 id="firmware">3. Informasi Perangkat</h2>
                <p>
                  Pastikan firmware perangkat Anda selalu terbaru untuk fitur keamanan dan kestabilan.
                </p>
                <div className="overflow-x-auto bg-slate-50 rounded-lg border border-slate-200 mt-4 not-prose">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Nilai Saat Ini</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Hardware Version</td>
                        <td>BS-M2</td>
                        <td className="badge badge-success badge-sm">Stable</td>
                      </tr>
                      <tr>
                        <td>Firmware Version</td>
                        <td>v2.1.0</td>
                        <td className="badge badge-success badge-sm">Up to Date</td>
                      </tr>
                      <tr>
                        <td>Baterai Internal</td>
                        <td>100% (External Powered)</td>
                        <td className="badge badge-success badge-sm">Good</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Footer Navigasi */}
              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <Link href="/docs/install" className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-50 w-full md:w-auto justify-start">
                  <FaChevronLeft /> Instalasi Hardware
                </Link>
                <div className="text-sm text-slate-400 italic">
                  Config Ver: 1.2
                </div>
                <Link href="/dashboard" className="btn btn-sm btn-primary w-full md:w-auto justify-end">
                  Akses Aplikasi <FaChevronRight />
                </Link>
              </div>

            </article>
          </main>
        </div>
      </div>
    </div>
  );
}