import Link from "next/link";
import {
    FaBook,
    FaCogs,
    FaMemory,
    FaServer,
    FaChevronLeft,
    FaChevronRight,
    FaMicrochip
} from "react-icons/fa";

export default function HardwarePage() {
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
                                    <li><Link href="/docs/hardware" className="text-primary bg-blue-50/50 border-r-4 border-primary font-semibold">Stack Hardware</Link></li>
                                    <li><Link href="/docs/software" className="hover:text-slate-600">Stack Software</Link></li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                    {/* Content */}
                    <main className="flex-1 min-w-0">
                        <article className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-200">

                            <div className="border-b border-slate-100 pb-8 mb-8">
                                <span className="badge badge-secondary badge-outline p-3 mb-4">Hardware Stack</span>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                   Aristektur Hardware
                                </h1>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    Daftar komponen perangkat keras yang digunakan dalam pembuatan prototipe sistem monitoring kandang ayam BroilerSmart.
                                </p>
                            </div>

                            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">

                                <h2>Core System</h2>
                                <p>Komponen utama yang mengatur seluruh proses pengambilan keputusan dan komunikasi.</p>

                                <div className="overflow-x-auto not-prose">
                                    <table className="table w-full bg-slate-50 rounded-lg">
                                        <thead>
                                            <tr className="bg-slate-800 text-white">
                                                <th>Komponen</th>
                                                <th>Spesifikasi Utama</th>
                                                <th>Fungsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="font-bold text-slate-700">ESP32-N16R8</td>
                                                <td>
                                                    Dual-core Tensilica LX6, 240 MHz <br />
                                                    16MB Flash, 8MB PSRAM
                                                </td>
                                                <td>Mikrokontroler utama, WiFi/Gateway, Eksekusi Algoritma Fuzzy</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold text-slate-700">DFRobot SHT40</td>
                                                <td>
                                                    Rentang: -40~125°C (Suhu) <br />
                                                    Akurasi: ±0.1°C (Suhu), ±1.8% (Kelembapan)
                                                </td>
                                                <td>Sensor lingkungan utama (Input)</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold text-slate-700">DS3231 (RTC)</td>
                                                <td>
                                                    Akurasi: ±2 ppm <br />
                                                    Backup: Baterai Lithium CR2032
                                                </td>
                                                <td>Waktu Real-time untuk menentukan Setpoint berdasarkan umur ayam</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h2>Aktuator & Driver</h2>
                                <p>Perangkat output yang dikendalikan berdasarkan hasil keputusan fuzzy logic.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">

                                    <div className="card bg-base-100 border border-slate-200">
                                        <div className="card-body p-4">
                                            <h4 className="card-title text-sm flex items-center gap-2">
                                                <FaCogs className="text-orange-500" /> PWM Module AC
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                Pengendali daya untuk Kipas dan Heater. Mengatur fase tegangan AC.
                                            </p>
                                            <ul className="text-xs text-slate-600 list-disc pl-4 mt-2">
                                                <li>Input: PWM Signal (5V)</li>
                                                <li>Load: AC 220V / 2A</li>
                                                <li>Tipe: Triac Dimmer</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="card bg-base-100 border border-slate-200">
                                        <div className="card-body p-4">
                                            <h4 className="card-title text-sm flex items-center gap-2">
                                                <FaMemory className="text-blue-500" /> TP4056
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                Modul charger untuk sistem catu daya battery backup.
                                            </p>
                                            <ul className="text-xs text-slate-600 list-disc pl-4 mt-2">
                                                <li>Input: 5V USB</li>
                                                <li>Output: 4.2V (Li-Ion)</li>
                                                <li>Current: 1A Max</li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>

                                <h2>Visual & Komunikasi</h2>
                                <div className="overflow-x-auto not-prose">
                                    <table className="table w-full bg-slate-50 rounded-lg">
                                        <thead>
                                            <tr className="bg-slate-800 text-white">
                                                <th>Komponen</th>
                                                <th>Spesifikasi Utama</th>
                                                <th>Fungsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="font-bold text-slate-700">ESP32-CAM</td>
                                                <td>OV2640 2MP, WiFi, MicroSD Slot</td>
                                                <td>Monitoring visual kandang (Opsional)</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold text-slate-700">Module SIM800L</td>
                                                <td>Quad-band GSM, TCP/IP, SMS</td>
                                                <td>Notifikasi alternatif via SMS jika WiFi down</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="alert alert-success mt-8 not-prose">
                                    <FaMicrochip />
                                    <div>
                                        <h3 className="font-bold">Ketersediaan Komponen</h3>
                                        <div className="text-xs">
                                            Semua komponen di atas bersifat komersial dan mudah didapatkan di pasar elektronik lokal maupun supplier internasional.
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                <Link href="/docs/cara-kerja" className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-50 w-full md:w-auto justify-start">
                                    <FaChevronLeft /> Cara Kerja
                                </Link>
                                <Link href="/docs/software" className="btn btn-sm btn-primary w-full md:w-auto justify-end">
                                    Stack Software <FaChevronRight />
                                </Link>
                            </div>

                        </article>
                    </main>
                </div>
            </div>
        </div>
    );
}