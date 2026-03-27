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
  FaFire,
  FaTimes,
  FaMicrochip,
  FaCheckCircle,
  FaInfoCircle,
  FaServer,
  FaChartArea,
  FaSyncAlt,
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

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

const ALERT_LEFT_BAR: Record<AlertItem["variant"], string> = {
  red: "border-l-red-400",
  blue: "border-l-blue-400",
  slate: "border-l-slate-300",
};

const ALERT_TITLE_CLASSES: Record<AlertItem["variant"], string> = {
  red: "text-red-600",
  blue: "text-blue-600",
  slate: "text-slate-600",
};

const STATIC_ALERT_DATA: AlertItem[] = [
  {
    id: 1001,
    icon: <FaBell className="text-blue-400 shrink-0" />,
    title: "Pantau Suhu Rutin",
    time: "sekarang",
    message: "Sistem aktif. Notifikasi muncul saat suhu melewati batas.",
    variant: "blue",
  },
  {
    id: 1002,
    icon: <FaCog className="text-slate-400 shrink-0" />,
    title: "Kalibrasi Sensor",
    time: "—",
    message: "Pastikan sensor dikalibrasi berkala agar pembacaan akurat.",
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
        icon: <FaFire className="text-red-400 shrink-0" />,
        title: "Suhu Tinggi",
        time: timeLabel,
        message: `Mencapai ${log.temperature.toFixed(1)}°C pukul ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}.`,
        variant: "red",
      });
      if (spikes.length >= 5) break;
    }
  }
  return spikes;
}

// ─────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-1">
      <h3 className="font-semibold text-slate-800 text-sm">{children}</h3>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function PanelHeader({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      {children}
      {action}
    </div>
  );
}

