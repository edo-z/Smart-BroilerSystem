"use client";

import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaThermometerHalf,
  FaTint,
  FaBell,
  FaWifi,
  FaSave,
  FaChevronRight,
  FaExclamationTriangle,
  FaCheck,
  FaUser,
  FaLock,
  FaTrash,
  FaPlus,
  FaQrcode,
  FaCopy,
  FaTimes,
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Device {
  _id: string;
  name: string;
  capacity: number;
  active: boolean;
  claimed: boolean;
  claimCode: string;
  createdAt: string;
}

type ToggleProps = {
  enabled: boolean;
  onChange: (val: boolean) => void;
};

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-slate-900" : "bg-slate-200"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  // Sensor Thresholds
  const [tempMin, setTempMin] = useState(26);
  const [tempMax, setTempMax] = useState(31);
  const [humidMin, setHumidMin] = useState(55);
  const [humidMax, setHumidMax] = useState(75);

  // Notifikasi
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [alertSound, setAlertSound] = useState(true);

  // Interval
  const [dataInterval, setDataInterval] = useState("5");
  const [retentionDays, setRetentionDays] = useState("30");

  // Kandang
  // ── Device state (dari database)
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceLoading, setDeviceLoading] = useState(true);

  // ── Modal tambah kandang
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // ── Modal QR code (muncul setelah tambah kandang berhasil)
  const [qrDevice, setQrDevice] = useState<Device | null>(null);

  // ── Fetch devices
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("/api/devices");
        const data: Device[] = await res.json();
        setDevices(data);
      } catch (err) {
        console.error("Gagal fetch devices:", err);
      } finally {
        setDeviceLoading(false);
      }
    };
    fetchDevices();
  }, []);

  // ── Tambah device baru
  const handleAddDevice = async () => {
    if (!newName || !newCapacity) return;
    setAddLoading(true);
    try {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, capacity: Number(newCapacity) }),
      });
      const data: Device = await res.json();
      setDevices((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewName("");
      setNewCapacity("");
      // Langsung tampilkan QR code device baru
      setQrDevice(data);
    } catch (err) {
      console.error("Gagal tambah device:", err);
    } finally {
      setAddLoading(false);
    }
  };

  // ── Toggle aktif/nonaktif device
  const handleToggleDevice = async (device: Device) => {
    try {
      await fetch(`/api/devices/${device._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !device.active }),
      });
      setDevices((prev) =>
        prev.map((d) => d._id === device._id ? { ...d, active: !d.active } : d)
      );
    } catch (err) {
      console.error("Gagal update device:", err);
    }
  };

  // ── Hapus device
  const handleDeleteDevice = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kandang ini?")) return;
    try {
      await fetch(`/api/devices/${id}`, { method: "DELETE" });
      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Gagal hapus device:", err);
    }
  };

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const [activeSection, setActiveSection] = useState("threshold");

  const sections = [
    { id: "threshold", label: "Batas Sensor", icon: <FaThermometerHalf /> },
    { id: "notification", label: "Notifikasi", icon: <FaBell /> },
    { id: "kandang", label: "Manajemen Kandang", icon: <FaCog /> },
    { id: "system", label: "Sistem & Data", icon: <FaWifi /> },
    { id: "account", label: "Akun & Keamanan", icon: <FaUser /> },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Konfigurasi Sistem</h2>
          <p className="text-slate-500 text-sm mt-1">
            Atur parameter, notifikasi, dan preferensi sistem monitoring Anda.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`btn btn-sm h-10 min-h-0 px-5 rounded-xl font-bold flex items-center gap-2 transition-all border-none ${saved
            ? "bg-green-500 text-white"
            : "bg-slate-900 hover:bg-slate-700 text-white"
            }`}
        >
          {saved ? (
            <>
              <FaCheck className="text-xs" /> Tersimpan
            </>
          ) : (
            <>
              <FaSave className="text-xs" /> Simpan Perubahan
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors ${i !== sections.length - 1 ? "border-b border-slate-100" : ""
                  } ${activeSection === s.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">{s.icon}</span>
                  {s.label}
                </div>
                <FaChevronRight className="text-[10px] opacity-50" />
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col gap-6">

          {/* === THRESHOLD === */}
          {activeSection === "threshold" && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-1">Batas Suhu</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Sistem akan memicu alert jika suhu di luar rentang ini.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Suhu Minimum (°C)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={18}
                        max={35}
                        value={tempMin}
                        onChange={(e) => setTempMin(Number(e.target.value))}
                        className="range range-xs flex-1 accent-slate-900"
                      />
                      <span className="w-12 text-center bg-slate-100 rounded-lg py-1.5 text-sm font-bold text-slate-700">
                        {tempMin}°
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Suhu Maksimum (°C)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={18}
                        max={40}
                        value={tempMax}
                        onChange={(e) => setTempMax(Number(e.target.value))}
                        className="range range-xs flex-1 accent-slate-900"
                      />
                      <span className="w-12 text-center bg-slate-100 rounded-lg py-1.5 text-sm font-bold text-slate-700">
                        {tempMax}°
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2 text-xs text-amber-700">
                  <FaExclamationTriangle />
                  Alert akan aktif jika suhu &lt; {tempMin}°C atau &gt; {tempMax}°C
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-1">Batas Kelembapan</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Rentang kelembapan ideal untuk lingkungan kandang.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Kelembapan Minimum (%)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={30}
                        max={70}
                        value={humidMin}
                        onChange={(e) => setHumidMin(Number(e.target.value))}
                        className="range range-xs flex-1 accent-blue-600"
                      />
                      <span className="w-12 text-center bg-blue-50 rounded-lg py-1.5 text-sm font-bold text-blue-700">
                        {humidMin}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Kelembapan Maksimum (%)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={50}
                        max={95}
                        value={humidMax}
                        onChange={(e) => setHumidMax(Number(e.target.value))}
                        className="range range-xs flex-1 accent-blue-600"
                      />
                      <span className="w-12 text-center bg-blue-50 rounded-lg py-1.5 text-sm font-bold text-blue-700">
                        {humidMax}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* === NOTIFIKASI === */}
          {activeSection === "notification" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-1">Preferensi Notifikasi</h3>
              <p className="text-xs text-slate-500 mb-6">
                Pilih channel notifikasi yang ingin Anda aktifkan.
              </p>
              <div className="divide-y divide-slate-100">
                {[
                  {
                    label: "Notifikasi Email",
                    desc: "Kirim alert ke alamat email terdaftar",
                    state: notifEmail,
                    set: setNotifEmail,
                  },
                  {
                    label: "Push Notification",
                    desc: "Notifikasi langsung di browser/aplikasi",
                    state: notifPush,
                    set: setNotifPush,
                  },
                  {
                    label: "SMS Alert",
                    desc: "Kirim pesan ke nomor HP yang terdaftar",
                    state: notifSMS,
                    set: setNotifSMS,
                  },
                  {
                    label: "Suara Peringatan",
                    desc: "Putar suara saat alert kritis muncul",
                    state: alertSound,
                    set: setAlertSound,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle enabled={item.state} onChange={item.set} />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Email Tujuan
                </label>
                <input
                  type="email"
                  defaultValue="peternak@email.com"
                  className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                />
              </div>
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Nomor HP (untuk SMS)
                </label>
                <input
                  type="tel"
                  defaultValue="+62 812 xxxx xxxx"
                  className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                />
              </div>
            </div>
          )}

          {/* === KANDANG === */}
          {activeSection === "kandang" && (
            <>
              {/* Modal Tambah Kandang */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800">Tambah Kandang Baru</h3>
                      <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                        <FaTimes />
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Kandang</label>
                        <input
                          type="text"
                          placeholder="contoh: Kandang A1"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kapasitas (ekor)</label>
                        <input
                          type="number"
                          placeholder="contoh: 1000"
                          value={newCapacity}
                          onChange={(e) => setNewCapacity(e.target.value)}
                          className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                        />
                      </div>
                      <button
                        onClick={handleAddDevice}
                        disabled={addLoading || !newName || !newCapacity}
                        className="btn btn-sm bg-slate-900 hover:bg-slate-700 text-white border-none rounded-xl h-10 min-h-0 font-bold disabled:opacity-50"
                      >
                        {addLoading ? "Menyimpan..." : "Simpan & Generate QR"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal QR Code */}
              {qrDevice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800">QR Code — {qrDevice.name}</h3>
                      <button onClick={() => setQrDevice(null)} className="text-slate-400 hover:text-slate-600">
                        <FaTimes />
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      {/* QR Code */}
                      <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl">
                        <QRCodeSVG
                          value={qrDevice.claimCode}
                          size={180}
                          bgColor="#ffffff"
                          fgColor="#0f172a"
                          level="M"
                        />
                      </div>

                      {/* Claim Code */}
                      <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Claim Code</p>
                          <p className="text-lg font-mono font-bold text-slate-900 tracking-widest">
                            {qrDevice.claimCode}
                          </p>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(qrDevice.claimCode)}
                          className="btn btn-ghost btn-xs text-slate-500 hover:text-slate-900"
                          title="Copy kode"
                        >
                          <FaCopy />
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 text-center leading-relaxed">
                        Flash kode ini ke ESP32 Anda. Kode hanya bisa digunakan <span className="font-bold text-slate-600">satu kali</span>.
                      </p>

                      <button
                        onClick={() => setQrDevice(null)}
                        className="btn btn-sm bg-slate-900 hover:bg-slate-700 text-white border-none rounded-xl w-full h-9 min-h-0 font-bold"
                      >
                        Selesai
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Daftar Kandang */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800">Manajemen Kandang</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Kelola daftar kandang dan kapasitasnya.</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-sm bg-slate-900 hover:bg-slate-700 text-white border-none rounded-lg h-9 min-h-0 px-4 flex items-center gap-2 font-bold text-xs"
                  >
                    <FaPlus /> Tambah
                  </button>
                </div>

                {deviceLoading ? (
                  <div className="divide-y divide-slate-100">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between px-6 py-4 animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-slate-100" />
                          <div>
                            <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
                            <div className="h-3 w-32 bg-slate-100 rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : devices.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    Belum ada kandang. Klik "Tambah" untuk mulai.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {devices.map((device) => (
                      <div key={device._id} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                            <FaCog className="text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{device.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-slate-400">
                                Kapasitas: {device.capacity.toLocaleString()} ekor
                              </p>
                              {device.claimed ? (
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                  Terhubung
                                </span>
                              ) : (
                                <button
                                  onClick={() => setQrDevice(device)}
                                  className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full flex items-center gap-1 hover:bg-orange-100"
                                >
                                  <FaQrcode className="text-[8px]" /> Tampilkan QR
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Toggle
                            enabled={device.active}
                            onChange={() => handleToggleDevice(device)}
                          />
                          <button
                            onClick={() => handleDeleteDevice(device._id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* === SISTEM === */}
          {activeSection === "system" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-1">Sistem & Data</h3>
              <p className="text-xs text-slate-500 mb-6">Konfigurasi interval pengambilan data dan retensi log.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Interval Data Sensor
                  </label>
                  <select
                    value={dataInterval}
                    onChange={(e) => setDataInterval(e.target.value)}
                    className="select select-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 h-10 min-h-0 focus:outline-none"
                  >
                    <option value="1">Setiap 1 Menit</option>
                    <option value="5">Setiap 5 Menit</option>
                    <option value="10">Setiap 10 Menit</option>
                    <option value="30">Setiap 30 Menit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Retensi Data Log (Hari)
                  </label>
                  <select
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(e.target.value)}
                    className="select select-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 h-10 min-h-0 focus:outline-none"
                  >
                    <option value="7">7 Hari</option>
                    <option value="14">14 Hari</option>
                    <option value="30">30 Hari</option>
                    <option value="90">90 Hari</option>
                    <option value="365">1 Tahun</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Koneksi MQTT Broker</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Host</label>
                    <input
                      type="text"
                      defaultValue="mqtt.kandang.local"
                      className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Port</label>
                    <input
                      type="number"
                      defaultValue="1883"
                      className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue="admin_sensor"
                      className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                    <input
                      type="password"
                      defaultValue="********"
                      className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Terkoneksi ke broker</span>
                </div>
              </div>
            </div>
          )}

          {/* === AKUN === */}
          {activeSection === "account" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-1">Profil & Keamanan</h3>
              <p className="text-xs text-slate-500 mb-6">Perbarui informasi akun dan ganti kata sandi.</p>

              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-bold">
                  PC
                </div>
                <div>
                  <p className="font-bold text-slate-800">Peternak Cerdas</p>
                  <p className="text-xs text-slate-500">peternak@email.com</p>
                  <span className="badge badge-xs bg-slate-200 text-slate-600 border-none mt-1">Admin</span>
                </div>
                <button className="ml-auto btn btn-xs btn-outline border-slate-300 text-slate-600 rounded-lg h-8 min-h-0 hover:bg-slate-100 hover:border-slate-300 font-bold text-xs">
                  Ubah Foto
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    defaultValue="Peternak Cerdas"
                    className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="peternak@email.com"
                    className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <FaLock className="text-xs" /> Ganti Password
                </h4>
                <div className="flex flex-col gap-4">
                  {["Password Saat Ini", "Password Baru", "Konfirmasi Password Baru"].map((label) => (
                    <div key={label}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{label}</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}