"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  FaHome,
  FaThermometerHalf,
  FaTint,
  FaExclamationTriangle,
  FaBell,
  FaCog,
  FaPlus,
  FaChartLine,
  FaFire,
  FaTimes,
  FaMicrochip,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type KandangStatus = "warning" | "normal" | "kosong";

interface Device {
  _id: string;
  name: string;
  capacity: number;
  active: boolean;
  claimed: boolean;
  createdAt: string;
}

interface SensorLog {
  _time: string;
  kandang_id: string;
  temperature: number;
  humidity: number;
  _measurement: string;
}

interface KandangRow {
  id: string;
  deviceId: string;
  umur: string;
  suhu: number | null;
  kelembapan: number | null;
  status: KandangStatus;
  claimed: boolean;
  capacity: number;
  active: boolean;
  createdAt: string;
}

interface AlertItem {
  id: number;
  icon: React.ReactNode;
  title: string;
  time: string;
  message: string;
  variant: "red" | "blue" | "slate";
}

interface Toast {
  id: string;
  type: "warning" | "info" | "success";
  title: string;
  message: string;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const TEMP_SPIKE_THRESHOLD = 31;

const ALERT_VARIANT_CLASSES: Record<AlertItem["variant"], string> = {
  red: "bg-red-50 border border-red-100",
  blue: "bg-blue-50 border border-blue-100",
  slate: "bg-slate-50 border border-slate-100",
};

const ALERT_TITLE_CLASSES: Record<AlertItem["variant"], string> = {
  red: "text-red-700",
  blue: "text-blue-700",
  slate: "text-slate-700",
};

const STATIC_ALERT_DATA: AlertItem[] = [
  {
    id: 1001,
    icon: <FaBell className="text-blue-500 mt-1 shrink-0" />,
    title: "Pantau Suhu Rutin",
    time: "sekarang",
    message: "Sistem siap. Notifikasi akan muncul saat suhu melewati batas.",
    variant: "blue",
  },
  {
    id: 1002,
    icon: <FaCog className="text-slate-500 mt-1 shrink-0" />,
    title: "Kalibrasi Sensor",
    time: "—",
    message: "Pastikan sensor dikalibrasi secara berkala agar data akurat.",
    variant: "slate",
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function computeAlertHistory(logs: SensorLog[]): AlertItem[] {
  const spikes: AlertItem[] = [];
  for (let i = logs.length - 1; i >= 0; i--) {
    const log = logs[i];
    if (log.temperature > TEMP_SPIKE_THRESHOLD) {
      const date = new Date(log._time);
      const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
      const diffHr = Math.floor(diffMin / 60);
      const timeLabel =
        diffMin < 1 ? "baru saja"
        : diffMin < 60 ? `${diffMin}m lalu`
        : diffHr < 24 ? `${diffHr}j lalu`
        : `${Math.floor(diffHr / 24)}h lalu`;

      spikes.push({
        id: i,
        icon: <FaFire className="text-red-500 mt-1 shrink-0" />,
        title: "Suhu Tinggi",
        time: timeLabel,
        message: `Kandang mencapai ${log.temperature.toFixed(1)}°C jam ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}.`,
        variant: "red",
      });
      if (spikes.length >= 5) break;
    }
  }
  return spikes;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Full-page empty state */
function EmptyState({ type, onAction }: { type: "no-device" | "no-data"; onAction?: () => void }) {
  const config = {
    "no-device": {
      icon: <FaHome className="text-5xl text-slate-300" />,
      title: "Belum Ada Kandang",
      desc: "Tambahkan kandang pertama Anda untuk mulai monitoring suhu dan kelembapan.",
      action: "Tambah Kandang",
    },
    "no-data": {
      icon: <FaThermometerHalf className="text-5xl text-slate-300" />,
      title: "Belum Ada Data Sensor",
      desc: "Data akan muncul di sini setelah sensor mengirimkan pembacaan pertama.",
      action: null,
    },
  };
  const { icon, title, desc, action } = config[type];
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="bg-slate-50 p-8 rounded-3xl mb-6 shadow-inner">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{desc}</p>
      {action && onAction && (
        <button onClick={onAction} className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white rounded-lg px-6">
          <FaPlus className="mr-2" />{action}
        </button>
      )}
    </div>
  );
}

/** Stat card skeleton */
function StatCardSkeleton() {
  return (
    <div className="stat bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
      <div className="h-8 w-8 bg-slate-100 rounded-lg mb-3" />
      <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
      <div className="h-8 w-16 bg-slate-100 rounded mb-2" />
      <div className="h-3 w-28 bg-slate-100 rounded" />
    </div>
  );
}

/** Stat card */
function StatCard({ icon, iconBg, title, value, unit, desc, descColor = "text-slate-400" }: {
  icon: React.ReactNode; iconBg: string; title: string;
  value: string | number; unit?: string; desc: string; descColor?: string;
}) {
  return (
    <div className="stat bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="stat-figure"><div className={`p-3 ${iconBg} rounded-lg`}>{icon}</div></div>
      <div className="stat-title text-xs font-bold uppercase text-slate-500">{title}</div>
      <div className="stat-value text-3xl text-slate-900 mt-2">
        {value}{unit && <span className="text-lg text-slate-500 font-normal">{unit}</span>}
      </div>
      <div className={`stat-desc text-xs font-medium mt-1 ${descColor}`}>{desc}</div>
    </div>
  );
}

/** Alert card */
function AlertCard({ item }: { item: AlertItem }) {
  return (
    <div className={`p-4 rounded-xl ${ALERT_VARIANT_CLASSES[item.variant]} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-start gap-3">
        {item.icon}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className={`text-xs font-bold ${ALERT_TITLE_CLASSES[item.variant]}`}>{item.title}</h4>
            <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
        </div>
      </div>
    </div>
  );
}

/** Status badge */
function StatusBadge({ status }: { status: KandangStatus }) {
  const config = { warning: "bg-orange-100 text-orange-700", normal: "bg-green-100 text-green-700", kosong: "bg-slate-100 text-slate-500" };
  const label = { warning: "Warning", normal: "Normal", kosong: "Kosong" };
  return <div className={`badge badge-sm border-none gap-1 text-[10px] px-2 py-3 ${config[status]}`}>{label[status]}</div>;
}

/** Chart skeleton */
function ChartSkeleton() {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-48 bg-slate-100 rounded" />
        <div className="h-8 w-32 bg-slate-100 rounded-full" />
      </div>
      <div className="h-64 bg-slate-50 rounded-lg" />
    </div>
  );
}

/** Alert list skeleton */
function AlertListSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
      <div className="h-6 w-32 bg-slate-100 rounded mb-6" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 mb-4">
          <div className="w-8 h-8 bg-slate-100 rounded-lg shrink-0" />
          <div className="flex-1">
            <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
            <div className="h-3 w-full bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Table skeleton */
function KandangTableSkeleton() {
  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 border-b border-slate-100 flex justify-between">
        <div className="h-6 w-32 bg-slate-100 rounded" />
        <div className="h-9 w-32 bg-slate-100 rounded-lg" />
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-slate-50"><tr>{Array.from({ length: 6 }).map((_, i) => <th key={i} className="p-4"><div className="h-3 w-16 bg-slate-100 rounded" /></th>)}</tr></thead>
          <tbody>{[1, 2, 3].map((i) => <tr key={i} className="border-b border-slate-50">{Array.from({ length: 6 }).map((_, j) => <td key={j} className="p-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

/** Mobile card view per kandang */
function KandangCard({ data }: { data: KandangRow }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-slate-900">{data.id}</h4>
          <p className="text-xs text-slate-500">Umur: {data.umur}</p>
        </div>
        <StatusBadge status={data.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <FaThermometerHalf className="text-red-500" />
          <span className={data.suhu !== null ? (data.status === "warning" ? "text-red-600 font-semibold" : "text-green-600 font-semibold") : "text-slate-400"}>
            {data.suhu !== null ? data.suhu.toFixed(1) : "--"}°C
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaTint className="text-blue-500" />
          <span className="text-slate-700">{data.kelembapan ?? "--"}%</span>
        </div>
      </div>
      <button className="btn btn-ghost btn-xs w-full mt-3 text-primary font-bold hover:bg-primary/10">Detail</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// TAMBAH KANDANG MODAL
// ─────────────────────────────────────────────
function TambahKandangModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"info" | "confirm">("info");
  const [deviceCode, setDeviceCode] = useState("");
  const [kandangName, setKandangName] = useState("");

  // Reset when closed
  useEffect(() => {
    if (!open) { setStep("info"); setDeviceCode(""); setKandangName(""); }
  }, [open]);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-3xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 64px -12px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)" }}
      >
        {/* Coloured top strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-400" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-xl">
              <FaMicrochip className="text-slate-600 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tambah Kandang</h2>
              <p className="text-xs text-slate-500 mt-0.5">Hubungkan perangkat sensor baru</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-6" />

        {/* Info card inside modal */}
        <div className="mx-6 mt-5 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
          <FaInfoCircle className="text-blue-400 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-700 leading-relaxed">
            <span className="font-bold block mb-1">Cara menghubungkan sensor</span>
            Nyalakan perangkat IoT → tunggu LED berkedip biru → masukkan kode unik di bawah.
            Kode tercetak di stiker bawah perangkat.
          </div>
        </div>

        {step === "info" && (
          <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
            {/* Kandang name input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Kandang</label>
              <input
                type="text"
                placeholder="mis. Kandang A3"
                value={kandangName}
                onChange={(e) => setKandangName(e.target.value)}
                className="input input-bordered w-full bg-white border-slate-200 focus:border-slate-400 rounded-xl text-sm"
              />
            </div>

            {/* Device code input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Kode Perangkat</label>
              <input
                type="text"
                placeholder="mis. TRK-XXXX-YYYY"
                value={deviceCode}
                onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
                className="input input-bordered w-full bg-white border-slate-200 focus:border-slate-400 rounded-xl text-sm font-mono tracking-widest"
              />
            </div>

            {/* Shadow info card — detail perangkat */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-2 shadow-sm">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Info Perangkat</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
                <div><span className="text-slate-400">Tipe</span><br /><span className="font-semibold text-slate-800">TempHumid v2</span></div>
                <div><span className="text-slate-400">Protokol</span><br /><span className="font-semibold text-slate-800">MQTT/WiFi</span></div>
                <div><span className="text-slate-400">Presisi Suhu</span><br /><span className="font-semibold text-slate-800">±0.5 °C</span></div>
                <div><span className="text-slate-400">Presisi RH</span><br /><span className="font-semibold text-slate-800">±3 %</span></div>
              </div>
            </div>

            <button
              disabled={!deviceCode.trim() || !kandangName.trim()}
              onClick={() => setStep("confirm")}
              className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl w-full mt-1 disabled:opacity-40"
            >
              Lanjutkan
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
            {/* Summary card */}
            <div
              className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-3"
              style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.12)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <FaCheckCircle className="text-green-500" />
                <span className="text-sm font-bold text-slate-800">Konfirmasi Pendaftaran</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div><span className="text-slate-400 block">Nama Kandang</span><span className="font-bold text-slate-900">{kandangName}</span></div>
                <div><span className="text-slate-400 block">Kode Perangkat</span><span className="font-bold text-slate-900 font-mono">{deviceCode}</span></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("info")} className="btn btn-outline border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl flex-1">
                Kembali
              </button>
              <button
                onClick={() => {
                  // TODO: POST /api/devices { name: kandangName, code: deviceCode }
                  onClose();
                }}
                className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl flex-1"
              >
                Daftarkan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Kandang table:
 * - Desktop: full table
 * - Mobile: card grid
 */
function KandangTable({ data, onAdd }: { data: KandangRow[]; onAdd?: () => void }) {
  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-800">Status Kandang</h3>
          <p className="text-xs text-slate-400 mt-0.5">Data real-time semua perangkat terdaftar</p>
        </div>
        <button
          onClick={onAdd}
          className="btn btn-sm btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white rounded-lg h-9 min-h-0 px-4 shadow-md shadow-slate-900/20"
        >
          <FaPlus className="mr-1" /> Tambah Kandang
        </button>
      </div>

      {data.length === 0 && (
        <div className="py-12 px-6 flex flex-col items-center text-center text-slate-400">
          <FaHome className="text-4xl mb-4 text-slate-200" />
          <p className="text-sm">Tidak ada kandang terdaftar.</p>
        </div>
      )}

      {data.length > 0 && (
        <>
          {/* Mobile card grid */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {data.map((row) => <KandangCard key={row.deviceId} data={row} />)}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th>Nama Kandang</th>
                  <th>Umur Ayam</th>
                  <th>Suhu (°C)</th>
                  <th>Kelembapan (%)</th>
                  <th>Status</th>
                  <th>Aktif</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                {data.map((row) => (
                  <tr key={row.deviceId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="font-bold text-slate-900">{row.id}</td>
                    <td>{row.umur}</td>
                    <td className={row.suhu !== null ? (row.status === "warning" ? "text-red-600 font-semibold" : "text-green-600 font-semibold") : "text-slate-400 font-medium"}>
                      {row.suhu !== null ? row.suhu.toFixed(1) : "--"}
                    </td>
                    <td>{row.kelembapan !== null ? `${row.kelembapan.toFixed(0)}` : "-"}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${row.active ? "text-green-600" : "text-slate-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.active ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
                        {row.active ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CHART OPTIONS
// ─────────────────────────────────────────────
const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top", align: "end", labels: { boxWidth: 10, usePointStyle: true } },
    tooltip: { backgroundColor: "rgba(15, 23, 42, 0.9)", padding: 10, cornerRadius: 8 },
  },
  scales: {
    y: { grid: { color: "#f1f5f9" }, border: { display: false }, ticks: { color: "#64748b", font: { size: 11 } }, beginAtZero: false },
    x: { grid: { display: false }, border: { display: false }, ticks: { color: "#64748b", font: { size: 11 } } },
  },
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // logs for SELECTED device (used for chart & alerts)
  const [logs, setLogs] = useState<SensorLog[]>([]);
  // logs for ALL devices (used for the table)
  const [allLogs, setAllLogs] = useState<SensorLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const chartData = useMemo<ChartData<"line">>(() => ({
    labels: logs.map((l) => new Date(l._time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })),
    datasets: [
      {
        label: "Suhu (°C)",
        data: logs.map((l) => l.temperature),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        tension: 0.4, fill: true, pointRadius: 2, pointHoverRadius: 5,
      },
      {
        label: "Kelembapan (%)",
        data: logs.map((l) => l.humidity),
        borderColor: "#3b82f6", borderDash: [5, 5],
        backgroundColor: "transparent",
        tension: 0.4, fill: false, pointRadius: 0, pointHoverRadius: 4,
      },
    ],
  }), [logs]);

  const gradientPlugin = useMemo(() => ({
    id: "customGradient",
    afterLayout(chart: ChartJS) {
      const dataset = chart.data.datasets[0] as ChartData<"line">["datasets"][0] & { backgroundColor: unknown };
      const ctx = chart.ctx;
      const { top, bottom } = chart.chartArea ?? {};
      if (!ctx || top == null) return;
      const gradient = ctx.createLinearGradient(0, top, 0, bottom);
      gradient.addColorStop(0, "rgba(239, 68, 68, 0.4)");
      gradient.addColorStop(1, "rgba(239, 68, 68, 0)");
      dataset.backgroundColor = gradient;
    },
  }), []);

  // Fetch devices (poll every 10s)
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("/api/devices");
        const data: Device[] = await res.json();
        setDevices(data);
        if (!selectedDeviceId) {
          const firstActive = data.find((d) => d.claimed);
          if (firstActive) setSelectedDeviceId(firstActive._id);
        }
      } catch (err) {
        console.error("Gagal fetch devices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, [selectedDeviceId]);

  // Poll selected-device logs for chart & alerts (5s)
  useEffect(() => {
    if (!selectedDeviceId) return;
    let firstFetch = true;
    const fetchLogs = async () => {
      if (firstFetch) { setLoadingLogs(true); firstFetch = false; }
      try {
        const res = await fetch(`/api/sensor/data?deviceId=${selectedDeviceId}&limit=50&t=${Date.now()}`);
        const data: SensorLog[] = await res.json();
        setLogs(data.reverse());
      } catch (err) {
        console.error("Gagal fetch logs:", err);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [selectedDeviceId]);

  // Poll ALL-devices logs for the table (10s)
  useEffect(() => {
    if (devices.length === 0) return;
    const fetchAllLogs = async () => {
      try {
        // Fetch latest log per device concurrently
        const results = await Promise.all(
          devices.map((d) =>
            fetch(`/api/sensor/data?deviceId=${d._id}&limit=1&t=${Date.now()}`)
              .then((r) => r.json() as Promise<SensorLog[]>)
              .catch(() => [] as SensorLog[])
          )
        );
        setAllLogs(results.flat());
      } catch (err) {
        console.error("Gagal fetch all logs:", err);
      }
    };
    fetchAllLogs();
    const interval = setInterval(fetchAllLogs, 10000);
    return () => clearInterval(interval);
  }, [devices]);

  const userName = "Peternak Cerdas";
  const latestLog = logs[logs.length - 1] ?? null;
  const avgTemp = latestLog?.temperature ?? null;
  const avgHumid = latestLog?.humidity ?? null;
  const totalActive = devices.filter((d) => d.active).length;
  const totalStandby = devices.filter((d) => !d.active).length;

  const alertHistory = useMemo(() => {
    const spikes = computeAlertHistory(logs);
    return spikes.length > 0 ? spikes : STATIC_ALERT_DATA;
  }, [logs]);

  // Table rows: ALL devices × their own latest log from allLogs
  const kandangRows: KandangRow[] = devices.map((d) => {
    const lastLog = allLogs.findLast((l) => String(l.kandang_id) === String(d._id)) ?? null;
    const suhu = lastLog?.temperature ?? null;
    const status: KandangStatus = !d.claimed
      ? "kosong"
      : suhu !== null && suhu > TEMP_SPIKE_THRESHOLD
      ? "warning"
      : "normal";
    return {
      id: d.name,
      deviceId: d._id,
      umur: "-",
      suhu,
      kelembapan: lastLog?.humidity ?? null,
      status,
      claimed: d.claimed,
      capacity: d.capacity,
      active: d.active,
      createdAt: d.createdAt,
    };
  });

  // Full empty state when no devices
  if (!loading && devices.length === 0) {
    return (
      <div className="max-w-7xl mx-auto w-full">
        <TambahKandangModal open={showModal} onClose={() => setShowModal(false)} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Halo, {userName}!</h2>
            <p className="text-slate-500 text-sm mt-1">Mulai dengan menambahkan kandang pertama.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <EmptyState type="no-device" onAction={() => setShowModal(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <TambahKandangModal open={showModal} onClose={() => setShowModal(false)} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Halo, {userName}!</h2>
          <p className="text-slate-500 text-sm mt-1">
            Memantau {devices.find((d) => d._id === selectedDeviceId)?.name || "Kandang"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="form-control w-full max-w-xs">
            <select
              className="select select-bordered bg-white border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              value={selectedDeviceId || ""}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
            >
              <option value="" disabled>Pilih Kandang...</option>
              {devices.filter((d) => d.claimed).map((device) => (
                <option key={device._id} value={device._id}>{device.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
        ) : (
          <>
            <StatCard icon={<FaHome className="text-xl text-slate-400" />} iconBg="bg-slate-100" title="Total Kandang" value={devices.length} desc={`${totalActive} Aktif, ${totalStandby} Standby`} />
            <StatCard icon={<FaThermometerHalf className="text-xl text-red-500" />} iconBg="bg-red-50" title="Suhu Terkini" value={avgTemp !== null ? avgTemp.toFixed(1) : "--"} unit="°C" desc={avgTemp !== null ? (avgTemp > 31 ? "⚠ Di atas normal" : "▲ Normal") : "Belum ada data"} descColor={avgTemp !== null && avgTemp > 31 ? "text-red-500" : "text-green-500"} />
            <StatCard icon={<FaTint className="text-xl text-blue-500" />} iconBg="bg-blue-50" title="Kelembapan" value={avgHumid !== null ? avgHumid.toFixed(0) : "--"} unit="%" desc="Rentang Ideal 60-70%" />
            <StatCard icon={<FaExclamationTriangle className="text-xl text-orange-500" />} iconBg="bg-orange-50" title="Device Aktif" value={totalActive} desc={`${devices.filter((d) => d.claimed).length} terhubung`} />
          </>
        )}
      </div>

      {/* CHART & ALERTS */}
      {loadingLogs ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ChartSkeleton />
          <AlertListSkeleton />
        </div>
      ) : logs.length === 0 && !loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <EmptyState type="no-data" />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4">Riwayat Peringatan</h3>
            <div className="flex flex-col gap-3 flex-1">
              {STATIC_ALERT_DATA.map((item) => <AlertCard key={item.id} item={item} />)}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Monitoring 24 Jam Terakhir</h3>
              <select className="select select-bordered select-xs rounded-full w-32 bg-slate-50 border-slate-200 text-slate-600 focus:outline-none">
                <option>Hari Ini</option>
                <option>Kemarin</option>
                <option>7 Hari</option>
              </select>
            </div>
            <div className="relative h-64 w-full">
              <Line data={chartData} options={chartOptions} plugins={[gradientPlugin]} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Riwayat Peringatan</h3>
              {alertHistory !== STATIC_ALERT_DATA && (
                <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                  {alertHistory.length} spike
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-72 pr-1">
              {alertHistory.map((item) => <AlertCard key={item.id} item={item} />)}
            </div>
            <button className="btn btn-sm btn-outline w-full mt-4 text-xs font-bold border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-300">
              Lihat Semua Log
            </button>
          </div>
        </div>
      )}

      {/* KANDANG TABLE — shows ALL devices */}
      {loadingLogs ? (
        <KandangTableSkeleton />
      ) : (
        <KandangTable
          data={kandangRows}
          onAdd={() => setShowModal(true)}
        />
      )}

    </div>
  );
}