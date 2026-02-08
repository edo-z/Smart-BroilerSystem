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
  FaTools,
  FaMapMarkedAlt,
  FaPlug,
  FaCheck
} from "react-icons/fa";

export default function InstallPage() {
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
                  <li><Link href="/docs/install" className="text-primary bg-blue-50/50 border-r-4 border-primary font-semibold">Instalasi Hardware</Link></li>
                  <li><Link href="/docs/config" className="hover:text-slate-600">Konfigurasi App</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">
                  Referensi Teknis
                </h3>
                <ul className="menu bg-white rounded-xl shadow-sm border border-slate-200 w-full text-sm font-medium">
                  <li><Link href="/docs/hardware" className="hover:text-slate-600">Stack Hardware</Link></li>
                  <li><Link href="/docs/software" className="hover:text-slate-600">Stack Software</Link></li>
                </ul>
              </div>
            </div>
          </aside>


          {/* ========================================= */}
          {/* 2. KONTEN UTAMA (Panduan Step-by-Step)   */}
          {/* ========================================= */}
          <main className="flex-1 min-w-0">
            <article className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-200">

              {/* Header */}
              <div className="border-b border-slate-100 pb-8 mb-8">
                <span className="badge badge-secondary badge-outline p-3 mb-4">Hardware Guide</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Panduan Instalasi Hardware
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Ikuti langkah-langkah ini untuk memasang alat BroilerSmart di kandang ayam Anda. Estimasi waktu pemasangan: 15-20 menit.
                </p>
              </div>

              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">

                {/* 1. PERALATAN & PERSIAPAN */}
                <div className="alert alert-info mb-8 not-prose">
                  <FaTools className="text-xl shrink-0" />
                  <div>
                    <h3 className="font-bold">Apa yang Anda Butuhkan?</h3>
                    <div className="text-xs text-slate-500">
                      Pastikan Anda memiliki paket BroilerSmart, Baterai / Adaptor 12V, dan akses ke listrik atau panel surya di kandang.
                    </div>
                  </div>
                </div>

                <h2>1. Checklist Kelengkapan</h2>
                <p>Sebelum memulai, pastikan kotak paket berisi komponen berikut:</p>
                <ul className="checklist bg-slate-50 p-4 rounded-lg border border-slate-100 not-prose">
                  <li className="flex items-center gap-3 mb-2">
                    <FaCheck className="text-green-500" />
                    <span>1 Unit Modul BroilerSmart (Sensor + MCU)</span>
                  </li>
                  <li className="flex items-center gap-3 mb-2">
                    <FaCheck className="text-green-500" />
                    <span>1 Unit Adaptor Daya 12V 2A (Kabel 3 meter)</span>
                  </li>
                  <li className="flex items-center gap-3 mb-2">
                    <FaCheck className="text-green-500" />
                    <span>Sekrup & Baut pemasangan dinding (4 pcs)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" />
                    <span>Buku Panduan Cepat</span>
                  </li>
                </ul>

                <div className="alert alert-warning mb-8 mt-6 not-prose">
                  <FaExclamationTriangle className="text-xl shrink-0" />
                  <div>
                    <h3 className="font-bold">Hindari Debu & Air</h3>
                    <div className="text-xs">
                      Meskipun memiliki casing tahan debu (IP54), hindari memasang alat di area yang terkena semprotan air langsung (dekat tembok basah atau semprotan disinfectan).
                    </div>
                  </div>
                </div>

                {/* 2. ALUR INSTALASI (STEPS COMPONENT) */}
                <h2>2. Alur Pemasangan</h2>
                <p>Proses instalasi dapat dibagi menjadi 4 fase utama:</p>

                <div className="steps steps-vertical lg:steps-horizontal w-full my-10 not-prose">
                  <div className="step step-primary">
                    <FaMapMarkedAlt />
                    <div className="text-xs mt-2 font-bold">Penentuan Lokasi</div>
                  </div>
                  <div className="step step-primary">
                    <FaTools />
                    <div className="text-xs mt-2 font-bold">Pemasangan Fisik</div>
                  </div>
                  <div className="step step-primary">
                    <FaPlug />
                    <div className="text-xs mt-2 font-bold">Sambungan Daya</div>
                  </div>
                  <div className="step step-secondary">
                    <FaWifi />
                    <div className="text-xs mt-2 font-bold">Koneksi WiFi</div>
                  </div>
                </div>

                {/* 3. DETAIL LANGKAH */}
                <h3 id="lokasi">Langkah 1: Tentukan Lokasi Penempatan</h3>
                <p>Penempatan sensor sangat krusial untuk mendapatkan data yang representatif.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="card bg-green-50 border border-green-100">
                    <div className="card-body p-4">
                      <h4 className="card-title text-sm text-green-800"><FaCheck className="text-lg" /> DOs (Dianjurkan)</h4>
                      <ul className="text-xs text-green-700 list-disc pl-4 mt-2 space-y-1">
                        <li>Tinggi <strong>30-40 cm</strong> dari lantai kandang (sejajar kepala ayam).</li>
                        <li>Titik tengah kandang (bukan di pinggir tembok dingin).</li>
                        <li>Jauh dari lampu pemanas langsung atau kipas angin.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="card bg-red-50 border border-red-100">
                    <div className="card-body p-4">
                      <h4 className="card-title text-sm text-red-800"><FaExclamationTriangle className="text-lg" /> DON'Ts (Dilarang)</h4>
                      <ul className="text-xs text-red-700 list-disc pl-4 mt-2 space-y-1">
                        <li>Jangan pasang di dekat pintu masuk (angin masuk/keluar).</li>
                        <li>Jangan pasang di lantai (terinjak air tahi/air).</li>
                        <li>Jangan tutup sensor dengan benda apapun.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 id="fisik">Langkah 2: Pemasangan Fisik</h3>
                <ol>
                  <li><strong>Bor Lubang:</strong> Gunakan bor 6mm untuk membuat lubang di tembok atau papan kayu sesuai pola lubang di belakang alat.</li>
                  <li><strong>Tempel & Kencangkan:</strong> Masukkan b Fischer (jika di tembok), lalu pasang alat dan kencangkan baut sampai kokoh.</li>
                  <li><strong>Posisikan Upright:</strong> Pastikan alat tegak lurus ke atas. Jangan miring.</li>
                </ol>

                <h3 id="daya">Langkah 3: Sambungkan Sumber Daya</h3>
                <p>Sambungkan kabel adaptor DC 12V ke port power di bagian belakang alat, lalu sambungkan colokan ke sumber listrik.</p>

                <div className="flex gap-4 items-start bg-slate-800 text-white p-6 rounded-xl my-6 not-prose shadow-lg">
                  <div className="text-4xl animate-pulse">💡</div>
                  <div>
                    <h4 className="font-bold text-lg">Indikator LED</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      Setelah colokan dicolok, lampu LED di depan alat akan berkedip <span className="text-blue-400 font-bold">Biru</span> selama 3 detik (Boot Up), lalu menyala <span className="text-yellow-400 font-bold">Kuning</span> (Mencari WiFi).
                    </p>
                  </div>
                </div>

                <h3 id="wifi">Langkah 4: Hubungkan ke WiFi</h3>
                <p>
                  Buka aplikasi BroilerSmart di smartphone Anda. Masuk ke menu <strong>"Tambah Perangkat"</strong>.
                  Pilih SSID WiFi kandang Anda dan masukkan password. Status LED akan berubah menjadi <span className="text-green-400 font-bold">Hijau</span> jika koneksi berhasil.
                </p>

                <div className="alert alert-success mb-8 not-prose mt-8">
                  <FaCheck className="text-xl shrink-0" />
                  <div>
                    <h3 className="font-bold">Instalasi Selesai!</h3>
                    <div className="text-xs">
                      Alat sekarang akan mengirim data ke server. Tunggu sekitar 2 menit, lalu cek dashboard aplikasi untuk melihat grafik suhu yang masuk.
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Navigasi */}
              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <Link href="/docs/cara-kerja" className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-50 w-full md:w-auto justify-start">
                  <FaChevronLeft /> Lihat Cara Kerja
                </Link>
                <div className="text-sm text-slate-400 italic">
                  Hardware Version: V2.0
                </div>
                <Link href="/docs/config" className="btn btn-sm btn-primary w-full md:w-auto justify-end">
                  Konfigurasi Aplikasi <FaChevronRight />
                </Link>
              </div>

            </article>
          </main>
        </div>
      </div>
    </div>
  );
}