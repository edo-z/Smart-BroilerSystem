'use client';

import React from 'react';
import { 
  BookOpen, 
  Layers,
  Cpu,
  Terminal,
  Wifi,
  Server,
  Database,
  Layout,
  Code2,
  Globe,
  ArrowRight,
  CheckCircle,
  Zap,
  Lock,
  Smartphone
} from 'lucide-react';

const SoftwareStackPage = () => {
  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#1E293B] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-32">
      {/* Top Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 w-full sticky top-0 z-50 shadow-sm" />
      
      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Header Section (Consistent) */}
        <header className="mb-20 border-b border-slate-200 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3 text-emerald-600 font-sans font-black text-[10px] uppercase tracking-[0.4em]">
              <BookOpen size={16} /> Technical Archive // Vol. 04 // Software Stack
            </div>
            <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  Software Architecture
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-4">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-slate-900 mb-6">
                    Software Architecture: <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                        Embedded to Cloud Integration
                    </span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
                    Analisis mendalam mengenai pemilihan teknologi perangkat lunak, mulai dari logika firmware tingkat rendah hingga antarmuka pengguna berbasis web modern.
                </p>
            </div>
            <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Firmware</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">C++ / PlatformIO</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Protocol</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">MQTT Pub/Sub</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Full Stack</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">MERN + Next.js</div>
                </div>
            </div>
          </div>
        </header>

        {/* Section 1: Firmware (Edge Layer) */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-slate-800 rounded-lg text-white">
                <Cpu size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">1. Firmware Mikrokontroler (Edge Layer)</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Logika kendali yang tertanam langsung pada perangkat keras.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={60}/></div>
                    <div className="relative z-10">
                        <div className="text-xs text-slate-400 font-mono mb-2">environment.ini</div>
                        <div className="font-mono text-sm space-y-1">
                            <p><span className="text-pink-400">[env:esp32dev]</span></p>
                            <p><span className="text-blue-400">platform</span> = espressif32</p>
                            <p><span className="text-blue-400">framework</span> = arduino</p>
                            <p><span className="text-blue-400">board</span> = esp32dev</p>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Menggunakan <strong>C++</strong> dengan framework Arduino untuk abstraksi register hardware. <strong>PlatformIO</strong> digunakan sebagai manajemen build system yang lebih modern dibanding Arduino IDE standar, memungkinkan integrasi Continuous Integration (CI) dan library management yang lebih baik.
                </p>
            </div>

            <div className="space-y-3">
                {[
                    { lib: "FLC / Fuzzy Logic Control ", desc: "Implementasi logika Fuzzy Mamdani (Fuzzifikasi, Inferensi, Defuzzifikasi) secara efisien." },
                    { lib: "PubSubClient", desc: "Klien MQTT ringan untuk publish data sensor dan subscribe perintah kontrol." },
                    { lib: "Wire.h", desc: "Komunikasi I2C untuk sensor SHT40 dan RTC." },
                    { lib: "WiFi.h & HTTPClient", desc: "Koneksi jaringan dan fallback komunikasi HTTP jika MQTT gagal." }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-4 hover:border-emerald-300 transition-colors">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                            <Code2 size={18} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 font-mono">{item.lib}</h4>
                            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* Section 2: Network & Protocol */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Wifi size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">2. Protokol Komunikasi (Network Layer)</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Mekanisme transmisi data antar perangkat.</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 relative overflow-hidden">
             <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-amber-100 rounded-full blur-2xl"></div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Message Queuing Telemetry Transport (MQTT)</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-6">
                        Dipilih karena kepantingan (latency rendah) dan ukuran payload yang kecil, sangat cocok untuk jaringan dengan bandwidth terbatas atau koneksi seluler (GPRS). Menggunakan pola <strong>Publish/Subscribe</strong> yang decouples producer (ESP32) dan consumer (Web Dashboard).
                    </p>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-800">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span><strong>Topic:</strong> <code className="bg-white px-2 py-0.5 rounded text-xs">broiler/feeds/temperature</code></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-800">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span><strong>Topic:</strong> <code className="bg-white px-2 py-0.5 rounded text-xs">broiler/feeds/humidity</code></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-800">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span><strong>QoS:</strong> Level 1 (At least once delivery)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Alur Data (JSON Payload)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
{`{
  "device_id": "ESP32_001",
  "timestamp": 1678900000,
  "data": {
    "temp": 28.5,
    "hum": 65,
    "fuzzy_output": 45,
    "heater_status": "OFF",
    "fan_speed": 30
  },
  "age_days": 14
}`}
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* Section 3 & 4: Backend & Frontend */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Server size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">3 & 4. Backend & Frontend (Cloud & Client)</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Infrastruktur server dan antarmuka pengguna.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Backend Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                        <Database size={28} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Backend & Database</h3>
                        <div className="text-xs font-mono text-slate-400">Node.js + MongoDB</div>
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">Node.js (Runtime)</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Berfungsi sebagai middleware atau broker gateway tambahan (jika diperlukan) dan API server. Menggunakan arsitektur <strong>Event-Driven, Non-Blocking I/O</strong> yang mampu menangani koneksi konkuren tinggi dari banyak perangkat IoT secara simultan.
                        </p>
                    </div>
                    
                    <div className="w-full h-px bg-slate-100"></div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">MongoDB (NoSQL)</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Database schema-less yang ideal untuk data time-series (log suhu/kelembapan per detik). Mendukung <strong>Aggregation Pipeline</strong> yang powerful untuk menghitung rata-rata harian, grafik tren, dan deteksi anomali secara cepat.
                        </p>
                    </div>
                </div>
            </div>

            {/* Frontend Card */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-white relative overflow-hidden hover:border-emerald-500 transition-colors flex flex-col">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Layout size={120} /></div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-white/10 rounded-xl text-white">
                        <Globe size={28} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Frontend Dashboard</h3>
                        <div className="text-xs font-mono text-emerald-400">Next.js (React)</div>
                    </div>
                </div>

                <div className="space-y-4 flex-1 relative z-10">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Framework React berbasis <strong>Server-Side Rendering (SSR)</strong> yang memberikan performa loading cepat dan SEO-friendly. Digunakan untuk membangun antarmuka admin yang responsif.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Fitur</div>
                            <div className="text-xs font-medium">Real-time Chart</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Fitur</div>
                            <div className="text-xs font-medium">Historical Log</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Fitur</div>
                            <div className="text-xs font-medium">Manual Override</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Fitur</div>
                            <div className="text-xs font-medium">Phase Management</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                        <Lock size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400">Authentication via NextAuth.js / JWT</span>
                    </div>
                </div>
            </div>

          </div>
        </section>

        {/* System Flow Diagram (Summary) */}
        <section className="mt-16">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 text-center">Arsitektur Alur Data End-to-End</h3>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 overflow-x-auto">
                <div className="min-w-[600px] flex items-center justify-between relative">
                    {/* Line Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

                    {/* Node 1: ESP32 */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-300">
                            <Cpu size={28} />
                        </div>
                        <div className="mt-2 text-xs font-bold text-slate-900">ESP32</div>
                        <div className="text-[10px] text-slate-500">Edge Compute</div>
                    </div>

                    <ArrowRight className="text-slate-300 relative z-10" />

                    {/* Node 2: MQTT */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-lg shadow-amber-100">
                            <Wifi size={28} />
                        </div>
                        <div className="mt-2 text-xs font-bold text-slate-900">MQTT Broker</div>
                        <div className="text-[10px] text-slate-500">Pub/Sub Protocol</div>
                    </div>

                    <ArrowRight className="text-slate-300 relative z-10" />

                    {/* Node 3: NodeJS/Mongo */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
                            <Server size={28} />
                        </div>
                        <div className="mt-2 text-xs font-bold text-slate-900">Backend</div>
                        <div className="text-[10px] text-slate-500">Node + MongoDB</div>
                    </div>

                    <ArrowRight className="text-slate-300 relative z-10" />

                    {/* Node 4: NextJS */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Smartphone size={28} />
                        </div>
                        <div className="mt-2 text-xs font-bold text-slate-900">Dashboard</div>
                        <div className="text-[10px] text-slate-500">Next.js UI</div>
                    </div>
                </div>
            </div>
        </section>

        {/* Navigation Footer */}
        <footer className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 font-sans mt-12">
          <div className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">BAB 4 Selesai.</span> Seluruh stack teknologi telah terdefinisi untuk implementasi.
          </div>
          <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl group">
            Next: Conclusion <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </button>
        </footer>

      </main>
      
      <div className="fixed left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden xl:block pointer-events-none z-10" />
    </div>
  );
};

export default SoftwareStackPage;