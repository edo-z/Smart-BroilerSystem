"use client";
import Link from "next/link";
import React from "react";
import { 
  FaTemperatureHigh, 
  FaTint, 
  FaMicrochip, 
  FaWifi, 
  FaChartLine,
  FaCheckSquare, 
  FaShieldAlt,
  FaBook,
  FaArrowRight,
  FaChartArea,
  FaFire,
  FaAdjust,
  FaFan,
  FaCheckCircle,
  FaCheck
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

// Registrasi Chart.js agar tidak error di browser
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function LandingPage() {
  
  // 1. KONFIGURASI CHART JS (Grafik Suhu Biologis)
  const chartData = {
    labels: ["0 Hari", "7 Hari", "14 Hari", "21 Hari", "28 Hari", "32 Hari"],
    datasets: [
      {
        label: "Suhu Ideal (°C)",
        data: [34, 32.5, 29, 27, 24.5, 24], // Data sesuai grafik DOC
        borderColor: "#3b82f6", // Tailwind blue-500
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)");
          gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
          return gradient;
        },
        tension: 0.4, // Garis melengkung halus
        fill: true,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#3b82f6",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", // Slate-900
        titleFont: { family: "sans-serif", size: 13 },
        bodyFont: { family: "sans-serif", size: 13 },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Target Suhu: ${context.parsed.y}°C`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 20,
        max: 36,
        grid: {
          color: "#f1f5f9", // Slate-100 (Grid halus)
          drawBorder: false,
        },
        ticks: {
          color: "#64748b", // Slate-500
          font: { size: 11 },
          callback: function(value: any) { return value + "°C"; }
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11 }
        }
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-700 flex flex-col antialiased">
      
      {/* ========================================= */}
      {/* 1. HERO SECTION (Clean & Readable)         */}
      {/* ========================================= */}
      <div id="home" className="hero min-h-[90vh] bg-white pb-20 py-24">
        <div className="hero-content text-center max-w-6xl flex-col lg:flex-row gap-16 px-4">
          
          {/* Left: Typography */}
          <div className="w-full lg:w-1/2 text-left space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
              Smart Farming Technology
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-slate-900">
              Manajemen Kandang <br />
              <span className="text-blue-600">Presisi & Terukur</span>
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              Alat monitoring otomatis suhu dan kelembapan. Memastikan kenyamanan biologis ayam broiler setiap hari untuk hasil panen yang maksimal.
            </p>
            
            <div className="flex gap-4 pt-2">
              <Link href="/soon" className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white px-8 h-12 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                Mulai Sekarang
              </Link>
              <Link href="/docs/overview" className="btn btn-outline border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 px-8 h-12 rounded-lg">
                Pelajari Dokumentasi
              </Link>
            </div>
            
            {/* Trust Badges */}
            {/* <div className="pt-8 flex items-center gap-4 text-sm text-slate-400">
              <p>Dipercaya oleh:</p>
              <div className="flex gap-2 font-semibold text-slate-600">
                <span>PT. Agro Maju</span>
                <span>•</span>
                <span>Bromo Farm</span>
                <span>•</span>
                <span>Java Poultry</span>
              </div>
            </div> */}
          </div>

          {/* Right: Clean Dashboard Preview */}
          <div className="relative w-full lg:w-1/2 flex justify-center animate-fade-in">
            <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-700">Kandang A1 - Live</span>
                </div>
                <span className="text-xs font-mono text-slate-400">ID: BS-001</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 uppercase font-bold mb-1">Suhu</div>
                  <div className="text-3xl font-bold text-slate-800">28.5<span className="text-sm text-slate-500 ml-1">°C</span></div>
                  <div className="text-xs text-blue-600 mt-1 font-medium">Target Terpenuhi</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 uppercase font-bold mb-1">Kelembapan</div>
                  <div className="text-3xl font-bold text-slate-800">64<span className="text-sm text-slate-500 ml-1">%</span></div>
                  <div className="text-xs text-slate-400 mt-1">Rentang Normal</div>
                </div>
              </div>

              {/* Visual Bar */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between text-xs mb-2 font-semibold text-slate-600">
                  <span>Indeks Kesehatan</span>
                  <span className="text-green-600">Excellent (85%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[85%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. FITUR (Grid Clean)                     */}
      {/* ========================================= */}
      <section id="produk" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Teknologi Pertanian Terintegrasi</h2>
            <p className="text-slate-500">
              Didesain untuk mengurangi biaya operasional dan meningkatkan efisiensi pakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <FaTemperatureHigh className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sensor Presisi</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Sensor suhu dan kelembapan tingkat industri dengan akurasi tinggi untuk deteksi perubahan lingkungan instan.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <FaTint className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analisa Udara</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Memantau kelembapan kandang untuk mencegah penyakit pernapasan dan pertumbuhan bakteri berbahaya.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-6">
                <FaWifi className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Cloud IoT</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Data terkirim ke cloud real-time. Pantau kandang Anda dari mana saja melalui aplikasi dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 3. GRAFIK BIOLOGIS (CHART JS)             */}
      {/* ========================================= */}
      <section id="monitoring" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Biological Imperative</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
              Adaptasi Suhu Berbasis Umur
            </h2>
            <p className="text-slate-500 max-w-2xl text-center">
              Sistem BroilerSmart secara otomatis mengikuti kurva biologis standar (Brooding to Finisher) untuk menjaga kesehatan ayam.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Kiri: Chart JS Container */}
            <div className="lg:col-span-8 bg-slate-50 rounded-3xl p-6 md:p-10 border border-slate-100 shadow-inner">
              <div className="h-[350px] md:h-[400px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>0 Hari (Menetas)</span>
                <span>Umur Ayam (Hari)</span>
                <span>32 Hari (Panen)</span>
              </div>
            </div>

            {/* Kanan: Fase Penjelasan */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="border-l-4 border-orange-400 pl-6 py-2 bg-orange-50 rounded-r-xl">
                <h4 className="text-lg font-bold text-slate-800">Phase 1: Brooding</h4>
                <p className="text-xs font-bold text-orange-600 mb-1">0 - 14 Hari • Target 34°C</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Anak ayam belum mampu mengatur suhu tubuh sendiri. Membutuhkan sumber panas eksternal tinggi.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-6 py-2 bg-blue-50 rounded-r-xl">
                <h4 className="text-lg font-bold text-slate-800">Phase 2: Transition</h4>
                <p className="text-xs font-bold text-blue-600 mb-1">15 - 25 Hari • Target 28°C</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Suhu diturunkan secara bertahap. Bulu mulai tumbuh dan sistem termoregulasi mulai bekerja.
                </p>
              </div>

              <div className="border-l-4 border-cyan-400 pl-6 py-2 bg-cyan-50 rounded-r-xl">
                <h4 className="text-lg font-bold text-slate-800">Phase 3: Finisher</h4>
                <p className="text-xs font-bold text-cyan-600 mb-1">26 - 32 Hari • Target 24°C</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Metabolisme tinggi menghasilkan panas tubuh. Kipas pendingin aktif untuk menjaga kenyamanan.
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-xl flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 text-lg" />
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Otomatisasi RTC</h5>
                  <p className="text-xs text-slate-500">
                    Alat menurunkan target suhu setiap hari secara otomatis tanpa pengaturan ulang manual.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 4. STATISTIK (Dark Contrast)             */}
      {/* ========================================= */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="py-6 md:py-0">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide font-semibold">Akurasi Sensor</div>
            </div>
            <div className="py-6 md:py-0">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2"> &lt;1 Detik</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide font-semibold">Waktu Respon</div>
            </div>
            <div className="py-6 md:py-0">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">+15%</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide font-semibold">Efisiensi Pakan</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 5. TIPS & CTA (Clean Layout)              */}
      {/* ========================================= */}
      <section id="tips" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Tips List */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Tips Profesional Peternak</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Konsistensi Suhu</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">
                      Ayam sangat sensitif terhadap perubahan suhu drastis. Usahakan fluktuasi tidak melebihi ±2°C dalam satu jam.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Kualitas Udara</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">
                      Monitor kadar Amonia (NH3). Jika kandang terasa menyengat di hidung, segera nyalakan ventilasi maksimal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Air Minum Bersih</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">
                      Pastikan jalur minum tidak bocor. Konversi pakan ke daging sangat bergantung pada konsumsi air yang cukup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: CTA Card */}
            <div className="flex flex-col justify-center">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Siap Tingkatkan Produksi?</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Implementasikan sistem monitoring modern dan berhenti menebak kondisi kandang.
                </p>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center gap-3 text-slate-600">
                    <FaCheck className="text-green-500 shrink-0" /> Pemasangan Cepat
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <FaCheck className="text-green-500 shrink-0" /> Support 24 Jam
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <FaCheck className="text-green-500 shrink-0" /> Garansi 1 Tahun
                  </li>
                </ul>

                <a href="/docs/overview" className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white w-full md:w-auto btn-lg">
                  Baca Dokumentasi <FaBook className="ml-2"/>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}