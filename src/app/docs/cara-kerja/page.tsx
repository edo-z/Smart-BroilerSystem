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
  FaMicrochip,
  FaProjectDiagram,
  FaBrain
} from "react-icons/fa";

export default function CaraKerjaPage() {
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
                    <Link href="/docs/cara-kerja" className="text-primary bg-blue-50/50 border-r-4 border-primary font-semibold">
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
                  <li><Link href="/docs/hardware" className="hover:text-slate-600">Spesifikasi Hardware</Link></li>
                  <li><Link href="/docs/software" className="hover:text-slate-600">Stack Software</Link></li>
                </ul>
              </div>
            </div>
          </aside>

          {/* KONTEN UTAMA */}
          <main className="flex-1 min-w-0">
            <article className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-200">

              <div className="border-b border-slate-100 pb-8 mb-8">
                <span className="badge badge-primary badge-outline p-3 mb-4">Teknis Sistem</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Alur Kerja & Algoritma Kontrol
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Penjelasan mendalam mengenai arsitektur perangkat keras, proses logika fuzzy, dan protokol komunikasi data pada sistem BroilerSmart.
                </p>
              </div>

              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-pre:bg-[#0f172a]">

                {/* 1. ARSITEKTUR BLOK */}
                <h2 id="architecture">1. Arsitektur Sistem</h2>
                <p>
                  Sistem dibangun dengan pendekatan <strong>Embedded System</strong> terpusat. Unit Mikrokontroler (ESP32) bertindak sebagai otak utama yang mengambil keputusan lokal (Edge Computing) dan mengirim data ke server (Cloud IoT).
                </p>

                <div role="alert" className="alert alert-info mb-8 not-prose">
                  <FaProjectDiagram className="text-xl shrink-0" />
                  <div>
                    <h3 className="font-bold">Diagram Alur Data</h3>
                    <div className="text-xs mt-1 font-mono">
                      Sensor (SHT40) &rarr; ESP32 (Fuzzy Logic) &rarr; Aktuator (Kipas/Heater) <br />
                      &uarr; &uarr; <br />
                      Cloud (MQTT & Database)
                    </div>
                  </div>
                </div>

                <p>Sistem terdiri dari 4 komponen utama yang berinteraksi secara berkelanjutan:</p>

                {/* CARA KERJA LIST DENGAN ICON */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">

                  {/* Blok 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200">
                      <FaMicrochip className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">1. Perolehan Data</h4>
                      <p className="text-sm text-slate-500">
                        Sensor <strong>SHT40</strong> membaca suhu dan kelembapan kandang. Data dikirim ke ESP32 melalui protokol I2C secara berkala.
                      </p>
                    </div>
                  </div>

                  {/* Blok 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 border border-purple-200">
                      <FaBrain className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">2. Evaluasi Fuzzy</h4>
                      <p className="text-sm text-slate-500">
                        ESP32 menghitung Error antara bacaan sensor dan <strong>Setpoint Dinamis</strong> (berdasarkan umur ayam). Hasilnya diproses dengan Fuzzy Logic Mamdani.
                      </p>
                    </div>
                  </div>

                  {/* Blok 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 border border-orange-200">
                      <FaCogs className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">3. Kontrol Aktuator</h4>
                      <p className="text-sm text-slate-500">
                        Output Fuzzy berupa tingkat koreksi. Sistem mengatur <strong>PWM Kipas</strong> dan <strong>Dimmer Heater</strong> untuk mengembalikan kondisi ideal.
                      </p>
                    </div>
                  </div>

                  {/* Blok 4 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 border border-green-200">
                      <FaWifi className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">4. Komunikasi IoT</h4>
                      <p className="text-sm text-slate-500">
                        Data (Suhu, Kelembapan, Status Aktuator) dikirim ke Cloud via <strong>MQTT</strong>. Dashboard Web memvisualisasikan data historis.
                      </p>
                    </div>
                  </div>

                </div>

                {/* 2. ALGORITMA FUZZY MAMDANI */}
                <h2 id="fuzzy">2. Algoritma Fuzzy Logic Mamdani</h2>
                <p>
                  Metode Fuzzy Logic Mamdani digunakan sebagai evaluator keputusan karena ketidakpastian lingkungan kandang yang bersifat non-linear. Berikut adalah langkah-langkahnya:
                </p>

                {/* Code Block for Logic */}
                <div className="my-8 not-prose">
                  <div className="mockup-code bg-[#1e293b] text-slate-300 shadow-xl border border-slate-700">
                    <pre data-prefix="$"><code>// 1. Perhitungan Error</code></pre>
                    <pre data-prefix=">"><code>{`// Error = Setpoint (Umur) - Nilai Sensor`}</code></pre>
                    <pre data-prefix=">"><code>error_suhu = suhu_setpoint - suhu_aktual;
                      error_humid = kelembapan_setpoint - kelembapan_aktual;

// 2. Fuzzifikasi (Input jadi fuzzy set)
// 3. Inferensi (Rule Base Jika... Maka...)
// 4. Defuzzifikasi (Fuzzy set jadi crisp value) -{">"} Koreksi`{"}"}</code></pre>
                  </div>
                </div>

                <h3>Proses Detail:</h3>
                <ol>
                  <li>
                    <strong>Fuzzifikasi:</strong> Mengubah nilai input (Error Suhu & Error Kelembapan) menjadi nilai linguistik (contoh: <em>Suhu "Sedikit Tinggi"</em>, <em>Kelembapan "Rendah"</em>).
                  </li>
                  <li>
                    <strong>Inferensi:</strong> Menerapkan basis aturan (Rule Base). Contoh aturan:
                    <ul className="bg-slate-50 p-4 rounded border border-slate-200 text-sm my-4">
                      <li className="mb-2">IF <em>Error Suhu Negatif (Suhu Terlalu Panas)</em> AND <em>Error Humid Normal</em> THEN <em>Nyalakan Kipas Kencang</em>, <em>Matikan Heater</em>.</li>
                      <li className="mb-2">IF <em>Error Suhu Positif (Suhu Terlalu Dingin)</em> THEN <em>Matikan Kipas</em>, <em>Nyalakan Heater Penuh</em>.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Defuzzifikasi:</strong> Menghasilkan nilai output "Crisp" (angka tunggal) yang merepresentasikan tingkat koreksi (0-100%).
                  </li>
                </ol>

                {/* 3. SETPOINT DINAMIS */}
                <div role="alert" className="alert alert-warning mb-8 not-prose">
                  <FaExclamationTriangle className="text-xl shrink-0" />
                  <div>
                    <h3 className="font-bold">Penting: Setpoint Dinamis</h3>
                    <div className="text-xs">
                      Nilai <code>Setpoint</code> tidak statis. Dikontrol oleh modul <strong>RTC (Real Time Clock)</strong>. Sistem menurunkan target suhu setiap 1-2 hari mengikuti kurva biologis broiler (34°C turun menjadi 24°C).
                    </div>
                  </div>
                </div>

                <h2 id="mqtt">4. Format Data Payload (MQTT)</h2>
                <p>
                  Data dikirim ke broker MQTT dalam format JSON. Berikut adalah struktur payload aktual yang digunakan sistem:
                </p>

                <div className="my-8 not-prose">
                  <div className="mockup-code bg-[#1e293b] text-slate-300 shadow-xl border border-slate-700">
                    <pre data-prefix="$"><code>topic: broiler/sensor/data</code></pre>
                    <pre data-prefix=">"><code>{`{
  "device_id": "BS-ESP32-01",
  "timestamp": "2023-10-27T10:00:00Z",
  "age_days": 14,
  "readings": {
    "temp_celsius": 29.5,
    "humidity_percent": 65.0
  },
  "setpoint": {
    "target_temp": 28.0,
    "target_humid": 65.0
  },
  "actuators": {
    "fan_speed_pwm": 180,   // 0-255
    "heater_dimmer": 0,     // 0-100
    "mode": "Cooling"
  }
}`}</code></pre>
                  </div>
                </div>

              </div>

              {/* Footer Navigasi */}
              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <Link href="/docs/overview" className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-50 w-full md:w-auto justify-start">
                  <FaChevronLeft /> Overview Produk
                </Link>
                <Link href="/docs/install" className="btn btn-sm btn-primary w-full md:w-auto justify-end">
                  Panduan Instalasi <FaChevronRight />
                </Link>
              </div>

            </article>
          </main>
        </div>
      </div>
    </div>
  );
}