function StatusBadge({ status }: { status: KandangStatus }) {
  const cls = { warning: "bg-orange-100 text-orange-700", normal: "bg-emerald-100 text-emerald-700", kosong: "bg-slate-100 text-slate-500" };
  const lbl = { warning: "Warning", normal: "Normal", kosong: "Kosong" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${cls[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "warning" ? "bg-orange-400 animate-pulse" : status === "normal" ? "bg-emerald-400" : "bg-slate-300"}`} />
      {lbl[status]}
    </span>
  );
}

/** Compact metric card for stat grid */
function MetricCard({ accent, label, value, unit, sub, subColor = "text-slate-400" }: {
  accent: string; label: string; value: string | number;
  unit?: string; sub?: string; subColor?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 relative overflow-hidden hover:shadow-md transition-shadow`}>
      {/* Left accent bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${accent}`} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 pl-3">{label}</p>
      <div className="pl-3 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900 leading-none">{value}</span>
        {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
      </div>
      {sub && <p className={`pl-3 text-[11px] mt-1.5 font-medium ${subColor}`}>{sub}</p>}
    </div>
  );
}

/** Shimmer skeleton */
function Shimmer({ className }: { className?: string }) {
  return <div className={`bg-slate-100 animate-pulse rounded-lg ${className ?? ""}`} />;
}

function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <Shimmer className="h-2.5 w-20 mb-3" />
      <Shimmer className="h-7 w-16 mb-2" />
      <Shimmer className="h-2.5 w-28" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="h-7 w-24 rounded-full" />
      </div>
      <div className="p-5"><Shimmer className="h-56 w-full" /></div>
    </div>
  );
}

function AlertListSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Shimmer className="h-4 w-32" />
      </div>
      <div className="p-4 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 items-start p-3 rounded-xl border-l-4 border-l-slate-100 bg-slate-50">
            <Shimmer className="h-4 w-4 rounded-full mt-0.5 shrink-0" />
            <div className="flex-1"><Shimmer className="h-3 w-24 mb-2" /><Shimmer className="h-3 w-full" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KandangTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-8 w-32 rounded-lg" />
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead><tr>{Array.from({ length: 7 }).map((_, i) => <th key={i}><Shimmer className="h-3 w-16" /></th>)}</tr></thead>
          <tbody>{[1, 2, 3].map((i) => <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j}><Shimmer className="h-4 w-20" /></td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

/** Mobile kandang card */
function KandangCard({ data, onSelect }: { data: KandangRow; onSelect: () => void }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 ${data.status === "warning" ? "border-orange-200" : "border-slate-100"}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{data.id}</h4>
          <p className="text-[11px] text-slate-400">Umur: {data.umur}</p>
        </div>
        <StatusBadge status={data.status} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2">
          <FaThermometerHalf className="text-red-400 text-sm" />
          <div>
            <p className="text-[10px] text-slate-400">Suhu</p>
            <p className={`text-sm font-bold ${data.suhu !== null ? (data.status === "warning" ? "text-red-600" : "text-emerald-600") : "text-slate-400"}`}>
              {data.suhu !== null ? `${data.suhu.toFixed(1)}°C` : "--"}
            </p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2">
          <FaTint className="text-blue-400 text-sm" />
          <div>
            <p className="text-[10px] text-slate-400">Kelembapan</p>
            <p className="text-sm font-bold text-slate-700">{data.kelembapan !== null ? `${data.kelembapan.toFixed(0)}%` : "--"}</p>
          </div>
        </div>
      </div>
      <button onClick={onSelect} className="btn btn-ghost btn-xs w-full mt-3 text-xs font-semibold text-primary hover:bg-primary/10">Lihat Informasi →</button>
    </div>
  );
}

/** Alert feed item */
function AlertCard({ item }: { item: AlertItem }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl bg-slate-50 border-l-4 ${ALERT_LEFT_BAR[item.variant]} hover:bg-slate-100 transition-colors`}>
      <div className="mt-0.5">{item.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className={`text-xs font-bold ${ALERT_TITLE_CLASSES[item.variant]}`}>{item.title}</span>
          <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">{item.message}</p>
      </div>
    </div>
  );
}

/** Empty state */
function EmptyState({ type, onAction }: { type: "no-device" | "no-data"; onAction?: () => void }) {
  const cfg = {
    "no-device": { icon: <FaServer className="text-4xl text-slate-200" />, title: "Belum Ada Kandang", desc: "Tambahkan kandang pertama Anda untuk mulai monitoring suhu dan kelembapan.", action: "Tambah Kandang" },
    "no-data": { icon: <FaChartArea className="text-4xl text-slate-200" />, title: "Menunggu Data Sensor", desc: "Data akan muncul secara otomatis setelah sensor mengirimkan pembacaan pertama.", action: null },
  }[type];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">{cfg.icon}</div>
      <h3 className="text-base font-bold text-slate-700 mb-2">{cfg.title}</h3>
      <p className="text-xs text-slate-400 max-w-xs mb-5">{cfg.desc}</p>
      {cfg.action && onAction && (
        <button onClick={onAction} className="btn btn-sm bg-slate-900 hover:bg-slate-700 border-none text-white rounded-xl px-5">
          <FaPlus className="mr-1.5" />{cfg.action}
        </button>
      )}
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

  useEffect(() => {
    if (!open) { setStep("info"); setDeviceCode(""); setKandangName(""); }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 64px -12px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)" }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-400" />
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-xl"><FaMicrochip className="text-slate-600 text-xl" /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tambah Kandang</h2>
              <p className="text-xs text-slate-400 mt-0.5">Hubungkan perangkat sensor baru</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><FaTimes /></button>
        </div>
        <div className="h-px bg-slate-100 mx-6" />
        <div className="mx-6 mt-5 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
          <FaInfoCircle className="text-blue-400 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-700 leading-relaxed">
            <span className="font-bold block mb-1">Cara menghubungkan sensor</span>
            Nyalakan perangkat IoT → tunggu LED berkedip biru → masukkan kode unik di bawah. Kode tercetak di stiker bawah perangkat.
          </div>
        </div>

        {step === "info" && (
          <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Kandang</label>
              <input type="text" placeholder="mis. Kandang A3" value={kandangName} onChange={(e) => setKandangName(e.target.value)}
                className="input input-bordered w-full bg-white border-slate-200 focus:border-slate-400 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Kode Perangkat</label>
              <input type="text" placeholder="mis. TRK-XXXX-YYYY" value={deviceCode} onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
                className="input input-bordered w-full bg-white border-slate-200 focus:border-slate-400 rounded-xl text-sm font-mono tracking-widest" />
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-2 shadow-sm">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Info Perangkat</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
                <div><span className="text-slate-400">Tipe</span><br /><span className="font-semibold text-slate-800">TempHumid v2</span></div>
                <div><span className="text-slate-400">Protokol</span><br /><span className="font-semibold text-slate-800">MQTT/WiFi</span></div>
                <div><span className="text-slate-400">Presisi Suhu</span><br /><span className="font-semibold text-slate-800">±0.5 °C</span></div>
                <div><span className="text-slate-400">Presisi RH</span><br /><span className="font-semibold text-slate-800">±3 %</span></div>
              </div>
            </div>
            <button disabled={!deviceCode.trim() || !kandangName.trim()} onClick={() => setStep("confirm")}
              className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl w-full mt-1 disabled:opacity-40">
              Lanjutkan
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-3" style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.12)" }}>
              <div className="flex items-center gap-2 mb-1"><FaCheckCircle className="text-green-500" /><span className="text-sm font-bold text-slate-800">Konfirmasi Pendaftaran</span></div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div><span className="text-slate-400 block">Nama Kandang</span><span className="font-bold text-slate-900">{kandangName}</span></div>
                <div><span className="text-slate-400 block">Kode Perangkat</span><span className="font-bold text-slate-900 font-mono">{deviceCode}</span></div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("info")} className="btn btn-outline border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl flex-1">Kembali</button>
              <button onClick={() => { onClose(); }} className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl flex-1">Daftarkan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// KANDANG TABLE
// ─────────────────────────────────────────────
function KandangTable({ data, selectedId, onSelectDevice }: { data: KandangRow[]; selectedId: string | null; onSelectDevice: (id: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PanelHeader>
        <SectionTitle sub="Data real-time semua perangkat">Status Kandang</SectionTitle>
      </PanelHeader>

      {data.length === 0 && (
        <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
          <FaServer className="text-3xl text-slate-200" />
          <p className="text-xs">Tidak ada kandang terdaftar.</p>
        </div>
      )}

      {data.length > 0 && (
        <>
          {/* Mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {data.map((row) => <KandangCard key={row.deviceId} data={row} onSelect={() => onSelectDevice(row.deviceId)} />)}
          </div>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="pl-5">Kandang</th>
                  <th>Umur</th>
                  <th>Suhu</th>
                  <th>RH</th>
                  <th>Status</th>
                  <th>Koneksi</th>
                  <th className="pr-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((row) => {
                  const isSelected = row.deviceId === selectedId;
                  return (
                  <tr key={row.deviceId} className={`transition-colors hover:bg-slate-50/60 ${row.status === "warning" ? "bg-orange-50/30" : isSelected ? "bg-blue-50/40" : ""}`}>
                    <td className="pl-5 font-semibold text-slate-900 py-3">{row.id}</td>
                    <td className="text-slate-500">{row.umur}</td>
                    <td className={`font-bold tabular-nums ${row.suhu !== null ? (row.status === "warning" ? "text-red-600" : "text-emerald-600") : "text-slate-400"}`}>
                      {row.suhu !== null ? `${row.suhu.toFixed(1)} °C` : "—"}
                    </td>
                    <td className="text-slate-600 tabular-nums">{row.kelembapan !== null ? `${row.kelembapan.toFixed(0)} %` : "—"}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${row.active ? "text-emerald-600" : "text-slate-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.active ? "bg-emerald-400 animate-pulse" : "bg-slate-300"}`} />
                        {row.active ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="pr-5 text-right">
                      {isSelected ? (
                        <span className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded-lg">Dipantau</span>
                      ) : (
                        <button onClick={() => onSelectDevice(row.deviceId)} className="btn btn-ghost btn-xs text-xs text-primary font-semibold hover:bg-primary/10">Lihat Grafik →</button>
                      )}
                    </td>
                  </tr>
                )})}
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
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { position: "top", align: "end", labels: { boxWidth: 8, usePointStyle: true, pointStyle: "circle", font: { size: 11 } } },
    tooltip: { backgroundColor: "rgba(15,23,42,0.92)", padding: 12, cornerRadius: 10, titleFont: { size: 12 }, bodyFont: { size: 11 } },
  },
  scales: {
    y: { grid: { color: "#f8fafc" }, border: { display: false }, ticks: { color: "#94a3b8", font: { size: 11 } }, beginAtZero: false },
    x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94a3b8", font: { size: 11 }, maxTicksLimit: 8 } },
  },
};

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [logs, setLogs] = useState<SensorLog[]>([]);
  const [allLogs, setAllLogs] = useState<SensorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const chartData = useMemo<ChartData<"line">>(() => ({
    labels: logs.map((l) => new Date(l._time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })),
    datasets: [
      {
        label: "Suhu (°C)",
        data: logs.map((l) => l.temperature),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.12)",
        tension: 0.4, fill: true, pointRadius: 2, pointHoverRadius: 6, borderWidth: 2,
      },
      {
        label: "Kelembapan (%)",
        data: logs.map((l) => l.humidity),
        borderColor: "#3b82f6",
        borderDash: [4, 4],
        backgroundColor: "transparent",
        tension: 0.4, fill: false, pointRadius: 0, pointHoverRadius: 5, borderWidth: 1.5,
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
      gradient.addColorStop(0, "rgba(239,68,68,0.35)");
      gradient.addColorStop(1, "rgba(239,68,68,0)");
      dataset.backgroundColor = gradient;
    },
  }), []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("/api/devices");
        const data: Device[] = await res.json();
        setDevices(data);
        if (!selectedDeviceId) {
          const first = data.find((d) => d.claimed);
          if (first) setSelectedDeviceId(first._id);
        }
      } catch (err) {
        console.error("Gagal fetch devices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
    const iv = setInterval(fetchDevices, 10000);
    return () => clearInterval(iv);
  }, [selectedDeviceId]);

  useEffect(() => {
    if (!selectedDeviceId) return;
    let first = true;
    const fetch_ = async () => {
      if (first) { setLoadingLogs(true); first = false; }
      try {
        const res = await fetch(`/api/sensor/data?deviceId=${selectedDeviceId}&limit=50&t=${Date.now()}`);
        const data: SensorLog[] = await res.json();
        setLogs(data.reverse());
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Gagal fetch logs:", err);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetch_();
    const iv = setInterval(fetch_, 5000);
    return () => clearInterval(iv);
  }, [selectedDeviceId]);

  useEffect(() => {
    if (devices.length === 0) return;
    const fetchAll = async () => {
      try {
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
    fetchAll();
    const iv = setInterval(fetchAll, 10000);
    return () => clearInterval(iv);
  }, [devices]);

  const userName = "Peternak Cerdas";
  const latest = logs[logs.length - 1] ?? null;
  const avgTemp = latest?.temperature ?? null;
  const avgHumid = latest?.humidity ?? null;
  const totalActive = devices.filter((d) => d.active).length;
  const totalStandby = devices.filter((d) => !d.active).length;
  const totalWarning = devices.filter((d) => {
    const l = allLogs.findLast((x) => String(x.kandang_id) === String(d._id));
    return l && l.temperature > TEMP_SPIKE_THRESHOLD;
  }).length;

  const alertHistory = useMemo(() => {
    const spikes = computeAlertHistory(logs);
    return spikes.length > 0 ? spikes : STATIC_ALERT_DATA;
  }, [logs]);

  const kandangRows: KandangRow[] = devices.map((d) => {
    const lastLog = allLogs.findLast((l) => String(l.kandang_id) === String(d._id)) ?? null;
    const suhu = lastLog?.temperature ?? null;
    const status: KandangStatus = !d.claimed ? "kosong" : suhu !== null && suhu > TEMP_SPIKE_THRESHOLD ? "warning" : "normal";
    return { id: d.name, deviceId: d._id, umur: "-", suhu, kelembapan: lastLog?.humidity ?? null, status, claimed: d.claimed, capacity: d.capacity, active: d.active, createdAt: d.createdAt };
  });

  // ── No devices ──
  if (!loading && devices.length === 0) {
    return (
      <div className="max-w-7xl mx-auto w-full" suppressHydrationWarning>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900">Selamat datang, {userName}</h2>
          <p className="text-sm text-slate-400 mt-1">Belum ada kandang yang terdaftar.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <EmptyState type="no-device" />
        </div>
      </div>
    );
  }

  const selectedDevice = devices.find((d) => d._id === selectedDeviceId);

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6" suppressHydrationWarning>

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Halo, {userName} 👋</h2>
          <div className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
            <FaSyncAlt className="text-[10px]" />
            {lastUpdated
              ? `Diperbarui ${lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : "Menghubungkan…"}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status pill */}
          {totalWarning > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              {totalWarning} Peringatan
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Semua Normal
            </span>
          )}
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <><MetricCardSkeleton /><MetricCardSkeleton /><MetricCardSkeleton /><MetricCardSkeleton /></>
        ) : (
          <>
            <MetricCard accent="bg-slate-300" label="Total Kandang" value={devices.length} sub={`${totalActive} aktif · ${totalStandby} standby`} />
            <MetricCard
              accent={avgTemp !== null && avgTemp > 31 ? "bg-red-400" : "bg-emerald-400"}
              label="Suhu Terkini"
              value={avgTemp !== null ? avgTemp.toFixed(1) : "—"}
              unit="°C"
              sub={avgTemp !== null ? (avgTemp > 31 ? "⚠ Di atas normal" : "✓ Normal") : "Menunggu data"}
              subColor={avgTemp !== null && avgTemp > 31 ? "text-red-500" : "text-emerald-500"}
            />
            <MetricCard accent="bg-blue-400" label="Kelembapan" value={avgHumid !== null ? avgHumid.toFixed(0) : "—"} unit="%" sub="Ideal: 60 – 70 %" />
            <MetricCard
              accent={totalWarning > 0 ? "bg-orange-400" : "bg-slate-300"}
              label="Peringatan Aktif"
              value={totalWarning}
              sub={totalWarning > 0 ? "Cek kandang segera" : "Tidak ada masalah"}
              subColor={totalWarning > 0 ? "text-orange-500" : "text-slate-400"}
            />
          </>
        )}
      </div>

      {/* ── CHART + ALERTS (3-col: chart 2, alerts 1) ── */}
      {loadingLogs ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ChartSkeleton />
          <AlertListSkeleton />
        </div>
      ) : logs.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <EmptyState type="no-data" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <PanelHeader><SectionTitle>Riwayat Peringatan</SectionTitle></PanelHeader>
            <div className="p-4 flex flex-col gap-2">
              {STATIC_ALERT_DATA.map((item) => <AlertCard key={item.id} item={item} />)}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <PanelHeader
              action={
                <select className="select select-xs select-bordered rounded-full bg-slate-50 border-slate-200 text-slate-500 focus:outline-none w-28">
                  <option>Hari Ini</option>
                  <option>Kemarin</option>
                  <option>7 Hari</option>
                </select>
              }
            >
              <SectionTitle sub={`Kandang: ${selectedDevice?.name ?? "—"}`}>Monitoring Real-time</SectionTitle>
            </PanelHeader>
            <div className="p-5">
              <div className="h-56 w-full">
                <Line data={chartData} options={chartOptions} plugins={[gradientPlugin]} />
              </div>
            </div>
          </div>

          {/* Alert feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <PanelHeader
              action={
                alertHistory !== STATIC_ALERT_DATA
                  ? <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">{alertHistory.length} spike</span>
                  : undefined
              }
            >
              <SectionTitle sub="Suhu naik drastis">Riwayat Peringatan</SectionTitle>
            </PanelHeader>
            <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto max-h-64">
              {alertHistory.map((item) => <AlertCard key={item.id} item={item} />)}
            </div>
            <div className="px-4 pb-4">
              <button className="btn btn-sm btn-outline w-full text-xs font-semibold border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl">
                Lihat Semua Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── KANDANG TABLE ── */}
      {loadingLogs ? (
        <KandangTableSkeleton />
      ) : (
        <KandangTable data={kandangRows} selectedId={selectedDeviceId} onSelectDevice={setSelectedDeviceId} />
      )}
    </div>
  );
}