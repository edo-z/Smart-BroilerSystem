import Link from "next/link";
import {
    FaBook,
    FaChevronLeft,
    FaChevronRight,
    FaServer,
    FaDatabase,
    FaReact,
    FaNodeJs,
    FaWifi,
    FaMicrochip,
    FaCode,
    FaLayerGroup
} from "react-icons/fa";

export default function SoftwarePage() {
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
                                    <li><Link href="/docs/install" className="hover:text-slate-600">Instalasi Hardware</Link></li>
                                    <li><Link href="/docs/config" className="hover:text-slate-600">Konfigurasi App</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">
                                    Referensi Teknis
                                </h3>
                                <ul className="menu bg-white rounded-xl shadow-sm border border-slate-200 w-full text-sm font-medium">
                                    <li><Link href="/docs/hardware" className="hover:text-slate-600">Stack Hardware</Link></li>
                                    <li><Link href="/docs/software" className="text-primary bg-blue-50/50 border-r-4 border-primary font-semibold">Stack Software</Link></li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 min-w-0">
                        <article className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-200">

                            <div className="border-b border-slate-100 pb-8 mb-8">
                                <span className="badge badge-primary badge-outline p-3 mb-4">Technology Stack</span>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                    Arsitektur & Software
                                </h1>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    Penjelasan mengenai teknologi yang mendasari sistem BroilerSmart, mulai dari Embedded Code hingga Web Dashboard.
                                </p>
                            </div>

                            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">

                                {/* 1. LAYERED ARCHITECTURE */}
                                <h2 id="layers">1. Layered Architecture</h2>
                                <p>
                                    Sistem BroilerSmart terdiri dari 4 lapisan utama yang saling berkomunikasi. Berikut adalah visualisasi stack teknologi yang digunakan:
                                </p>

                                <div className="steps steps-vertical lg:steps-horizontal w-full my-10 not-prose">
                                    <div className="step step-primary">
                                        <FaMicrochip />
                                        <div className="text-xs mt-2 font-bold">Firmware</div>
                                    </div>
                                    <div className="step step-primary">
                                        <FaWifi />
                                        <div className="text-xs mt-2 font-bold">IoT Protocol</div>
                                    </div>
                                    <div className="step step-primary">
                                        <FaNodeJs />
                                        <div className="text-xs mt-2 font-bold">Backend</div>
                                    </div>
                                    <div className="step step-secondary">
                                        <FaReact />
                                        <div className="text-xs mt-2 font-bold">Frontend</div>
                                    </div>
                                </div>

                                {/* 2. FIRMWARE LAYER */}
                                <h2 id="firmware">2. Firmware (Mikrokontroler)</h2>
                                <p>
                                    Kode yang berjalan pada perangkat ESP32. Ditulis menggunakan bahasa <strong>C++</strong> pada lingkungan pengembangan Arduino IDE.
                                </p>
                                <ul>
                                    <li><strong>Library Utama:</strong> `Wire.h` (I2C), `WiFi.h`, `PubSubClient` (MQTT).</li>
                                    <li><strong>Logika:</strong> Implementasi Fuzzy Logic Mamdani secara *inline*.</li>
                                </ul>

                                <div className="my-8 not-prose">
                                    <div className="mockup-code bg-[#1e293b] text-slate-300 shadow-xl border border-slate-700">
                                        <pre data-prefix="$"><code>// ESP32 Code Snippet (C++)</code></pre>
                                        <pre data-prefix=">"><code>{`#include <Wire.h>
#include "DFRobot_SHT40.h"

DFRobot_SHT40 sht40(&Wire, 0x44);

void setup() {
  // Inisialisasi Serial, I2C, dan WiFi
  Serial.begin(115200);
  sht40.begin();
  WiFi.begin(ssid, password);
}

void loop() {
  // Baca Suhu & Kelembapan
  float temp = sht40.getTemperature(C);
  float humi = sht40.getHumidity();
  
  // Jalankan Fuzzy Logic & Kirim MQTT
  if(mqttClient.connected()){
    mqttClient.publish("broiler/data", payload);
  }
}`}</code></pre>
                                    </div>
                                </div>

                                {/* 3. COMMUNICATION (MQTT) */}
                                <h2 id="iot">3. Protokol IoT (MQTT)</h2>
                                <p>
                                    Menggunakan protokol <strong>MQTT (Message Queuing Telemetry Transport)</strong> untuk komunikasi ringan antara perangkat dan server.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
                                    <div className="card bg-base-100 border border-slate-200 p-4 text-center">
                                        <h4 className="font-bold text-slate-800">Broker</h4>
                                        <p className="text-xs text-slate-500">MQTT Broker (HiveMQ)</p>
                                    </div>
                                    <div className="card bg-base-100 border border-slate-200 p-4 text-center">
                                        <h4 className="font-bold text-slate-800">Topic</h4>
                                        <p className="text-xs text-slate-500 font-mono">broiler/sensor/data</p>
                                    </div>
                                    <div className="card bg-base-100 border border-slate-200 p-4 text-center">
                                        <h4 className="font-bold text-slate-800">QoS</h4>
                                        <p className="text-xs text-slate-500">Quality of Service: 0</p>
                                    </div>
                                </div>

                                {/* 4. WEB APPLICATION (NEXT.JS) */}
                                <h2 id="frontend">4. Web Application (Frontend)</h2>
                                <p>
                                    Website yang Anda sedang lihat saat ini dibangun menggunakan <strong>Next.js</strong> (App Router) dan <strong>DaisyUI</strong>.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                                    <div className="card bg-base-100 border border-slate-100 shadow-sm">
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FaReact className="text-2xl text-blue-500" />
                                                <h4 className="font-bold text-slate-800">React & Next.js</h4>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Framework React untuk membangun antarmuka pengguna yang interaktif, SEO-friendly, dan responsif.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card bg-base-100 border border-slate-100 shadow-sm">
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FaLayerGroup className="text-2xl text-purple-500" />
                                                <h4 className="font-bold text-slate-800">DaisyUI & Tailwind</h4>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Utility-first CSS framework untuk styling yang cepat, bersih, dan konsisten dengan tema modern.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card bg-base-100 border border-slate-100 shadow-sm">
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FaBook className="text-2xl text-pink-500" />
                                                <h4 className="font-bold text-slate-800">Chart.js</h4>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Library grafik untuk memvisualisasikan data suhu dan kelembapan secara real-time di halaman web.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card bg-base-100 border border-slate-100 shadow-sm">
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FaServer className="text-2xl text-green-500" />
                                                <h4 className="font-bold text-slate-800">MongoDB</h4>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Database NoSQL fleksibel untuk menyimpan riwayat sensor (Time-series data) dan log user.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. DEVELOPMENT TOOLS */}
                                <h2 id="tools">5. Development Tools</h2>
                                <p>Alat bantu yang digunakan selama proses pengembangan perangkat lunak dan simulasi.</p>

                                <div className="overflow-x-auto not-prose">
                                    <table className="table w-full bg-slate-50 rounded-lg">
                                        <thead>
                                            <tr className="bg-slate-800 text-white">
                                                <th>Tool</th>
                                                <th>Platform</th>
                                                <th>Fungsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="font-bold text-slate-700">MATLAB</td>
                                                <td>Desktop</td>
                                                <td>Simulasi dan desain Fuzzy Logic Mamdani sebelum implementasi ke C++.</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold text-slate-700">Fusion 360</td>
                                                <td>Desktop</td>
                                                <td>Desain 3D casing perangkat dan bracket pemasangan.</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold text-slate-700">VS Code</td>
                                                <td>Editor</td>
                                                <td>IDE utama untuk pengembangan kode React/Next.js dan Node.js.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            {/* Footer Navigasi */}
                            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                <Link href="/docs/hardware" className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-50 w-full md:w-auto justify-start">
                                    <FaChevronLeft /> Hardware Specs
                                </Link>
                                <div className="text-sm text-slate-400 italic">
                                    Version 2.0.1
                                </div>
                                <Link href="/docs/overview" className="btn btn-sm btn-primary w-full md:w-auto justify-end">
                                    Kembali ke Overview <FaChevronRight />
                                </Link>
                            </div>

                        </article>
                    </main>
                </div>
            </div>
        </div>
    );
}