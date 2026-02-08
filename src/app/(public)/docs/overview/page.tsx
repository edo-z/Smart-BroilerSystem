import Link from "next/link";
import {
    FaBook,
    FaCogs,
    FaWifi,
    FaServer,
    FaInfoCircle,
    FaExclamationTriangle,
    FaChevronRight,
    FaChevronLeft,
    FaCheck,
    FaLessThan
} from "react-icons/fa";
import { HiCheckCircle, HiExclamation, HiBell } from "react-icons/hi";

export default function DocsPage() {
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
                                    <li><Link href="/docs/overview" className="text-primary bg-blue-50/50 border-r-4 border-primary font-semibold">Overview Produk</Link></li>
                                    <li>
                                        <Link href="/docs/cara-kerja" className="hover:text-slate-600">
                                            Cara Kerja
                                        </Link>
                                    </li>
                                    <li><Link href="/docs/install" className="hover:text-slate-600">Stack Hardware</Link></li>
                                    <li><Link href="/docs/config" className="hover:text-slate-600">Konfigurasi App</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">
                                    Referensi Teknis
                                </h3>
                                <ul className="menu bg-white rounded-xl shadow-sm border border-slate-200 w-full text-sm font-medium">
                                    <li><Link href="/docs/hardware" className="hover:text-slate-600">Stack Hardware</Link></li>
                                    <li><Link href="/docs/software" className="hover:text-slate-600">Stack Software</Link></li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* ========================================= */}
                    {/* 2. KONTEN UTAMA (Typography & Component)  */}
                    {/* ========================================= */}
                    <main className="flex-1 min-w-0">
                        <article className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-200">

                            {/* Header Artikel */}
                            <div className="border-b border-slate-100 pb-8 mb-8">
                                <span className="badge badge-secondary badge-outline p-3 mb-4">Overview Produk</span>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                    Overview Produk BroilerSmart
                                </h1>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    Panduan lengkap memahami alur data sensor IoT dari kandang ayam hingga dashboard monitoring real-time Anda.
                                </p>
                            </div>

                            {/* Typography Plugin Wrapper: prose prose-slate */}
                            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-pre:bg-[#0f172a]">

                                {/* Paragraf Pendahuluan */}
                                <p>
                                    Sistem BroilerSmart dirancang dengan arsitektur <strong>Edge Computing</strong> dan <strong>Cloud Monitoring</strong>. Ini memastikan data lingkungan (suhu & kelembapan) tidak hanya dibaca, tetapi juga diproses secara cerdas untuk memberikan peringatan dini sebelum kualitas kandang turun.
                                </p>

                                {/* COMPONENT: ALERT INFO */}
                                <div role="alert" className="alert alert-info mb-8 not-prose">
                                    <FaInfoCircle className="text-xl shrink-0" />
                                    <div>
                                        <h3 className="font-bold">Fitur Utama: Mode Hybrid</h3>
                                        <div className="text-xs">
                                            Alat ini bekerja dalam mode hybrid. Data dikirim ke cloud, namun sistem kontrol (aktifkan kipas/alat pemanas) tetap berjalan lokal di perangkat untuk mencegah risiko mati total saat koneksi internet putus.
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian 1: Hardware Level */}
                                <h2 id="hardware">1. Deteksi Lingkungan (Hardware Level)</h2>
                                <p>
                                    Perangkat sensor dipasang pada ketinggian standar ayam broiler (±30 cm dari lantai). Kami menggunakan sensor <strong>DHT22 (AM2302)</strong> yang terkenal akurasinya.
                                </p>

                                {/* List dengan Check Icon Custom (Melakukan override style prose) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <FaCheck className="text-green-500 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-700">Sensor Suhu</h4>
                                            <p className="text-sm text-slate-500">Range: -40°C s/d 80°C</p>
                                            <p className="text-sm text-slate-500">Akurasi: ±0.5°C</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <FaCheck className="text-blue-500 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-700">Sensor Kelembapan</h4>
                                            <p className="text-sm text-slate-500">Range: 0% s/d 100% RH</p>
                                            <p className="text-sm text-slate-500">Akurasi: ±2-5% RH</p>
                                        </div>
                                    </div>
                                </div>

                                <p>
                                    Data mentah dari sensor ini dibaca oleh mikrokontroler (ESP8266 / ESP32) setiap <code className="bg-slate-100 text-red-500">1000ms</code>.
                                </p>

                                {/* Bagian 2: Transmisi Data */}
                                <h2 id="transmission">2. Transmisi Data (IoT Layer)</h2>
                                <p>
                                    Setelah pembacaan berhasil, data dikemas menjadi format JSON Payload dan dikirim ke Server Broker MQTT (Message Queuing Telemetry Transport).
                                </p>

                                {/* COMPONENT: MOCKUP CODE (Terminal Style) */}
                                <div className="my-8 not-prose">
                                    <div className="mockup-code bg-[#1e293b] text-slate-300 shadow-xl border border-slate-700">
                                        <pre data-prefix="$"><code>curl -X POST https://api.broilersmart.id/v1/feed</code></pre>
                                        <pre data-prefix=">"><code>{`{
  "device_id": "BS-8829-X",
  "timestamp": "2023-11-15T14:30:00Z",
  "location": "Kandang A - Zona 2",
  "readings": {
    "temp_celsius": 29.5,
    "humidity_percent": 64.2,
    "heat_index": 31.1
  },
  "status": "normal"
}`}</code></pre>
                                    </div>
                                    <p className="text-xs text-center text-slate-400 mt-2 font-mono">
                                        Contoh Payload JSON: /v1/feed
                                    </p>
                                </div>

                                {/* COMPONENT: ALERT WARNING */}
                                <div role="alert" className="alert alert-warning mb-8 not-prose">
                                    <FaExclamationTriangle className="text-xl shrink-0" />
                                    <div>
                                        <h3 className="font-bold">Penting: Koneksi Wi-Fi</h3>
                                        <div className="text-xs">
                                            Perangkat mendukung 2.4GHz. Pastikan sinyal Wi-Fi stabil di area kandang. Jika sinyal lemah (RSSI Tidak boleh lebih -80dBm), data mungkin tertunda (Buffer Mode).
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian 3: Visualisasi & User */}
                                <h2 id="dashboard" className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">3</span>
                                    Visualisasi & Monitoring (User Interface)
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Data yang masuk ke server diproses oleh algoritma prediktif kami. Selain ditampilkan di grafik, sistem juga melakukan validasi terhadap ambang batas (Threshold) yang telah Anda set.
                                </p>

                                <div className="alert bg-blue-50 border-blue-200 shadow-sm mb-8">
                                    <HiBell className="text-blue-600 text-2xl" />
                                    <span className="text-sm">
                                        Jika suhu kandang melampaui <strong className="text-blue-800">32°C</strong> selama 5 menit berturut-turut, sistem akan otomatis mengirimkan Notifikasi Push ke smartphone pengelola peternakan.
                                    </span>
                                </div>

                                <div className="overflow-hidden rounded-xl bg-base-100">
                                    <table className="table table-lg">
                                        {/* head */}
                                        <thead className="bg-base-200/50">
                                            <tr className="text-base-content/70">
                                                <th>Kondisi</th>
                                                <th>Ambang Batas</th>
                                                <th>Aksi Sistem</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* row 1 */}
                                            <tr className="hover:bg-base-200/30 transition-colors">
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                                            <HiCheckCircle className="text-xl" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">Normal</div>
                                                            <div className="text-xs opacity-50">Sistem Stabil</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-mono text-sm">24.0°C - 28.0°C</td>
                                                <td>
                                                    <span className="badge badge-ghost badge-sm py-3 px-4">Monitoring Pasif</span>
                                                </td>
                                            </tr>

                                            {/* row 2 */}
                                            <tr className="hover:bg-base-200/30 transition-colors">
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                                            <HiExclamation className="text-xl" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">Warning</div>
                                                            <div className="text-xs opacity-50">Perlu Pantauan</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-mono text-sm">29.0°C - 32.0°C</td>
                                                <td>
                                                    <span className="badge badge-warning badge-outline badge-sm py-3 px-4">Log App Notification</span>
                                                </td>
                                            </tr>

                                            {/* row 3 */}
                                            <tr className="hover:bg-base-200/30 transition-colors">
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-red-100 text-red-600 rounded-lg animate-pulse">
                                                            <HiBell className="text-xl" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-red-600">Critical</div>
                                                            <div className="text-xs text-red-400">Tindakan Segera!</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-mono text-sm font-bold text-red-600 font-bold">+32.0°C</td>
                                                <td>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="badge badge-error text-white badge-sm py-3 px-4">Push Notification</span>
                                                        <span className="badge badge-error badge-outline badge-xs">Local Alarm Active</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footer Artikel (Navigasi Halaman) */}
                            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                
                                <div className="text-sm text-slate-400 italic">
                                    Terakhir diupdate: 15 Nov 2023
                                </div>
                                <Link href="/docs/cara-kerja" className="btn btn-sm btn-primary w-full md:w-auto justify-end">
                                    Cara Kerja <FaChevronRight />
                                </Link>
                            </div>

                        </article>
                    </main>
                </div>
            </div>
        </div>
    );
}