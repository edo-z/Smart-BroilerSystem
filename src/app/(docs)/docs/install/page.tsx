'use client';

import React from 'react';
import Link from "next/link";
import { 
  BookOpen, 
  Wrench,
  Settings,
  MonitorPlay,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Wifi,
  Database,
  Layout,
  Video,
  Activity,
  List,
  ArrowDown,
  Smartphone,
  Thermometer
} from 'lucide-react';

const InstallationUsagePage = () => {
  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#1E293B] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-auto">
      {/* Top Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 w-full sticky top-20 z-50 shadow-sm" />
      
      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Header Section */}
        <header className="mb-20 border-b border-slate-200 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3 text-emerald-600 font-sans font-black text-[10px] uppercase tracking-[0.4em]">
              <BookOpen size={16} /> Technical Archive // Vol. 05 // Installation & Usage
            </div>
            <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  nstallation & Usage
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-4">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-slate-900 mb-6">
                    Panduan Instalasi & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                        Pengoperasian Sistem
                    </span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
                    Dokumentasi langkah demi langkah untuk perakitan hardware, inisialisasi perangkat lunak, dan monitoring harian menggunakan Smart Poultry Dashboard.
                </p>
            </div>
            <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Hardware</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Assembly</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Software</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Configuration</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Operation</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Monitoring</div>
                </div>
            </div>
          </div>
        </header>

        {/* Section 5.1: Hardware Preparation */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Wrench size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">5.1 Persiapan Hardware</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Proses perakitan fisik dan instalasi perangkat di lapangan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                {
                    step: "01",
                    title: "Perakitan PCB & Kabel",
                    desc: "Rakit modul ESP32, SHT40, RTC, dan Driver pada PCB custom atau protoboard. Pastikan sambungan VCC/GND dan jalur data (I2C, PWM) sesuai skematik untuk mencegah short circuit.",
                    icon: <Cpu size={24} className="text-slate-700" />
                },
                {
                    step: "02",
                    title: "Instalasi Sensor",
                    desc: "Pasang sensor SHT40 pada titik tengah kandang (representatif). Hindari dekat heater atau exhaust fan langsung untuk menghindari pembacaan fluktuatif yang ekstrem.",
                    icon: <Settings size={24} className="text-slate-700" />
                },
                {
                    step: "03",
                    title: "Koneksi Aktuator",
                    desc: "Hubungkan keluaran Dimmer AC ke lampu pemanas (Heater). Hubungkan modul PWM Driver ke kipas exhaust. Verifikasi arah putaran kipas (menghembus keluar).",
                    icon: <Activity size={24} className="text-slate-700" />
                }
            ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-emerald-400 transition-colors relative group">
                    <div className="absolute top-4 right-4 text-4xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors">
                        {item.step}
                    </div>
                    <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit">
                        {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
            ))}
          </div>
        </section>

        {/* Section 5.2: Configuration System */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Settings size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">5.2 Konfigurasi Sistem</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Inisialisasi awal dan sinkronisasi parameter umur.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                  
                  {/* Text Steps */}
                  <div className="flex-1 space-y-8">
                      <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                              <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                          </div>
                          <div className="pb-8">
                              <h4 className="font-bold text-slate-900">Nyalakan & Hubungkan</h4>
                              <p className="text-sm text-slate-600 mt-1">Sistem akan boot, mencoba koneksi WiFi, dan fallback ke SIM800L (GSM) jika WiFi gagal. LED indikator akan berkedip saat terhubung ke Broker MQTT.</p>
                          </div>
                      </div>

                      <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                              <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                          </div>
                          <div className="pb-8">
                              <h4 className="font-bold text-slate-900">Buka Smart Poultry Dashboard</h4>
                              <p className="text-sm text-slate-600 mt-1">Akses URL web admin. Masuk ke menu <span className="font-mono bg-white px-1 py-0.5 rounded text-xs border border-slate-200">Parameter Kontrol</span>.</p>
                          </div>
                      </div>

                      <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-900">Pilih Fase Umur Ayam</h4>
                              <p className="text-sm text-slate-600 mt-1">Pilih fase saat ini, misalnya <span className="font-bold text-emerald-600">"Brooding 1-7 Hari"</span>.</p>
                              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-2">
                                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                                  <p className="text-xs text-emerald-800 leading-snug">
                                      <strong>Otomatisasi:</strong> Sistem akan mengirim perintah Set Point baru (misal: 32°C) ke ESP32 melalui MQTT, dan logika Fuzzy akan menyesuaikan diri.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* UI Mockup for Configuration */}
                  <div className="w-full lg:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                          <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono ml-2">admin.smartpoultry.com</div>
                      </div>
                      <div className="p-6">
                          <div className="text-xs font-bold text-slate-400 uppercase mb-4">Control Parameters</div>
                          
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">Fase Pertumbuhan Ayam</label>
                                  <div className="relative">
                                      <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg p-2.5 appearance-none focus:ring-emerald-500 focus:border-emerald-500">
                                          <option>-- Pilih Fase --</option>
                                          <option>Brooding Awal (0-3 Hari)</option>
                                          <option className='selected'>Brooding Lanjut (4-7 Hari)</option>
                                          <option>Pertumbuhan (8-14 Hari)</option>
                                          <option>Finishing (15-35 Hari)</option>
                                      </select>
                                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                      </div>
                                  </div>
                              </div>

                              <div className="pt-4 border-t border-slate-100">
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-bold text-slate-600">Target Suhu (Sync)</span>
                                      <span className="text-xs font-mono font-bold text-emerald-600">31.0 °C</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
                                  </div>
                                  <div className="flex justify-between mt-1">
                                      <span className="text-[10px] text-slate-400">Min: 20°C</span>
                                      <span className="text-[10px] text-slate-400">Max: 40°C</span>
                                  </div>
                              </div>

                              <button className="w-full mt-4 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
                                  Update Parameter
                              </button>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
        </section>

        {/* Section 5.3: Monitoring (Dashboard Mockup) */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <MonitorPlay size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">5.3 Monitoring & Operasional</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Antarmuka pengguna untuk pemantauan real-time.</p>
            </div>
          </div>

          {/* Dashboard UI Simulation */}
          <div className="bg-slate-900 rounded-3xl p-1 lg:p-2 shadow-2xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900/95 rounded-2xl p-4 lg:p-6">
                {/* Mock Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600/20 text-emerald-500 rounded-lg"><Layout size={20} /></div>
                        <div>
                            <div className="text-sm font-bold text-white">Dashboard Utama</div>
                            <div className="text-[10px] text-slate-400 font-mono">Status: ONLINE • Last Sync: Just now</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Live
                        </div>
                        <Smartphone size={18} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 1. Main Graphs */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-slate-300 uppercase">Live Environment</h3>
                                <div className="flex gap-3 text-[10px] text-slate-400">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Suhu</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Kelembapan</span>
                                </div>
                            </div>
                            {/* Fake Chart Visualization */}
                            <div className="h-48 w-full bg-slate-800 rounded-lg relative overflow-hidden flex items-end gap-1 px-2 pb-2">
                                {[40, 45, 42, 48, 50, 52, 49, 55, 53, 58, 60, 57, 54, 52, 55, 58, 62, 60, 59, 61].map((h, i) => (
                                    <div key={i} className="w-full bg-emerald-500/30 rounded-t hover:bg-emerald-500/60 transition-all" style={{height: `${h}%`}}></div>
                                ))}
                                <div className="absolute top-2 left-2 text-xs font-mono text-emerald-400">30.5°C</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase">Suhu Aktual</div>
                                    <div className="text-2xl font-black text-white">30.5°C</div>
                                </div>
                                <Thermometer className="text-emerald-500" size={32} />
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase">Kelembapan</div>
                                    <div className="text-2xl font-black text-white">62%</div>
                                </div>
                                <Activity className="text-blue-500" size={32} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Sidebar: Camera & Logs */}
                    <div className="space-y-4">
                        {/* Live Camera Mockup */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                                    <Video size={12} /> Live Camera
                                </h3>
                                <span className="text-[10px] font-mono text-red-400 animate-pulse">REC</span>
                            </div>
                            <div className="aspect-video bg-black rounded-lg relative overflow-hidden flex items-center justify-center group cursor-pointer">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544967919-44c1ef2f9e99?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="relative z-10 p-2 bg-black/50 rounded-full backdrop-blur-sm">
                                    <MonitorPlay size={16} fill="white" className="text-white" />
                                </div>
                                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white bg-black/50 px-1 rounded">CAM-01</div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">Monitoring visual kondisi ayam & litter.</p>
                        </div>

                        {/* Inference Logs */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex-1">
                            <h3 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                                <List size={12} /> Keputusan Inferensi
                            </h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                {[
                                    { time: "10:45:02", action: "Fan On (40%)", reason: "Err Temp: +1.5°C" },
                                    { time: "10:42:15", action: "Heater Off", reason: "Reached Setpoint" },
                                    { time: "10:30:00", action: "Setpoint Update", reason: "Phase: Brooding" }
                                ].map((log, i) => (
                                    <div key={i} className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                                            <span className="text-[10px] font-bold text-emerald-400">{log.action}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500">{log.reason}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Navigation Footer */}
        <footer className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 font-sans mt-12">
          <div className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">BAB 5 Selesai.</span> Sistem siap untuk operasional penuh.
          </div>
          <Link href="/soon" className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl group">
            Hubungi Pengembang <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </footer>

      </main>
      
      <div className="fixed left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden xl:block pointer-events-none z-10" />
    </div>
  );
};

export default InstallationUsagePage;