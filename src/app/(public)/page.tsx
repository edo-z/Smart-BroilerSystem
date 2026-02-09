"use client";
import Link from "next/link";
import React from "react";
import { 
  FaTemperatureHigh, 
  FaTint, 
  FaMicrochip, 
  FaWifi, 
  FaCheckCircle,
  FaBook,
  FaArrowRight,
  FaFire,
  FaAdjust,
  FaFan,
  FaCheck,
  FaReact,
  FaBrain
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

// Registrasi Chart.js
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
  
  // --- CONFIG CHART (Safe Gradient) ---
  const chartData = {
    labels: ["0 Hari", "7 Hari", "14 Hari", "21 Hari", "28 Hari", "32 Hari"],
    datasets: [
      {
        label: "Suhu Ideal (°C)",
        data: [34, 32.5, 29, 27, 24.5, 24],
        borderColor: "#3b82f6", // blue-500
        // Perbaikan: Menambahkan pengecekan null pada context.chart.ctx
        backgroundColor: (context: any) => {
          const ctx = context.chart?.ctx;
          if (!ctx) {
            // Fallback warna jika context belum siap
            return "rgba(59, 130, 246, 0.2)";
          }
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)");
          gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
          return gradient;
        },
        tension: 0.4, 
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
            return `Target: ${context.parsed.y}°C`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 20,
        max: 36,
        grid: {
          color: "#f1f5f9", // Slate-100
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
    // Wrapper Utama
    <div className="bg-slate-50 min-h-screen font-sans text-slate-700 flex flex-col antialiased">
      
      {/* ========================================= */}
      {/* 1. HERO SECTION (FIXED LAYOUT)           */}
      {/* ========================================= */}
      {/* Perbaikan: Menambahkan 'relative' pada parent Hero */}
      <div id="home" className="hero min-h-[100vh] bg-white pb-20 py-24 relative">
        <div className="hero-content text-center max-w-6xl flex-col lg:flex-row gap-16 px-4">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-left space-y-6 animate-fade-in-up z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <FaWifi className="text-xs" />
              Smart Farming Technology
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-slate-900">
              Manajemen Kandang <br />
              <span className="text-blue-600 font-serif italic">Presisi & Terukur</span>
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              Alat monitoring otomatis suhu dan kelembapan. Memastikan kenyamanan biologis ayam broiler setiap hari untuk hasil panen yang maksimal.
            </p>
            
            <div className="flex gap-4 pt-2">
              <Link href="/login" className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white px-8 h-12 rounded-lg shadow-xl transition-shadow">
                Mulai Sekarang
              </Link>
              <Link href="/docs/overview" className="btn btn-outline border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 h-12 rounded-lg">
                Pelajari Cara Kerja
              </Link>
            </div>
            
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

          {/* Right Content */}
          {/* Perbaikan: Menambahkan 'relative' dan 'z-0' agar visual berada di bawah teks jika layar sempit */}
          <div className="relative w-full lg:w-1/2 flex justify-center animate-fade-in z-0">
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
                  <div className="text-xs text-blue-400 mt-1 font-medium">Rentang Normal</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 border border-slate-100">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Kenyamanan Kandang</span>
                    <span className="text-blue-600">Excellent</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[85%] rounded-full"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. FITUR SECTION                           */}
      {/* ========================================= */}
      <section id="produk" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Teknologi Untuk Efisiensi</h2>
            <p className="text-slate-500">
              Dikembangkan berdasarkan standar internasional manajemen peternakan broiler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <FaTemperatureHigh className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sensor Presisi</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Menggunakan sensor DHT22 industrial grade dengan akurasi ±0.5°C untuk data yang dapat dipercaya.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <FaTint className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Humidity Control</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Monitoring kadar air udara untuk mencegah kasus pernapasan (CRD) pada masa pertumbuhan.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-6">
                <FaWifi className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cloud Sync</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Data tersimpan aman di cloud dan dapat diakses kapan saja melalui aplikasi seluler.
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
              Sistem secara otomatis mengikuti kurva biologis standar penurunan suhu dari fase menetas hingga siap panen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Kiri: Chart */}
            <div className="lg:col-span-8 bg-slate-50 rounded-3xl p-6 md:p-10 border border-slate-100 shadow-inner">
              <div className="flex justify-between items-end mb-6 px-2">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Target Suhu</div>
                  <div className="text-2xl font-bold text-slate-800">0 - 32 Hari</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="text-sm text-slate-500">Derajat Celcius (°C)</span>
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Kanan: Fase Info */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 rounded-2xl bg-orange-50 border-l-4 border-orange-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-orange-900">Phase 1: Brooding</h4>
                  <span className="font-mono font-bold text-orange-600">0-14</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <FaFire className="text-orange-500 text-xl" />
                  <div>
                    <p className="text-xs text-orange-800 font-bold uppercase">Suhu Tinggi</p>
                    <p className="text-sm text-orange-700/80">Target ~34°C</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-blue-50 border-l-4 border-blue-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-blue-900">Phase 2: Transition</h4>
                  <span className="font-mono font-bold text-blue-600">15-25</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <FaAdjust className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-xs text-blue-800 font-bold uppercase">Transisi</p>
                    <p className="text-sm text-blue-700/80">Target ~28°C</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-cyan-50 border-l-4 border-cyan-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-cyan-900">Phase 3: Finisher</h4>
                  <span className="font-mono font-bold text-cyan-600">26-32</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <FaFan className="text-cyan-500 text-xl" />
                  <div>
                    <p className="text-xs text-cyan-800 font-bold uppercase">Metabolisme Tinggi</p>
                    <p className="text-sm text-cyan-700/80">Target ~24°C</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-cyan-600 leading-relaxed border-t border-cyan-100 pt-3">
                  Ayam menghasilkan panas tubuh sendiri. Kipas aktif mendinginkan kandang.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 4. STATISTIK                                */}
      {/* ========================================= */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="py-6 md:py-0">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">99.9%</div>
              <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Akurasi Sensor</p>
            </div>
            <div className="py-6 md:py-0">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">&lt; 1s</div>
              <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Latensi Data</p>
            </div>
            <div className="py-6 md:py-0">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">+15%</div>
              <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Efisiensi Pakan</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 5. TIPS & CTA                               */}
      {/* ========================================= */}
      <section id="tips" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row">
            
            <div className="w-full md:w-1/2 p-10 md:p-14">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Tips Manajemen Kandang</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Konsistensi Suhu</h4>
                    <p className="text-sm text-slate-500 mt-1">Jaga fluktuasi suhu maksimal ±2°C per jam.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Kualitas Udara</h4>
                    <p className="text-sm text-slate-500 mt-1">Amoniak (NH3) harus dijaga di bawah 25 ppm.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Minum Bersih</h4>
                    <p className="text-sm text-slate-500 mt-1">Cek pipa air setiap hari.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 bg-slate-900 p-10 md:p-14 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Siap Meningkatkan Profit?</h3>
              <p className="text-slate-400 mb-8">
                Tingkatkan produktivitas peternakan Anda dengan data yang akurat dan sistem otomatis.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-400" /> Garansi Alat 12 Bulan
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-400" /> Support Teknis 24/7
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-400" /> Kalibrasi Tahunan Gratis
                </li>
              </ul>
              <a href="/docs/overview" className="btn btn-primary w-full btn-outline border-white text-white hover:bg-white hover:text-slate-900">
                Lihat Dokumentasi <FaBook className="ml-2"/>
              </a>
            </div>

          </div>
          {/* (Di dalam section Tips, di bawah CTA Card) */}

{/* ========================= */}
{/* TECH STACK STRIP (OPSIONAL) */}
{/* Menunjukkan kredibilitas teknis */}
{/* ========================= */}
<div className="mt-12 pt-8 border-t border-slate-200">
  <div className="text-center">
    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-6">
      Powered By Modern Technology
    </p>
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-slate-600 text-sm font-medium">
      {/* Link ke docs/hardware */}
      <Link href="/docs/hardware" className="flex items-center gap-2 hover:text-secondary transition-colors">
        <FaMicrochip /> <span>ESP32S3 N16R8</span>
      </Link>
      
      {/* Link ke docs/cara-kerja */}
      <Link href="/docs/cara-kerja" className="flex items-center gap-2 hover:text-secondary transition-colors">
        <FaBrain /> <span>Fuzzy Logic</span>
      </Link>
      
      {/* Link ke docs/software */}
      <Link href="/docs/software" className="flex items-center gap-2 hover:text-secondary transition-colors">
        <FaWifi /> <span>MQTT IoT</span>
      </Link>
      
      {/* Link ke docs/software */}
      <Link href="/docs/software" className="flex items-center gap-2 hover:text-secondary transition-colors">
        <FaReact /> <span>Next.js</span>
      </Link>
    </div>
  </div>
</div>
        </div>
      </section>

    </div>
  );
}