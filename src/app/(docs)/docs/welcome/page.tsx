'use client';
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { Chart as ChartJS } from 'chart.js';
import { 
  FileText, 
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Database,
  Layers,
  Settings,
  Zap,
  Radio,
  AlertCircle,
  Layout,
  Terminal,
  BookOpen,
  MousePointer2,
  HardDrive,
  CheckCircle2,
  Info,
  Wrench
} from 'lucide-react';

const OverviewPage = () => {
  const [activeTab, setActiveTab] = useState('user'); // 'user' atau 'technical'
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current?.destroy();

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['D-01', 'D-07', 'D-14', 'D-21', 'D-28', 'D-35'],
          datasets: [
            {
              label: 'Metode On/Off (Osilasi ±2.5°C)',
              data: [35, 28, 32, 24, 30, 22],
              borderColor: '#94a3b8',
              borderWidth: 2,
              pointRadius: 3,
              borderDash: [5, 5],
              tension: 0.4,
            },
            {
              label: 'Fuzzy Mamdani (Stabilitas ±0.3°C)',
              data: [33, 31, 29, 27, 25, 24],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              borderWidth: 3,
              pointRadius: 0,
              tension: 0.2,
              fill: true,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'top',
              align: 'end',
              labels: { font: { family: 'Inter', size: 12, weight: 600 }, usePointStyle: true, boxWidth: 8 }
            }
          },
          scales: {
            y: { 
              grid: { color: '#f1f5f9' }, 
              ticks: { font: { size: 11 } },
              title: { display: true, text: 'Suhu Lingkungan (°C)', font: { size: 12, weight: 'bold' } }
            },
            x: { grid: { display: false }, ticks: { font: { size: 11 } } }
          }
        }
      });
    }
    return () => {
      chartInstance.current?.destroy();
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white text-[#1E293B] font-sans selection:bg-emerald-100 pb-auto">
      <div className="h-1.5 bg-emerald-600 w-full sticky top-0 z-50" />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Navigation Tabs */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit mb-12 border border-slate-200">
          <button 
            onClick={() => setActiveTab('user')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'user' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Layout size={18} /> Panduan Pengguna
          </button>
          <button 
            onClick={() => setActiveTab('technical')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'technical' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Terminal size={18} /> Referensi Teknis
          </button>
        </div>

        {activeTab === 'user' ? (
          /* --- USER DOCUMENTATION VIEW --- */
          <div className="animate-in fade-in duration-500">
            <header className="mb-14 border-b border-slate-100 pb-10">
              <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight mb-4">
                Selamat Datang di <span className="text-emerald-600">Smart-Co</span>
              </h1>
              <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
                Panduan praktis untuk mengoperasikan sistem kontrol suhu otomatis Anda. Dirancang untuk memastikan kesehatan ternak maksimal dengan usaha minimal.
              </p>
            </header>

            {/* Bab 1: Memulai & Manfaat (Existing) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-3"><BookOpen className="text-emerald-500" /> Bab 1: Cara Memulai</h2>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Power On', desc: 'Hubungkan panel kontrol ke sumber listrik AC 220V.' },
                    { step: '2', title: 'Koneksi WiFi', desc: 'Gunakan aplikasi ponsel untuk menghubungkan alat ke jaringan internet kandang.' },
                    { step: '3', title: 'Set Target Suhu', desc: 'Masukkan target suhu ideal berdasarkan umur ayam (misal: 33°C untuk minggu pertama).' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-3xl font-black text-emerald-200">{item.step}</span>
                      <div>
                        <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><Activity size={24} /> Manfaat Untuk Anda</h2>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <ShieldCheck size={28} className="shrink-0 text-emerald-300" />
                    <div>
                      <h4 className="font-bold">Keamanan Ternak Terjamin</h4>
                      <p className="text-sm text-emerald-50">Sistem mendeteksi perubahan suhu sekecil apapun dan langsung menyesuaikan kipas/pemanas.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Zap size={28} className="shrink-0 text-emerald-300" />
                    <div>
                      <h4 className="font-bold">Hemat Biaya Listrik</h4>
                      <p className="text-sm text-emerald-50">Logika pintar menghindari lonjakan listrik (soft-start) pada motor kipas dan elemen pemanas.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <MousePointer2 size={28} className="shrink-0 text-emerald-300" />
                    <div>
                      <h4 className="font-bold">Pantau dari Mana Saja</h4>
                      <p className="text-sm text-emerald-50">Gunakan Dashboard Web untuk memantau kondisi kandang meskipun Anda sedang berada di luar kota.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Bab 2: Pemasangan (New) */}
            <section className="mb-16">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Settings className="text-emerald-500" /> Bab 2: Petunjuk Pemasangan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                  <div className="font-black text-slate-200 text-4xl mb-4">01</div>
                  <h4 className="font-bold text-slate-800 mb-2">Penempatan Sensor</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Pasang sensor SHT40 di tengah kandang, sekitar 30-50cm di atas lantai (setinggi punggung ayam). Hindari pemasangan langsung di depan kipas atau pemanas.
                  </p>
                </div>
                <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                  <div className="font-black text-slate-200 text-4xl mb-4">02</div>
                  <h4 className="font-bold text-slate-800 mb-2">Instalasi Panel</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Letakkan kotak kontrol utama di tempat yang kering dan mudah dijangkau. Pastikan antena WiFi tidak terhalang oleh material logam besar.
                  </p>
                </div>
                <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                  <div className="font-black text-slate-200 text-4xl mb-4">03</div>
                  <h4 className="font-bold text-slate-800 mb-2">Kabel Aktuator</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Gunakan kabel standar minimal 1.5mm untuk koneksi ke Heater dan Kipas guna menghindari panas berlebih pada kabel akibat beban arus.
                  </p>
                </div>
              </div>
            </section>

            {/* Bab 3: Pemeliharaan & Troubleshooting (New) */}
            <section className="mb-16 bg-slate-50 rounded-[3rem] p-10 border border-slate-100">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Wrench className="text-slate-800" /> Bab 3: Pemeliharaan & Solusi</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-emerald-600 mb-4">Pemeliharaan Rutin</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 size={18} className="text-emerald-500" /> Bersihkan debu pada sensor setiap 1 periode panen.
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 size={18} className="text-emerald-500" /> Periksa kekencangan baut pada terminal kabel aktuator.
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 size={18} className="text-emerald-500" /> Pastikan koneksi internet stabil melalui indikator lampu pada panel.
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                     <AlertCircle size={18} /> Masalah Umum
                   </h4>
                   <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-800 mb-1">Sensor Tidak Terbaca (0.0°C)</p>
                        <p className="text-xs text-slate-500 italic">Solusi: Periksa sambungan kabel I2C (kabel kuning/biru) pada sensor.</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 mb-1">Alat Tidak Terkoneksi WiFi</p>
                        <p className="text-xs text-slate-500 italic">Solusi: Pastikan sinyal WiFi mencapai kandang atau gunakan antena eksternal.</p>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* --- TECHNICAL REFERENCE VIEW --- */
          <div className="animate-in fade-in duration-500">
            <header className="mb-14 border-b border-slate-100 pb-10">
              <div className="flex items-center gap-3 text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                <Cpu size={18} /> Arsitektur Sistem // Protokol I2C & MQTT
              </div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight mb-4">
                Dokumentasi <span className="text-slate-400">Teknis</span>
              </h1>
              <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
                Spesifikasi hardware, alur data, dan logika <i>Inference Engine</i> berbasis Fuzzy Mamdani untuk kontrol presisi tinggi.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Analisis Stabilitas Termal</h3>
                <div className="h-72">
                  <canvas ref={chartRef}></canvas>
                </div>
                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black uppercase text-slate-500 mb-2">Technical Note:</h4>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "Grafik di atas menunjukkan perbandingan respons sistem. Garis hijau (Fuzzy) menunjukkan minimnya overshoot dan osilasi dibandingkan metode konvensional (On/Off), yang secara langsung berdampak pada efisiensi metabolisme ternak."
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                  <h4 className="text-xs font-black uppercase text-emerald-400 mb-6 tracking-widest flex items-center gap-2">
                    <HardDrive size={16}/> Hardware Stack
                  </h4>
                  <div className="space-y-4">
                    {[
                      { key: 'MCU', val: 'ESP32-S3 Dual Core 240MHz' },
                      { key: 'Sensors', val: 'SHT40 (±1.5% RH, ±0.1°C)' },
                      { key: 'Dimmer', val: 'AC Dimmer Module (Zero Cross)' },
                      { key: 'Network', val: 'Dual Band 2.4GHz + GSM SIM800L' }
                    ].map((hw, i) => (
                      <div key={i} className="flex justify-between border-b border-slate-800 pb-2 text-sm">
                        <span className="text-slate-500">{hw.key}</span>
                        <span className="font-mono text-emerald-400 font-bold">{hw.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50">
                   <h4 className="text-xs font-black uppercase text-slate-400 mb-4">Fuzzy Inference Parameters</h4>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm text-slate-700 font-bold">In1: Suhu Actual (0-50°C)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm text-slate-700 font-bold">In2: Delta Error Suhu</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-sm text-slate-700 font-bold">Out: Duty Cycle PWM (0-255)</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer */}
        <footer className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <FileText size={24} />
            </div>
            <div>
               <div className="text-xs font-black text-slate-900 uppercase mb-1">ID Dokumen: TA-0922040012</div>
               <div className="text-xs font-mono text-slate-500 tracking-wider uppercase">Dokumen Tugas Akhir</div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center justify-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 group">
              Hubungi Pengembang <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default OverviewPage;