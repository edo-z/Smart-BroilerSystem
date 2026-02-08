import React from 'react';
import { 
  Brain, 
  CalendarDays, 
  Camera, 
  MessageSquare, 
  History, 
  Cpu, 
  Zap, 
  Code2, 
  Database,
  Globe,
  Settings,
  Activity,
  Layers,
  ChevronRight,
  Server
} from 'lucide-react';

const FeaturesPage = () => {
  const technicalFeatures = [
    {
      title: "Inference Engine: Fuzzy Mamdani",
      category: "Kecerdasan Buatan",
      specs: ["Input: Error Suhu & Kelembapan", "Output: Duty Cycle PWM", "Defuzzifikasi: Centroid"],
      description: "Algoritma pemrosesan logika fuzzy yang tertanam pada firmware untuk kontrol aktuator non-linear.",
      icon: <Brain className="w-5 h-5" />,
      theme: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Dynamic Aging Setpoint",
      category: "Automasi",
      specs: ["Fase: Starter, Grower, Finisher", "Resolusi: Per hari", "Data: RTC Synced"],
      description: "Penyesuaian target termal secara otomatis berdasarkan kurva pertumbuhan ayam broiler.",
      icon: <CalendarDays className="w-5 h-5" />,
      theme: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "MQTT Supervisory Protocol",
      category: "Konektivitas",
      specs: ["Broker: HiveMQ", "QoS: Level 1", "Latency: < 200ms"],
      description: "Protokol pub/sub ringan untuk transmisi data sensor dan penerimaan instruksi kendali jarak jauh.",
      icon: <Globe className="w-5 h-5" />,
      theme: "text-blue-600 bg-blue-50 border-blue-100"
    }
  ];

  const hardwareSpecs = [
    { name: "Unit Pemroses", detail: "ESP32 S3 N16R8 (Dual-core 240MHz)", role: "Main Logic & MQTT Gateway" },
    { name: "Akurasi Sensor", detail: "SHT40 (Temp: ±0.1°C, RH: ±1.5%)", role: "Akuisisi Data Lingkungan" },
    { name: "GSM/GPRS Node", detail: "SIM800L Quad-band", role: "Redundant Alert (SMS) & Off-grid Data" },
    { name: "Output PWM", detail: "Opto-isolated AC Dimmer / SSR", role: "Variasi Kecepatan Kipas & Pemanas" },
    { name: "Visual Feed", detail: "OV2640 Camera Module", role: "Analisis Perilaku Ayam (Heat Stress)" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Navigation / Breadcrumb */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Settings size={16} />
            <span>Dokumentasi Sistem</span>
            <ChevronRight size={14} />
            <span className="text-slate-900">Spesifikasi Teknis v2.1</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <Activity size={12} /> STABLE RELEASE
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <header className="mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded">
            Engineering Overview
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-6">
            Arsitektur Sistem <span className="text-slate-400 font-light">&</span> <br />
            Parameter Teknis
          </h1>
          <div className="h-1.5 w-24 bg-blue-600 rounded-full mb-8"></div>
          <p className="max-w-2xl text-lg text-slate-500 leading-relaxed italic border-l-4 border-slate-200 pl-6">
            "Integrasi Fuzzy Logic Mamdani dan Internet of Things untuk optimalisasi manajemen mikro-klimat pada kandang closed-house."
          </p>
        </header>

        {/* Technical Architecture Grid */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-slate-900 rounded text-white"><Layers size={20} /></div>
            <h2 className="text-2xl font-bold tracking-tight">Core System Modules</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {technicalFeatures.map((f, i) => (
              <div key={i} className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-500 transition-all shadow-sm">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 border ${f.theme}`}>
                  {f.icon}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{f.category}</div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{f.description}</p>
                <div className="space-y-2 border-t border-slate-50 pt-4">
                  {f.specs.map((s, si) => (
                    <div key={si} className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hardware & BOM Section */}
        <section className="mb-20 grid grid-cols-1 xl:grid-cols-5 gap-12">
          <div className="xl:col-span-2">
            <div className="sticky top-28">
              <h2 className="text-3xl font-bold mb-6">Spesifikasi Perangkat Keras</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Pemilihan komponen didasarkan pada durabilitas operasional 24/7 di lingkungan kandang dengan interferensi debu dan kelembapan tinggi.
              </p>
              <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4 font-bold text-slate-700">
                  <Zap size={18} className="text-amber-500" />
                  <span>Power Requirement</span>
                </div>
                <ul className="text-sm space-y-2 text-slate-600 font-medium">
                  <li>• Voltage: 220V AC / 5V DC</li>
                  <li>• Current Consumption: 2A Max</li>
                  <li>• Battery Backup: 3.7V Li-ion</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-[0.2em]">
                  <th className="px-8 py-5 text-left font-bold">Modul Sub-Sistem</th>
                  <th className="px-8 py-5 text-left font-bold">Spesifikasi Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hardwareSpecs.map((h, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{h.name}</div>
                      <div className="text-[11px] text-blue-600 font-semibold mt-1 uppercase tracking-wider">{h.role}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-mono text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded inline-block">
                        {h.detail}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Software Ecosystem */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Server className="text-slate-900" size={24} />
            <h2 className="text-2xl font-bold">Ekosistem Perangkat Lunak</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dev Block */}
            <div className="bg-[#0F172A] p-10 rounded-3xl text-white relative overflow-hidden group">
              <Code2 className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 group-hover:rotate-12 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="text-blue-400 font-mono text-sm mb-4 tracking-tighter">// firmware_development_environment</div>
                <h3 className="text-2xl font-bold mb-8 italic">Environment & Simulation</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-12 bg-blue-500"></div>
                    <div>
                      <div className="font-bold text-lg">Embedded C++ & FreeRTOS</div>
                      <p className="text-slate-400 text-sm">Multi-threading untuk manajemen sensor & konektivitas secara konkuren.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-12 bg-indigo-500"></div>
                    <div>
                      <div className="font-bold text-lg">MATLAB Fuzzy Toolbox</div>
                      <p className="text-slate-400 text-sm">Validasi aturan fuzzy (Rules) dan simulasi surface respons 3D.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stack Block */}
            <div className="bg-white border-2 border-slate-200 p-10 rounded-3xl relative overflow-hidden group">
              <Database className="absolute -bottom-10 -right-10 text-slate-100 w-64 h-64 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="text-blue-600 font-mono text-sm mb-4 tracking-tighter">/* cloud_infrastructure_stack */</div>
                <h3 className="text-2xl font-bold mb-8 italic">Full-stack & Persistence</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 mb-1">FRONTEND</div>
                    <div className="font-bold text-slate-900">Next.js 14</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 mb-1">DATABASE</div>
                    <div className="font-bold text-slate-900">MongoDB Atlas</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 mb-1">AUTH</div>
                    <div className="font-bold text-slate-900">Auth.js v5</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 mb-1">DEPLOYMENT</div>
                    <div className="font-bold text-slate-900">Vercel Edge</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Footer */}
        <footer className="mt-24 border-t border-slate-200 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-mono text-slate-400">DOC-ID: BS-TR-2026-X1</div>
            <div className="text-[10px] font-mono text-slate-400">LOC: SURABAYA, ID</div>
          </div>
          <p className="text-slate-400 text-[11px] font-medium tracking-widest uppercase">
            BroilerSmart System Documentation • Confidential Technical Paper
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FeaturesPage;