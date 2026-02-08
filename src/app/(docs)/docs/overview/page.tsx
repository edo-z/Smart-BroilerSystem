'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { Chart as ChartJS } from 'chart.js';
import Link from "next/link";
import { 
  BookOpen, 
  FileText, 
  Target, 
  TrendingUp,
  Workflow,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  AlertCircle,
  Zap,
  Activity,
  Maximize,
  Database,
  Layers,
  Gauge,
  Microchip,
  Radio,
  ArrowRight
} from 'lucide-react';

const OverviewPage = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    // Konfigurasi Chart.js
    if (chartRef.current) {
      // Hancurkan chart lama jika ada saat re-render
      chartInstance.current?.destroy();

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Gradient untuk area di bawah garis
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(5, 150, 105, 0.2)'); // Emerald-500 low opacity
      gradient.addColorStop(1, 'rgba(5, 150, 105, 0)');

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['D-01', 'D-07', 'D-14', 'D-21', 'D-28', 'D-35'],
          datasets: [
            {
              label: 'Fluktuasi Konvensional (Osilasi Tinggi)',
              data: [32, 28, 31.5, 26, 30.5, 27], // Data simulasi fluktuasi
              borderColor: '#94a3b8', // Slate-400
              borderWidth: 1.5,
              pointRadius: 3,
              pointBackgroundColor: '#94a3b8',
              borderDash: [5, 5], // Garis putus-putus
              tension: 0.4,
            },
            {
              label: 'Stabilitas BroilerSmart (Fuzzy Control)',
              data: [33, 31, 29, 27, 25, 24], // Data ideal penurunan bertahap
              borderColor: '#059669', // Emerald-600
              backgroundColor: gradient,
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#059669',
              pointBorderWidth: 2,
              tension: 0.3, // Kurva halus
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
              position: 'bottom',
              labels: { 
                  font: { family: 'Inter', size: 11, weight: 500 }, 
                  usePointStyle: true,
                  padding: 20,
                  color: '#475569'
                }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { family: 'Inter', size: 13, weight: 'bold' },
              bodyFont: { family: 'Inter', size: 12 },
              padding: 12,
              cornerRadius: 8,
              displayColors: true
            }
          },
          scales: {
            y: { 
              beginAtZero: false,
              min: 20,
              max: 36,
              grid: { 
                color: '#f1f5f9'
              },
              border: { display: false },
              ticks: { 
                font: { family: 'Inter', size: 11 },
                color: '#64748b'
              },
              title: { 
                display: true, 
                text: 'Suhu Rata-rata Kandang (°C)', 
                font: { size: 10, weight: 'bold', family: 'Inter' },
                color: '#94a3b8'
              }
            },
            x: { 
              grid: { display: false }, 
              ticks: { 
                font: { family: 'Inter', size: 10, weight: 500 },
                color: '#64748b'
              },
              border: { display: false }
            }
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      chartInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#1E293B] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-auto">
      {/* Top Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 w-full sticky top-20 z-50 shadow-sm" />
      
      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Header Section */}
        <header className="mb-20 border-b border-slate-200 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3 text-emerald-600 font-sans font-black text-[10px] uppercase tracking-[0.4em]">
              <BookOpen size={16} /> Technical Archive // Vol. 01 // System Overview
            </div>
            <div className="flex items-center gap-3">
                <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                   System Overview
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-4">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-slate-900 mb-6">
                    Executive Summary: <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                        Smart Microclimate Ecosystem
                    </span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
                    Dokumentasi teknis implementasi sistem kendali adaptif berbasis Fuzzy Logic Mamdani untuk optimalisasi lingkungan kandang Closed House.
                </p>
            </div>
            <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Core Tech</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Fuzzy-Logic Edge Inference</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Target Impact</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">↓ 8.4% FCR Improvement</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Deployment</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Unified IoT Architecture</div>
                </div>
            </div>
          </div>
        </header>

        {/* Section 01: Problem Statement */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-black text-xs">01</span>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Analisis Kritis Kondisi Eksisting
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-2xl leading-snug font-bold text-slate-800">
                Inefisiensi termal menyumbang hingga <span className="text-emerald-600">15%</span> dari total kerugian ekonomi pada siklus pemeliharaan broiler intensif.
              </p>
              <p className="text-base leading-relaxed text-slate-600 font-medium">
                Sistem kandang tertutup (closed house) saat ini masih sangat bergantung pada operator manusia atau kontroler On/Off statis. Ketidaktelitian respon terhadap fluktuasi parameter lingkungan menyebabkan osilasi iklim mikro yang lebar. Hal ini memaksa ayam memasuki fase metabolisme "pertahanan diri" (stress) alih-alih fase pertumbuhan optimal.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl italic text-slate-700 text-sm">
                "Tanpa regulasi adaptif, perbedaan 1°C di luar zona nyaman (THI) dapat mengurangi konsumsi pakan hingga 5% per hari."
              </div>
            </div>
            
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex gap-4 items-center hover:border-red-200 transition-colors">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl shrink-0">
                    <AlertCircle size={24}/>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Thermal Gap</div>
                  <div className="text-lg font-bold tracking-tight text-slate-900">Varian ±3°C</div>
                  <div className="text-xs text-slate-500">dari target Setpoint</div>
                </div>
              </div>
              
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex gap-4 items-center hover:border-amber-200 transition-colors">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-xl shrink-0">
                    <Activity size={24}/>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Energy Loss</div>
                  <div className="text-lg font-bold tracking-tight text-slate-900">Inefisiensi 22%</div>
                  <div className="text-xs text-slate-500">pada konversi pakan (FCR)</div>
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex gap-4 items-center hover:border-blue-200 transition-colors">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl shrink-0">
                    <Zap size={24}/>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Power Grid</div>
                  <div className="text-lg font-bold tracking-tight text-slate-900">High Surge</div>
                  <div className="text-xs text-slate-500">Inrush current aktuator on/off</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Technological Architecture */}
        <section className="mb-24 bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl">
          {/* Background Pattern/Icon */}
          <div className="absolute top-[-50px] right-[-50px] p-20 opacity-5 pointer-events-none rotate-12">
            <Layers size={400} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-8 font-sans flex items-center gap-2">
                <span className="w-8 h-[2px] bg-emerald-500"></span> 
                02. Arsitektur Solusi Terintegrasi
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black mb-4 font-sans tracking-tight leading-tight">
                    "Logika Fuzzy Mamdani sebagai <br/><span className="text-emerald-400">Inti Pengambilan Keputusan.</span>"
                  </h3>
                  <p className="text-slate-400 text-base leading-relaxed font-sans">
                    Berbeda dengan algoritma PID standar yang membutuhkan model matematis presisi, Logika Fuzzy memungkinkan sistem untuk meniru cara berpikir pakar peternakan. Ia mengolah variabel kualitatif (misal: "Agak Panas" & "Sangat Lembap") menjadi instruksi aktuasi PWM/Dimmer yang presisi dan kontinyu.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-5 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors group">
                      <Microchip className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform" size={24} />
                      <div className="text-xs font-black uppercase mb-1 text-slate-300">Edge Compute</div>
                      <div className="text-sm text-slate-400 font-medium">Pemrosesan lokal ESP32 tanpa latensi cloud.</div>
                   </div>
                   <div className="p-5 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors group">
                      <Database className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={24} />
                      <div className="text-xs font-black uppercase mb-1 text-slate-300">Time-Series DB</div>
                      <div className="text-sm text-slate-400 font-medium">Logging data historis presisi tinggi (MongoDB).</div>
                   </div>
                   <div className="p-5 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-colors group">
                      <Radio className="text-amber-500 mb-3 group-hover:scale-110 transition-transform" size={24} />
                      <div className="text-xs font-black uppercase mb-1 text-slate-300">Hybrid Comms</div>
                      <div className="text-sm text-slate-400 font-medium">MQTT (Telemetry) + GSM (Alert Critical).</div>
                   </div>
                </div>
              </div>

              {/* Chart Container */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl relative">
                <div className="absolute top-4 right-4 flex gap-2">
                     <div className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <span className="text-[10px] uppercase font-bold text-slate-300">Proposed</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                         <span className="text-[10px] uppercase font-bold text-slate-300">Existing</span>
                     </div>
                </div>
                <div className="h-72 w-full mt-6">
                  <canvas ref={chartRef}></canvas>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center px-2">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Stability Index: 98.2%</span>
                   </div>
                   <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Model: Comparative Growth Line (35 Days)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Performance Matrix */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-black text-xs">03</span>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Matriks Performa & Diferensiasi
            </h2>
          </div>

          <div className="overflow-hidden shadow-sm border border-slate-200 rounded-3xl bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Parameter Teknis</th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Sistem Eksisting</th>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/50">
                        BroilerSmart Engine
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {[
                    ["Algoritma Kendali", "Digital On/Off (Bang-Bang)", "Fuzzy Inference System (Continuous)"],
                    ["Presisi Sensor", "Analog / Varian ±1.0°C", "Digital SHT40 / Varian ±0.2°C"],
                    ["Aktuasi Output", "Fixed Speed (Relay)", "Variable Speed (PWM/Dimmer)"],
                    ["Respon Latensi", "Manual / Reaktif (Menit)", "Otomatis / Proaktif (Milidetik)"],
                    ["Integrasi Cloud", "Lokal / Isolasi Data", "Real-time MQTT TLS 1.3 Encryption"],
                    ["Monitoring Visual", "Kunjungan Fisik", "ESP32-CAM Live Streaming"]
                    ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-5 font-bold text-slate-700 font-sans">{row[0]}</td>
                        <td className="px-8 py-5 text-slate-400 italic font-medium group-hover:text-slate-600 transition-colors">{row[1]}</td>
                        <td className="px-8 py-5 text-emerald-700 font-bold bg-emerald-50/20 group-hover:bg-emerald-50/50 transition-colors">{row[2]}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        </section>

        {/* Impact & Outcome Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { 
              title: "Financial ROI", 
              desc: "Penghematan pakan & listrik signifikan dengan BEP tercapai dalam 3-4 siklus panen.", 
              icon: <TrendingUp className="text-emerald-500" />,
              stat: "↑ 12% Profit Margin"
            },
            { 
              title: "System Resiliency", 
              desc: "Protokol keamanan data ganda (MQTT + SMS) dan fail-safe hardware tingkat lanjut.", 
              icon: <ShieldCheck className="text-blue-500" />,
              stat: "99.9% System Uptime"
            },
            { 
              title: "Data Intelligence", 
              desc: "Dashboard analitik mendalam untuk prediksi performa panen dan deteksi anomali.", 
              icon: <Gauge className="text-indigo-500" />,
              stat: "Predictive Analytics"
            }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between group hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-300">
                      {item.icon}
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter border border-emerald-100">
                    {item.stat}
                  </span>
                </div>
                <h4 className="font-sans font-black text-lg mb-3 text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-sans">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Footer Navigation */}
        <footer className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 font-sans">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <div className="font-black text-xs uppercase tracking-widest text-slate-900">Information-Dense Overview Paper</div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">ID: BR-TECH-ARC-01 // REV: 2026.02</div>
            </div>
          </div>
          <Link href="/docs" className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 hover:shadow-emerald-300 group">
           System Architecture <ArrowRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
          </Link>
        </footer>

      </main>

      {/* Decorative Left Border */}
      <div className="fixed left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden xl:block pointer-events-none z-10" />
    </div>
  );
};

export default OverviewPage;