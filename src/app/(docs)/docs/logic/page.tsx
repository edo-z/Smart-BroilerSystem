'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Untuk grafik Aktuator (Bagian 3.3)
import type { Chart as ChartJS } from 'chart.js';
import Link from "next/link";
import { Line } from 'react-chartjs-2'; // Untuk grafik Suhu (Bagian 3.1)
import { 
  BookOpen, 
  BrainCircuit,
  Settings,
  Thermometer,
  Droplets,
  Activity,
  CheckSquare,
  Zap,
  Fan,
  Flame,
  ArrowRight,
  Table as TableIcon,
  Cpu,
  TrendingUp
} from 'lucide-react';

// --- IMPORTS & REGISTRASI UNTUK GRAFIK SUHU (Bagian 3.1) ---
import {
  Chart as ChartJS_Suhu,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';

// Registrasi komponen Chart.js yang dibutuhkan untuk komponen Line
ChartJS_Suhu.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ChartTitle, 
  ChartTooltip, 
  ChartLegend, 
  Filler
);

// --- KOMPONEN GRAFIK SUHU (Sesuai Request) ---
const SuhuChart = () => {
  // 1. Definisikan dataset berdasarkan fungsi Tsp(u)
  const days = Array.from({ length: 26 }, (_, i) => i);

  const getSuhuRange = (u: number) => {
    if (u <= 3) return { min: 31, max: 34, label: 'Brooding Awal' };
    if (u <= 7) return { min: 30, max: 31, label: 'Fase 2' };
    if (u <= 14) return { min: 28, max: 29, label: 'Fase 3' };
    if (u <= 21) return { min: 25, max: 27, label: 'Fase 4' };
    return { min: 24, max: 25, label: 'Pembesaran' }; // u >= 22
  };

  const dataMin = days.map(u => getSuhuRange(u).min);
  const dataMax = days.map(u => getSuhuRange(u).max);
  const dataAvg = days.map(u => (getSuhuRange(u).min + getSuhuRange(u).max) / 2);

  const data = {
    labels: days.map(d => `H-${d}`),
    datasets: [
      {
        label: 'Target Ideal (Rata-rata)',
        data: dataAvg,
        borderColor: '#0f172a', // Slate-900
        borderWidth: 2,
        pointRadius: 0,
        tension: 0, // Step function
        order: 1
      },
      {
        label: 'Batas Atas',
        data: dataMax,
        borderColor: 'transparent',
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Biru Transparan
        fill: '+1', // Mengisi area ke dataset berikutnya (Batas Bawah)
        pointRadius: 0,
        tension: 0,
        order: 2
      },
      {
        label: 'Batas Bawah',
        data: dataMin,
        borderColor: 'transparent',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: false,
        pointRadius: 0,
        tension: 0,
        order: 3
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { 
            font: { family: 'Inter', size: 11 },
            usePointStyle: true,
            boxWidth: 8 
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Inter', size: 12, weight: 700 },
        bodyFont: { family: 'Inter', size: 11 },
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const u = context.dataIndex;
            const range = getSuhuRange(u);
            return ` ${range.label}: ${range.min}°C - ${range.max}°C`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 20,
        max: 36,
        grid: { color: '#f1f5f9' },
        title: { display: true, text: 'Suhu (°C)', font: { size: 10, family: 'Inter' } },
        ticks: { font: { family: 'Inter', size: 10 } }
      },
      x: {
        grid: { display: false },
        title: { display: true, text: 'Umur (Hari)', font: { size: 10, family: 'Inter' } },
        ticks: { 
            font: { family: 'Inter', size: 10 },
            maxTicksLimit: 13 
        }
      }
    }
  };

  return (
    <div className="w-full h-[350px] bg-white p-2 rounded-xl shadow-sm border border-slate-200">
      <Line data={data} options={options} />
    </div>
  );
};
// -----------------------------------------------------------

const LogicPage = () => {
  // Chart Refs untuk Grafik Aktuator (Bagian 3.3)
  const actuatorChartRef = useRef<HTMLCanvasElement | null>(null);
  const actuatorChartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    // --- 3.3 Actuator Chart Logic (Raw Chart.js) ---
    if (actuatorChartRef.current) {
      actuatorChartInstance.current?.destroy();

      const ctx = actuatorChartRef.current.getContext('2d');
      if (!ctx) return;

      // Gradient untuk Heater
      const gradientHeater = ctx.createLinearGradient(0, 0, 0, 300);
      gradientHeater.addColorStop(0, 'rgba(249, 115, 22, 0.4)'); 
      gradientHeater.addColorStop(1, 'rgba(249, 115, 22, 0)');

      // Gradient untuk Fan
      const gradientFan = ctx.createLinearGradient(0, 0, 0, 300);
      gradientFan.addColorStop(0, 'rgba(14, 165, 233, 0.4)'); 
      gradientFan.addColorStop(1, 'rgba(14, 165, 233, 0)');

      const labels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      
      // Data Heater: Turun saat K naik
      const dataHeater = [100, 90, 70, 40, 10, 0, 0, 0, 0, 0, 0];
      // Data Fan: Naik saat K naik
      const dataFan = [0, 0, 0, 0, 0, 0, 5, 30, 60, 85, 100];

      actuatorChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Heater Power (%)',
              data: dataHeater,
              borderColor: '#f97316', // Orange-500
              backgroundColor: gradientHeater,
              borderWidth: 3,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#f97316',
              pointBorderWidth: 2,
              pointRadius: 4,
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Fan Speed (PWM %)',
              data: dataFan,
              borderColor: '#0ea5e9', // Sky-500
              backgroundColor: gradientFan,
              borderWidth: 3,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#0ea5e9',
              pointBorderWidth: 2,
              pointRadius: 4,
              tension: 0.4,
              fill: true,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: { 
              position: 'top',
              labels: { 
                font: { family: 'Inter', size: 12, weight: 700 }, 
                usePointStyle: true,
                color: '#334155'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { family: 'Inter', size: 13, weight: 700 },
              bodyFont: { family: 'Inter', size: 12 },
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                title: (context) => `Fuzzy Output (K): ${context[0].label}`
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true,
              max: 100,
              grid: { color: '#e2e8f0' },
              ticks: { 
                font: { family: 'Inter', size: 11 },
                color: '#64748b',
                callback: function(value) { return value + '%' }
              },
              title: { 
                display: true, 
                text: 'Daya Aktuator (%)', 
                font: { size: 11, weight: 700, family: 'Inter' },
                color: '#94a3b8'
              }
            },
            x: { 
              grid: { color: '#e2e8f0' },
              ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' },
              title: { 
                display: true, 
                text: 'Nilai Output Fuzzy (K)', 
                font: { size: 11, weight: 700, family: 'Inter' },
                color: '#94a3b8'
              }
            }
          }
        }
      });
    }
    
    return () => {
      actuatorChartInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#1E293B] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-auto">
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 w-full sticky top-20 z-50 shadow-sm" />
      
      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Header Section */}
        <header className="mb-20 border-b border-slate-200 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3 text-emerald-600 font-sans font-black text-[10px] uppercase tracking-[0.4em]">
              <BookOpen size={16} /> Technical Archive // Vol. 03 // Logic & Algorithms
            </div>
            <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  Logic & Algorithms
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-4">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-slate-900 mb-6">
                    Logic & Algorithms: <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                        Fuzzy Inference & Dynamic Control
                    </span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
                    Implementasi logika kendali cerdas yang memisahkan penentuan target fisiologis (Set Point) dengan eksekusi koreksi adaptif (Fuzzy Mamdani).
                </p>
            </div>
            <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Core Method</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Mamdani FIS</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Targeting</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Piecewise Function</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Output</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Defuzzification</div>
                </div>
            </div>
          </div>
        </header>

        {/* Section 3.1: Dynamic Set Point (UPDATED WITH CHART) */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                <Settings size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">3.1 Mekanisme Set Point Dinamis</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Visualisasi fungsi Tsp(u) berdasarkan umur ayam.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Teori */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BrainCircuit size={16} className="text-emerald-600" />
                        Konsep Non-Statis
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        Grafik di samping menggambarkan fungsi <strong>Piecewise</strong> (tangga) yang digunakan sistem. Tidak seperti kurva halus, perubahan suhu terjadi secara bertahap pada titik kritis (Hari ke-4, 8, 15, 22) sesuai fase pertumbuhan ayam broiler.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                        <code className="text-xs md:text-sm font-mono text-slate-700 block mb-2">Tsp(u) = f(Age)</code>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Step-Function Logic</span>
                    </div>
                </div>
            </div>

            {/* CHART AREA */}
            <div className="lg:col-span-8">
                <SuhuChart />
            </div>
          </div>
        </section>

        {/* Section 3.2: Fuzzy Logic Mamdani */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                <Cpu size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">3.2 Fuzzy Logic Mamdani</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Inferensi berbasis aturan linguistik untuk toleransi ketidakpastian.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Thermometer size={20} /></div>
                    <h3 className="font-bold text-slate-900">Input 1: Error Suhu</h3>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg mb-4 text-center font-mono text-xs border border-slate-200">
                    e<sub>s</sub> = T<sub>aktual</sub> - T<sub>sp</sub>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Membership Functions:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex justify-between"><span>NB (Negatif Besar)</span> <span className="text-slate-400">Sangat Dingin</span></li>
                        <li className="flex justify-between"><span>NK (Negatif Kecil)</span> <span className="text-slate-400">Dingin</span></li>
                        <li className="flex justify-between"><span>Z (Nol)</span> <span className="text-slate-400">Ideal</span></li>
                        <li className="flex justify-between"><span>PK (Positif Kecil)</span> <span className="text-slate-400">Panas</span></li>
                        <li className="flex justify-between"><span>PB (Positif Besar)</span> <span className="text-slate-400">Sangat Panas</span></li>
                    </ul>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Droplets size={20} /></div>
                    <h3 className="font-bold text-slate-900">Input 2: Error Kelembapan</h3>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg mb-4 text-center font-mono text-xs border border-slate-200">
                    e<sub>k</sub> = H<sub>aktual</sub> - H<sub>sp</sub>
                    <div className="text-[10px] text-slate-400 mt-1">(Target: 60-65%)</div>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Membership Functions:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex justify-between"><span>NB (Negatif Besar)</span> <span className="text-slate-400">Sangat Kering</span></li>
                        <li className="flex justify-between"><span>NK (Negatif Kecil)</span> <span className="text-slate-400">Kering</span></li>
                        <li className="flex justify-between"><span>Z (Nol)</span> <span className="text-slate-400">Ideal</span></li>
                        <li className="flex justify-between"><span>PK (Positif Kecil)</span> <span className="text-slate-400">Lembap</span></li>
                        <li className="flex justify-between"><span>PB (Positif Besar)</span> <span className="text-slate-400">Sangat Lembap</span></li>
                    </ul>
                </div>
            </div>

            <div className="bg-white border border-emerald-200 shadow-md rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80} /></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Activity size={20} /></div>
                    <h3 className="font-bold text-slate-900">Output: Koreksi (K)</h3>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg mb-4 text-center font-mono text-xs border border-slate-200 relative z-10">
                    Rentang Nilai: 0 - 100
                </div>
                <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Membership Functions:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex justify-between font-medium text-slate-700"><span>SR (Sangat Rendah)</span> <span className="text-emerald-600">0-20</span></li>
                        <li className="flex justify-between font-medium text-slate-700"><span>R (Rendah)</span> <span className="text-emerald-600">21-40</span></li>
                        <li className="flex justify-between font-medium text-slate-700"><span>N (Normal)</span> <span className="text-emerald-600">41-60</span></li>
                        <li className="flex justify-between font-medium text-slate-700"><span>T (Tinggi)</span> <span className="text-emerald-600">61-80</span></li>
                        <li className="flex justify-between font-medium text-slate-700"><span>ST (Sangat Tinggi)</span> <span className="text-emerald-600">81-100</span></li>
                    </ul>
                </div>
            </div>
          </div>
        </section>

        {/* Section 3.3: Pemetaan Aktuator */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                <TrendingUp size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">3.3 Pemetaan Aktuator</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Visualisasi hubungan Fuzzy Output terhadap respon Hardware.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
             <div className="mb-6">
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                    Grafik di bawah ini menunjukkan bagaimana nilai <strong>Output Fuzzy (K)</strong> (Sumbu X) diterjemahkan menjadi persentase daya untuk Heater dan Kipas (Sumbu Y). 
                    Perhatikan adanya zona <em>Deadband</em> (sekitar nilai K 40-60) di mana sistem berada dalam kondisi stabil dan kedua aktuator dimatikan untuk hemat energi.
                </p>
             </div>
             
             {/* Chart Container */}
             <div className="relative h-[400px] w-full border border-slate-100 rounded-xl bg-slate-50/50 p-2">
                <canvas ref={actuatorChartRef}></canvas>
             </div>

             {/* Summary Legend Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <Flame className="text-red-500 shrink-0" size={20} />
                    <div>
                        <div className="text-[10px] font-bold uppercase text-slate-500">Zona Dingin (K: 0-40)</div>
                        <div className="text-xs font-bold text-slate-900">Heater: Aktif | Kipas: Mati</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckSquare className="text-emerald-500 shrink-0" size={20} />
                    <div>
                        <div className="text-[10px] font-bold uppercase text-slate-500">Zona Normal (K: 41-60)</div>
                        <div className="text-xs font-bold text-slate-900">Keduanya: Standby (Hemat Energi)</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <Fan className="text-blue-500 shrink-0" size={20} />
                    <div>
                        <div className="text-[10px] font-bold uppercase text-slate-500">Zona Panas (K: 61-100)</div>
                        <div className="text-xs font-bold text-slate-900">Heater: Mati | Kipas: Aktif</div>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* Navigation Footer */}
        <footer className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 font-sans">
          <div className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">BAB 3 Selesai.</span> Algoritma siap diimplementasikan ke dalam kode Embedded C++.
          </div>
          <Link href="/docs/software" className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl group">
            Software Architecture<ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </footer>

      </main>
      
      <div className="fixed left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden xl:block pointer-events-none z-10" />
    </div>
  );
};

export default LogicPage;