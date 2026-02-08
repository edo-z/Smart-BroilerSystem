'use client';

import React from 'react';
import { 
  BookOpen, 
  Layout,
  Cpu, 
  Thermometer, 
  Clock, 
  Radio, 
  Camera, 
  Monitor,
  BatteryCharging,
  Fan,
  Flame,
  Zap,
  ArrowRight,
  Settings,
  Server,
  Network,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

// Data Structure Hardware yang Diperkaya (Padat Teori)
interface HardwareComponent {
  category: string;
  icon: React.ReactElement;
  model: string;
  name: string;
  function: string;
  specs: string;
  theory: string;
  isCore?: boolean;
}

const hardwareComponents: HardwareComponent[] = [
  {
    category: "Processing Unit",
    icon: <Cpu className="text-emerald-600" size={28} />,
    model: "ESP32-S3 N16R8",
    name: "Mikrokontroler Utama",
    function: "Fuzzy Inference Engine & IoT Gateway",
    specs: "Dual-core Xtensa LX6 240MHz, 16MB Flash, 8MB PSRAM",
    theory: "Dipilih karena kemampuan dual-core untuk multitasking: Core 0 menangani interrupt sensor (I2C) dengan prioritas tinggi, sedangkan Core 1 mengeksekusi logika Fuzzy Mamdani dan komunikasi jaringan (WiFi/MQTT) tanpa blocking.",
    isCore: true
  },
  {
    category: "Sensing Unit",
    icon: <Thermometer className="text-blue-500" size={28} />,
    model: "DFRobot SHT40",
    name: "Sensor Lingkungan",
    function: "High-Precision Temperature & Humidity Sensing",
    specs: "Akurasi ±0.1°C / ±1.8% RH, 0-100% Range, I2C",
    theory: "Menggunakan teknologi sensor CMOSens terbaru yang memberikan resolusi tinggi dan stabilitas jangka panjang. Output digital I2C mengeliminasi noise analog pada kabel panjang di lingkungan kandang yang lembap."
  },
  {
    category: "Timing Unit",
    icon: <Clock className="text-slate-600" size={28} />,
    model: "DS3231",
    name: "Real Time Clock (RTC)",
    function: "Set Point Synchronization & Data Logging",
    specs: "TCXO Crystal, ±2ppm Accuracy, CR2032 Backup",
    theory: "Kritis untuk mekanisme *Dynamic Set Point*. RTC menyediakan timestamp akurat untuk log data historis dan memicu perubahan suhu target secara otomatis berdasarkan umur ayam (Hari ke-X) tanpa dependensi internet (NTP)."
  },
  {
    category: "Communication Unit",
    icon: <Radio className="text-orange-500" size={28} />,
    model: "SIM800L",
    name: "Modul GSM/GPRS",
    function: "Fail-safe Connectivity & Critical Alerts",
    specs: "Quad-band 850/900/1800/1900 MHz, TCP/IP Stack",
    theory: "Berfungsi sebagai jalur komunikasi cadangan (redundancy) saat jaringan WiFi lokal down. Mengirimkan notifikasi SMS (text) untuk alarm kritis (Suhu > 35°C) menggunakan protokol AT Command."
  },
  {
    category: "Visual Unit",
    icon: <Camera className="text-purple-500" size={28} />,
    model: "ESP32-CAM",
    name: "Visual Monitoring Node",
    function: "Remote Visual Inspection & Anomaly Detection",
    specs: "OV2640 2MP, JPEG Compression, MicroSD Slot",
    theory: "Beroperasi sebagai node independen yang melakukan stream video MJPEG via HTTP. Memungkinkan verifikasi visual kondisi fisik ayam (piling/crowding) yang tidak dapat dideteksi oleh sensor suhu."
  },
  {
    category: "Interface Unit",
    icon: <Monitor className="text-indigo-500" size={28} />,
    model: "LCD 16x2 I2C",
    name: "HMI Lokal (Local HMI)",
    function: "On-site Status Display & Debugging",
    specs: "HD44780 Controller, I2C Backpack (PCF8574)",
    theory: "Menyediakan antarmuka langsung untuk peternak di lokasi kandang untuk membaca nilai aktual, setpoint, dan status aktuator tanpa perlu membuka smartphone/dashboard."
  },
  {
    category: "Power Unit",
    icon: <BatteryCharging className="text-green-500" size={28} />,
    model: "TP4056 + 18650 Li-Ion",
    name: "Power Management System",
    function: "Uninterruptible Power Supply (UPS)",
    specs: "CC-CV Charging 1A, DW01 Protection IC",
    theory: "Menjamin operasional sistem selama pemadaman listrik sesaat. Sistem charging otomatis (TP4056) memastikan baterai selalu dalam kondisi penuh saat listrik PLN menyala."
  }
];

const ArchitecturePage = () => {
  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#1E293B] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-32">
      {/* Top Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 w-full sticky top-0 z-50 shadow-sm" />
      
      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Header Section (Sesuai Request dengan Konteks Arsitektur) */}
        <header className="mb-20 border-b border-slate-200 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3 text-emerald-600 font-sans font-black text-[10px] uppercase tracking-[0.4em]">
              <BookOpen size={16} /> Technical Archive // Vol. 02 // System Architecture
            </div>
            <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  STATUS: FINAL_RELEASE_V4.2
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-4">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-slate-900 mb-6">
                    System Architecture: <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                        Hardware Integration & Logic
                    </span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
                    Pendefinisian spesifikasi perangkat keras (Bill of Materials) dan arsitektur kontrol aktuator untuk mengimplementasikan logika Fuzzy Mamdani pada ekosistem kandang closed house.
                </p>
            </div>
            <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Processing Core</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">Dual-Core Edge AI</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Sensor Fusion</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">I2C Bus Protocol</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Actuation</div>
                    <div className="text-sm font-bold text-slate-800 tracking-tight">PWM & Phase Control</div>
                </div>
            </div>
          </div>
        </header>

        {/* Section 2.1: Hardware (Diperkaya Teori) */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <Cpu size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">2.1 Perangkat Keras (Hardware)</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Spesifikasi teknis dan rasional pemilihan komponen (BOM).</p>
            </div>
          </div>
          
          {/* Theory Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Network className="w-4 h-4 text-emerald-600" />
                  Arsitektur Komunikasi Data
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                  Sistem menggunakan topologi bintang (Star Topology) terpusat dengan ESP32 sebagai master. 
                  Komunikasi antar perangkat (Sensor, RTC, LCD) menggunakan protokol serial <strong>I2C (Inter-Integrated Circuit)</strong> 
                  pada alamat unik, sehingga mengurangi kompleksitas kabel (hanya 2 jalur data: SDA & SCL). 
                  Ini meminimalkan noise interference di lingkungan industri peternakan.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hardwareComponents.map((item, index) => (
                <div 
                    key={index} 
                    className={`group bg-white rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden
                        ${item.isCore 
                            ? 'border-emerald-500 shadow-lg shadow-emerald-100' 
                            : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                        }`}
                >
                    {item.isCore && (
                        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                            Core Unit
                        </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase border border-slate-100 px-2 py-1 rounded">
                            {item.category}
                        </span>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-black text-lg text-slate-900 mb-1">{item.name}</h3>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{item.model}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fungsi Utama</div>
                            <p className="text-sm text-slate-600 leading-snug">{item.function}</p>
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                <Settings size={10} /> Spesifikasi Teknis
                            </div>
                            <p className="text-xs font-mono text-slate-700 leading-relaxed">
                                {item.specs}
                            </p>
                        </div>

                        {/* Theory/Justification Block */}
                        <div className="pt-2 border-t border-dashed border-slate-200">
                             <div className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-slate-600 italic leading-snug">
                                    {item.theory}
                                </p>
                             </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </section>

        {/* Section 2.2: Actuators (Padat Teori Mekanisme Kontrol) */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                <Zap size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900">2.2 Mekanisme Kontrol Aktuator</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Penerapan teknik modulasi sinyal berbasis keluaran Fuzzy.</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-10 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Card: Cooling System */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                                <Fan size={32} className="animate-spin-slow" style={{animationDuration: '3s'}} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Sistem Pendingin (Cooling)</h3>
                                <p className="text-sm text-slate-400 font-mono">Exhaust Fan Control</p>
                            </div>
                        </div>
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <ArrowRight size={16} className="text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-emerald-400 font-bold w-24 text-right">Input:</span>
                            <span className="text-slate-300 font-mono bg-white/5 px-2 py-1 rounded">Fuzzy Output (0-100%)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-blue-400 font-bold w-24 text-right">Signal:</span>
                            <span className="text-slate-300 font-mono bg-white/5 px-2 py-1 rounded">PWM (Pulse Width Modulation)</span>
                        </div>
                        
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Teori Operasi</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Kipas exhaust dikendalikan oleh <strong>PWM AC Voltage Regulator</strong>. 
                                Sistem tidak menggunakan metode On/Off relay yang menyebabkan inrush current tinggi. 
                                Sebaliknya, duty cycle sinyal PWM dimodulasi untuk mengatur tegangan RMS yang sampai ke motor kipas, 
                                memungkinkan variasi kecepatan putaran (variable speed) yang halus sesuai kebutuhan pembuangan panas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card: Heating System */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400">
                                <Flame size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Sistem Pemanas (Heating)</h3>
                                <p className="text-sm text-slate-400 font-mono">Brooder Lamp/Heater Control</p>
                            </div>
                        </div>
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <ArrowRight size={16} className="text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-emerald-400 font-bold w-24 text-right">Input:</span>
                            <span className="text-slate-300 font-mono bg-white/5 px-2 py-1 rounded">Fuzzy Output (0-100%)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-orange-400 font-bold w-24 text-right">Signal:</span>
                            <span className="text-slate-300 font-mono bg-white/5 px-2 py-1 rounded">AC Dimmer (Phase Control)</span>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Teori Operasi</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Heater dikendalikan menggunakan teknik <strong>Phase-Angle Control (Dimmer)</strong> dengan deteksi <strong>Zero-Crossing</strong>. 
                                Triac pada modul dimmer "menyulut" (firing) pada titik tertentu setelah gelombang AC melewati nol volt. 
                                Menggeser sudut penyalaan (firing angle) ini mengubah persentase siklus daya yang diterima heater, 
                                memberikan kontrol suhu yang presisi tanpa switching noise.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Server size={18} />
                    <span>Kedua aktuator menerima sinyal analog/digital terkonversi langsung dari pin ESP32 (GPIO) melalui driver optocoupler untuk isolasi tegangan.</span>
                </div>
            </div>
          </div>
        </section>

        {/* Navigation Footer */}
        <footer className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 font-sans">
          <div className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">BAB 2 Selesai.</span> Tinjau ulang spesifikasi sebelum melanjutkan ke metodologi.
          </div>
          <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl group">
            Next: Methodology <ArrowUpRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </button>
        </footer>

      </main>
      
      <div className="fixed left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden xl:block pointer-events-none z-10" />
    </div>
  );
};

export default ArchitecturePage;