"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  FaThermometerHalf,
  FaTint,
  FaExclamationTriangle,
  FaPlus,
  FaFire,
  FaTimes,
  FaMicrochip,
  FaCheckCircle,
  FaInfoCircle,
  FaServer,
  FaChartArea,
  FaBolt,
  FaPlayCircle,
  FaChevronRight,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { useMqttSensor, type MqttSensorPayload, type MqttStatus } from "@/hooks/useMqttSensor";
import ControlPanel from "@/components/dashboard/ControlPanel";
import { PHASE_MAP, getPhase, isTempSpike } from "@/lib/sensor";
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
  docDate?: string;
  createdAt: string;
}

interface SensorLog {
  _id?: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  age: number;
  vfd: number;
  dimmer: number;
  manualOverride?: boolean;
  emergency?: boolean;
  tempMin?: number;
  tempMax?: number;
  humMin?: number;
  humMax?: number;
  timestamp: string;
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
  chipLabel?: string;
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
const RH_HIGH_THRESHOLD = 65;
const RH_LOW_THRESHOLD = 60;

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



// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function computeAlertHistory(logs: SensorLog[]): AlertItem[] {
  const spikes = logs.filter((l) => isTempSpike(l.age, l.temperature)).slice(0, 10);
  const alertItems: AlertItem[] = spikes.map((log, i) => {
    const date = new Date(log.timestamp);
    const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const timeLabel =
      diffMin < 1 ? "baru saja"
      : diffMin < 60 ? `${diffMin}m lalu`
      : diffHr < 24 ? `${diffHr}j lalu`
      : `${Math.floor(diffHr / 24)}h lalu`;
    return {
      id: i,
      icon: <FaFire className="text-red-400 shrink-0" />,
      title: "Suhu Tinggi",
      time: timeLabel,
      message: `Mencapai ${log.temperature.toFixed(1)}°C pukul ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}.`,
      variant: "red" as const,
      chipLabel: `${log.temperature.toFixed(1)}°C`,
    };
  });
  return alertItems;
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



/** Shimmer skeleton */
function Shimmer({ className }: { className?: string }) {
  return <div className={`bg-slate-100 animate-pulse rounded-lg ${className ?? ""}`} />;
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
              <button onClick={() => onClose()} className="btn btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl flex-1">Daftarkan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VFD / DIMMER OUTPUT BAR
// ─────────────────────────────────────────────
function OutputBar({ label, value, max, icon, colorClass }: {
  label: string;
  value: number | null;
  max: number;
  icon: React.ReactNode;
  colorClass: string;
}) {
  const pct = value !== null ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-16 shrink-0">
        {icon}
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 tabular-nums w-12 text-right">
        {value !== null ? `${pct}%` : "—"}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// KANDANG TABLE
// ─────────────────────────────────────────────
function KandangTable({ data, selectedId, onSelectDevice }: { data: KandangRow[]; selectedId: string | null; onSelectDevice: (id: string) => void }) {
  return (
    <>
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
    </>
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

// ─────────────────────────────────────────────
// SPIKE CHIP STRIP
// ─────────────────────────────────────────────
function SpikeChipStrip({
  spikes,
  icon,
  chipColor,
  emptyMessage,
  onShowAll,
}: {
  spikes: AlertItem[];
  icon: React.ReactNode;
  chipColor: "red" | "blue";
  emptyMessage: string;
  onShowAll: () => void;
}) {
  const MAX_VISIBLE = 5;
  const visible = spikes.slice(0, MAX_VISIBLE);
  const remaining = spikes.length - MAX_VISIBLE;

  const chipStyle = {
    red: "bg-red-50 border-red-100 hover:bg-red-100 text-red-700",
    blue: "bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-700",
  }[chipColor];

  if (spikes.length === 0) {
    return (
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
          <FaCheckCircle className="text-emerald-400 text-xs shrink-0" />
          <span className="text-[11px] text-emerald-700 font-medium">{emptyMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]">
        {visible.map((s, i) => (
          <div
            key={i}
            className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors shrink-0 ${chipStyle}`}
            onClick={onShowAll}
            title={s.message}
          >
            {icon}
            <span className="text-[11px] font-bold tabular-nums">{s.chipLabel ?? ""}</span>
            <span className="text-[10px] text-slate-400 font-mono">{s.time}</span>
          </div>
        ))}
        {remaining > 0 && (
          <button
            onClick={onShowAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors shrink-0"
          >
            <span className="text-[11px] font-bold text-slate-600">+{remaining} lainnya</span>
            <FaChevronRight className="text-[10px] text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DETAILS ALERT MODAL
// ─────────────────────────────────────────────
function DetailsAlertModal({
  open,
  onClose,
  title,
  icon,
  spikes,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  spikes: AlertItem[];
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 64px -12px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)" }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-400" />
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-xl">{icon}</div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{spikes.length} kejadian tercatat</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><FaTimes /></button>
        </div>
        <div className="h-px bg-slate-100 mx-6" />
        <div className="px-6 pt-5 pb-6 max-h-80 overflow-y-auto flex flex-col gap-2">
          {spikes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <FaCheckCircle className="text-emerald-400 text-3xl mx-auto mb-2" />
              <p>Tidak ada lonjakan</p>
            </div>
          ) : (
            spikes.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl bg-slate-50 border-l-4 ${ALERT_LEFT_BAR[s.variant]}`}>
                <div className="mt-0.5">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-xs font-bold ${ALERT_TITLE_CLASSES[s.variant]}`}>{s.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{s.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="btn btn-sm bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl w-full">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RINGKASAN KANDANG MODAL
// ─────────────────────────────────────────────
function RingkasanKandangModal({
  open,
  onClose,
  devices,
  allLogs,
}: {
  open: boolean;
  onClose: () => void;
  devices: Device[];
  allLogs: SensorLog[];
}) {
  if (!open) return null;

  const logs = devices
    .map((d) => allLogs.findLast((l) => String(l.deviceId) === String(d._id)))
    .filter((l): l is SensorLog => l !== null);

  const n = logs.length;
  const avgVfd = n ? Math.round(logs.reduce((s, l) => s + l.vfd, 0) / n / 255 * 100) : 0;
  const avgDimmer = n ? Math.round(logs.reduce((s, l) => s + l.dimmer, 0) / n / 255 * 100) : 0;
  const avgTemp = n ? logs.reduce((s, l) => s + l.temperature, 0) / n : 0;
  const avgHum = n ? logs.reduce((s, l) => s + l.humidity, 0) / n : 0;
  const manualCount = logs.filter((l) => l.manualOverride).length;
  const warningCount = logs.filter((l) => isTempSpike(l.age, l.temperature)).length;
  const activeCount = devices.filter((d) => d.active).length;
  const standbyCount = devices.length - activeCount;
  const currentAge = logs.length ? Math.max(...logs.map((l) => l.age)) : 0;

  // Phase date predictions
  const today = new Date();
  const activeDevice = devices.find((d) => d.active);
  const docDate = activeDevice?.docDate
    ? new Date(activeDevice.docDate)
    : new Date(today.getTime() - currentAge * 86400000);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const fmtDate = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  const fmtMonth = (d: Date) => `${d.getDate()} ${monthNames[d.getMonth()]}`;

  const phaseData = PHASE_MAP.map((phase, i) => {
    const prevMax = i === 0 ? 0 : PHASE_MAP[i - 1].maxAge;
    const isActive = currentAge >= prevMax && currentAge <= phase.maxAge;
    const isPast = currentAge > phase.maxAge;
    const startDate = new Date(docDate);
    startDate.setDate(startDate.getDate() + prevMax);
    return { phase, prevMax, isActive, isPast, startDate };
  });

  const harvestDate = new Date(docDate);
  harvestDate.setDate(harvestDate.getDate() + 45);

  const sl = (label: string) =>
    label === "Starter" ? "ST" : label === "Grower 1" ? "GR1" : label === "Grower 2" ? "GR2"
    : label === "Finisher" ? "FIN" : "PN";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 64px -12px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)" }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600" />
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-lime-50 rounded-xl">
              <FaServer className="text-lime-600 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ringkasan Lengkap</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {devices.length} kandang{currentAge > 0 ? ` · Fase ${getPhase(currentAge).label} · Panen: ${fmtMonth(harvestDate)}` : ""}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><FaTimes /></button>
        </div>
        <div className="h-px bg-slate-100 mx-6" />
        <div className="px-6 pt-5 pb-6 max-h-[75vh] overflow-y-auto flex flex-col gap-5">
          {devices.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">Belum ada kandang terdaftar.</p>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between gap-0">
                  {phaseData.map((pd, i) => (
                    <React.Fragment key={i}>
                      <div className="flex-1 flex flex-col items-center">
                        <div className={`w-11 h-11 rounded-full flex flex-col items-center justify-center ${
                          pd.isActive
                            ? "bg-[#d6f14a] text-slate-900"
                            : pd.isPast
                            ? "bg-slate-100 text-slate-500"
                            : "bg-slate-50 text-slate-400"
                        }`}>
                          <span className="text-[11px] font-medium leading-tight">{sl(pd.phase.label)}</span>
                          <span className="text-[9px] leading-tight">{fmtDate(pd.startDate)}</span>
                        </div>
                        <p className={`text-[9px] mt-1 ${
                          pd.isActive ? "font-bold text-slate-900" : pd.isPast ? "text-slate-400" : "text-slate-300"
                        }`}>
                          {pd.prevMax + 1}–{pd.phase.maxAge}
                        </p>
                      </div>
                      {i < phaseData.length - 1 && <div className="w-px h-8 self-center border-r border-dotted border-slate-200" />}
                    </React.Fragment>
                  ))}
                </div>
                {currentAge > 0 && (
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-100 text-[10px] font-medium text-lime-700">
                      ● Fase {getPhase(currentAge).label} — {currentAge} hr
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-emerald-600 w-9 shrink-0">VFD</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                        style={{ width: `${Math.min(avgVfd, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 tabular-nums w-9 text-right">{avgVfd}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-amber-600 w-9 shrink-0">DIM</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-700"
                        style={{ width: `${Math.min(avgDimmer, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 tabular-nums w-9 text-right">{avgDimmer}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-1.5">
                  <span>0</span>
                  <span>64</span>
                  <span>128</span>
                  <span>192</span>
                  <span>255</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[10px] text-slate-500">
                <span>Suhu: <span className="font-bold text-slate-700">{avgTemp > 0 ? avgTemp.toFixed(1) : "—"}°C</span></span>
                <span>RH: <span className="font-bold text-slate-700">{avgHum > 0 ? avgHum.toFixed(0) : "—"}%</span></span>
                <span>{activeCount} aktif / {standbyCount} standby</span>
                {warningCount > 0 && <span className="text-red-500 font-medium">{warningCount} peringatan</span>}
                {manualCount > 0 && <span className="text-amber-600 font-medium">{manualCount} manual</span>}
              </div>
            </>
          )}
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="btn btn-sm bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl w-full">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [logs, setLogs] = useState<SensorLog[]>([]);
  const [allLogs, setAllLogs] = useState<SensorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [spikeModalOpen, setSpikeModalOpen] = useState(false);
  const [spikeModalType, setSpikeModalType] = useState<"temp" | "rh">("temp");
  const [emergencyDismissed, setEmergencyDismissed] = useState(false);
  const [ringkasanOpen, setRingkasanOpen] = useState(false);
  const [tambahKandangOpen, setTambahKandangOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("Hari Ini");

  // MQTT realtime handler
  const handleMqttMessage = useCallback((data: MqttSensorPayload) => {
    const log: SensorLog = {
      deviceId: data.deviceId,
      temperature: data.temperature,
      humidity: data.humidity,
      age: data.age,
      vfd: data.vfd,
      dimmer: data.dimmer,
      manualOverride: data.manualOverride,
      tempMin: data.tempMin,
      tempMax: data.tempMax,
      humMin: data.humMin,
      humMax: data.humMax,
      timestamp: new Date().toISOString(),
    };

    setAllLogs((prev) => {
      const filtered = prev.filter((l) => String(l.deviceId) !== data.deviceId);
      return [...filtered, log];
    });

    setLogs((prev) => {
      if (String(data.deviceId) !== selectedDeviceId) return prev;
      const next = [...prev, log];
      return next.length > 50 ? next.slice(-50) : next;
    });

    setLastUpdated(new Date());
  }, [selectedDeviceId]);

  const { status: mqttStatus, publish } = useMqttSensor(handleMqttMessage);

  const chartLabels = useMemo(
    () => logs.map((l) => new Date(l.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })),
    [logs]
  );

  const chartDataSuhu = useMemo<ChartData<"line">>(() => {
    const targetLow = logs.map((l) => l.tempMin ?? getPhase(l.age).tempLow);
    const targetHigh = logs.map((l) => l.tempMax ?? getPhase(l.age).tempHigh);
    return {
      labels: chartLabels,
      datasets: [
        {
          label: "Target Bawah (°C)",
          data: targetLow,
          borderColor: "#0ea5e9",
          borderDash: [3, 3],
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.2,
          fill: false,
          order: 0,
        },
        {
          label: "Target Atas (°C)",
          data: targetHigh,
          borderColor: "#0ea5e9",
          borderDash: [3, 3],
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.2,
          backgroundColor: "rgba(14,165,233,0.06)",
          fill: "-1",
          order: 0,
        },
        {
          label: "Suhu (°C)",
          data: logs.map((l) => l.temperature),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.12)",
          tension: 0.4, fill: true, borderWidth: 2,
          pointRadius: (() => {
            const f = logs.map((l) => isTempSpike(l.age, l.temperature));
            return logs.map((_, i) => f[i] ? 7 : 0);
          })(),
          pointBackgroundColor: (() => {
            const f = logs.map((l) => isTempSpike(l.age, l.temperature));
            return logs.map((_, i) => f[i] ? "#ef4444" : "transparent");
          })(),
          pointBorderColor: (() => {
            const f = logs.map((l) => isTempSpike(l.age, l.temperature));
            return logs.map((_, i) => f[i] ? "#fff" : "transparent");
          })(),
          pointBorderWidth: (() => {
            const f = logs.map((l) => isTempSpike(l.age, l.temperature));
            return logs.map((_, i) => f[i] ? 2 : 0);
          })(),
          pointHoverRadius: (() => {
            const f = logs.map((l) => isTempSpike(l.age, l.temperature));
            return logs.map((_, i) => f[i] ? 8 : 4);
          })(),
          order: 1,
        },
      ],
    };
  }, [logs, chartLabels]);

  const chartDataRh = useMemo<ChartData<"line">>(() => {
    const targetLow = logs.map((l) => l.humMin ?? getPhase(l.age).rhLow);
    const targetHigh = logs.map((l) => l.humMax ?? getPhase(l.age).rhHigh);
    return {
      labels: chartLabels,
      datasets: [
        {
          label: "RH Target Bawah (%)",
          data: targetLow,
          borderColor: "#94a3b8",
          borderDash: [2, 2],
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.2,
          fill: false,
          order: 0,
        },
        {
          label: "RH Target Atas (%)",
          data: targetHigh,
          borderColor: "#94a3b8",
          borderDash: [2, 2],
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.2,
          backgroundColor: "rgba(148,163,184,0.06)",
          fill: "-1",
          order: 0,
        },
        {
          label: "Kelembapan (%)",
          data: logs.map((l) => l.humidity),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14,165,233,0.08)",
          tension: 0.4, fill: true, borderWidth: 2,
          pointRadius: (() => {
            const f = logs.map((l) => l.humidity > RH_HIGH_THRESHOLD || l.humidity < RH_LOW_THRESHOLD);
            return logs.map((_, i) => f[i] ? 7 : 0);
          })(),
          pointBackgroundColor: (() => {
            const f = logs.map((l) => l.humidity > RH_HIGH_THRESHOLD || l.humidity < RH_LOW_THRESHOLD);
            return logs.map((_, i) => f[i] ? "#3b82f6" : "transparent");
          })(),
          pointBorderColor: (() => {
            const f = logs.map((l) => l.humidity > RH_HIGH_THRESHOLD || l.humidity < RH_LOW_THRESHOLD);
            return logs.map((_, i) => f[i] ? "#fff" : "transparent");
          })(),
          pointBorderWidth: (() => {
            const f = logs.map((l) => l.humidity > RH_HIGH_THRESHOLD || l.humidity < RH_LOW_THRESHOLD);
            return logs.map((_, i) => f[i] ? 2 : 0);
          })(),
          pointHoverRadius: (() => {
            const f = logs.map((l) => l.humidity > RH_HIGH_THRESHOLD || l.humidity < RH_LOW_THRESHOLD);
            return logs.map((_, i) => f[i] ? 8 : 4);
          })(),
          order: 1,
        },
      ],
    };
  }, [logs, chartLabels]);

  const gradientPlugin = useMemo(() => ({
    id: "customGradient",
    afterLayout(chart: ChartJS) {
      const tempDataset = chart.data.datasets.find((d) => d.label === "Suhu (°C)");
      if (!tempDataset) return;
      const dataset = tempDataset as ChartData<"line">["datasets"][0] & { backgroundColor: unknown };
      const ctx = chart.ctx;
      const { top, bottom } = chart.chartArea ?? {};
      if (!ctx || top == null) return;
      const gradient = ctx.createLinearGradient(0, top, 0, bottom);
      gradient.addColorStop(0, "rgba(239,68,68,0.35)");
      gradient.addColorStop(1, "rgba(239,68,68,0)");
      dataset.backgroundColor = gradient;
    },
  }), []);

  // Initial fetch: devices + latest log per device (one-time)
  useEffect(() => {
    const initFetch = async () => {
      try {
        const res = await fetch("/api/devices");
        const data: Device[] = await res.json();
        setDevices(data);
        if (data.length > 0) {
          if (!selectedDeviceId) {
            const first = data.find((d) => d.claimed);
            if (first) setSelectedDeviceId(first._id);
          }
          const results = await Promise.all(
            data.map((d) =>
              fetch(`/api/logs?deviceId=${d._id}&limit=1&t=${Date.now()}`)
                .then((r) => r.json() as Promise<{logs: SensorLog[]}>)
                .then((r) => r.logs || [])
                .catch(() => [] as SensorLog[])
            )
          );
          setAllLogs(results.flat());
        }
      } catch (err) {
        console.error("Gagal fetch devices:", err);
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  // Fetch historical logs when selected device or time range changes
  useEffect(() => {
    if (!selectedDeviceId) return;
    const fetchHistorical = async () => {
      try {
        const fromMap: Record<string, string> = {
          "Hari Ini": new Date(new Date().setHours(0,0,0,0)).toISOString(),
          "Kemarin": new Date(Date.now() - 86400000).toISOString(),
          "7 Hari": new Date(Date.now() - 7*86400000).toISOString(),
        };
        const from = fromMap[timeRange] || "";
        const url = `/api/logs?deviceId=${selectedDeviceId}&limit=50&from=${from}&t=${Date.now()}`;
        const res = await fetch(url);
        const data = await res.json();
        const logsData: SensorLog[] = data.logs || [];
        setLogs(logsData.reverse());
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Gagal fetch historical logs:", err);
      }
    };
    fetchHistorical();
  }, [selectedDeviceId, timeRange]);

  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Peternak Cerdas";
  const latest = logs[logs.length - 1] ?? null;
  const latestTemp = latest?.temperature ?? null;
  const latestHumid = latest?.humidity ?? null;
  const latestVfd = latest?.vfd ?? null;
  const latestDimmer = latest?.dimmer ?? null;
  const latestManualOverride = latest?.manualOverride ?? false;
  const latestEmergency = latest?.emergency ?? false;
  const totalActive = devices.filter((d) => d.active).length;
  const totalStandby = devices.filter((d) => !d.active).length;
  const totalWarning = devices.filter((d) => {
    const l = allLogs.findLast((x) => String(x.deviceId) === String(d._id));
    return l && isTempSpike(l.age, l.temperature);
  }).length;

  const tempSpikes = useMemo<AlertItem[]>(() => computeAlertHistory(logs), [logs]);

  const rhSpikes = useMemo<AlertItem[]>(() => {
    const anomalies = logs.filter(
      (l) => l.humidity > RH_HIGH_THRESHOLD || l.humidity < RH_LOW_THRESHOLD
    ).slice(0, 10);
    return anomalies.map((log, i) => {
      const date = new Date(log.timestamp);
      const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
      const diffHr = Math.floor(diffMin / 60);
      const timeLabel =
        diffMin < 1 ? "baru saja"
        : diffMin < 60 ? `${diffMin}m lalu`
        : diffHr < 24 ? `${diffHr}j lalu`
        : `${Math.floor(diffHr / 24)}h lalu`;
      const isHigh = log.humidity > RH_HIGH_THRESHOLD;
      return {
        id: i,
        icon: <FaTint className={`${isHigh ? "text-blue-400" : "text-amber-400"} shrink-0`} />,
        title: isHigh ? "Kelembapan Tinggi" : "Kelembapan Rendah",
        time: timeLabel,
        message: `${isHigh ? "Naik" : "Turun"} ke ${log.humidity.toFixed(0)}% pukul ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}.`,
        variant: isHigh ? "blue" as const : "red" as const,
        chipLabel: `${log.humidity.toFixed(0)}%`,
      };
    });
  }, [logs]);

  const alertHistory = useMemo(() => {
    const merged: AlertItem[] = [];
    let ti = 0, ri = 0;
    while (ti < tempSpikes.length || ri < rhSpikes.length) {
      if (ti < tempSpikes.length) merged.push({ ...tempSpikes[ti], id: merged.length }), ti++;
      if (ri < rhSpikes.length) merged.push({ ...rhSpikes[ri], id: merged.length }), ri++;
    }
    return merged.slice(0, 15);
  }, [tempSpikes, rhSpikes]);

  const kandangRows: KandangRow[] = devices.map((d) => {
    const lastLog = allLogs.findLast((l) => String(l.deviceId) === String(d._id)) ?? null;
    const suhu = lastLog?.temperature ?? null;
    const status: KandangStatus = !d.claimed ? "kosong" : suhu !== null && lastLog !== null && isTempSpike(lastLog.age, suhu) ? "warning" : "normal";
    return { id: d.name, deviceId: d._id, umur: lastLog?.age != null ? `${lastLog.age} hr` : "-", suhu, kelembapan: lastLog?.humidity ?? null, status, claimed: d.claimed, capacity: d.capacity, active: d.active, createdAt: d.createdAt };
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
          <EmptyState type="no-device" onAction={() => setTambahKandangOpen(true)} />
        </div>
      </div>
    );
  }

  const selectedDevice = devices.find((d) => d._id === selectedDeviceId);

  return (
    <div className="max-w-7xl mx-auto w-full grid grid-cols-12 lg:grid-rows-10 gap-2 min-h-screen" suppressHydrationWarning>

      {/* ── ZONE 1: STATUS + RINGKASAN (rows 1-2) ── */}
      <div className="col-span-12 lg:row-start-1 lg:row-end-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col">
        {/* Greeting + badges row */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm">
              {userName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Halo, {userName}</h2>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className={`w-1 h-1 rounded-full animate-pulse ${
                  mqttStatus === "connected" ? "bg-emerald-400" : mqttStatus === "reconnecting" ? "bg-amber-400" : "bg-red-400"
                }`} />
                {mqttStatus === "connected" ? "Realtime" : mqttStatus === "reconnecting" ? "Menghubungkan kembali…" : "Terputus"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-slate-600 bg-slate-100 border border-slate-200">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              {totalActive} Online
            </span>
            {totalStandby > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-slate-400 bg-slate-50 border border-slate-200">
                {totalStandby} Offline
              </span>
            )}
            {totalWarning > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-orange-400 animate-pulse" />
                {totalWarning} Peringatan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                Normal
              </span>
            )}
          </div>
        </div>

        {/* Emergency Banner */}
        {selectedDeviceId && latestEmergency && !emergencyDismissed && (
          <div className="rounded-xl border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-50/80 overflow-hidden mt-2">
            <div className="flex items-start gap-2 p-2">
              <FaExclamationTriangle className="text-xs shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[11px] text-red-800">
                  DARURAT — SYSTEM STOPPED
                </p>
                <p className="text-[10px] mt-0.5 text-red-600">
                  Suhu {latestTemp?.toFixed(1)}°C — perangkat dalam mode darurat
                </p>
              </div>
              <button
                onClick={() => {
                  publish(`device/${selectedDeviceId}/cmd`, JSON.stringify({ type: "emergency", action: "resume" }));
                  setEmergencyDismissed(true);
                }}
                className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-medium hover:bg-emerald-600 transition-colors shrink-0"
              >
                <FaPlayCircle className="text-[10px]" /> Resume
              </button>
              <button onClick={() => setEmergencyDismissed(true)} className="p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                <FaTimes className="text-[10px]" />
              </button>
            </div>
          </div>
        )}

        {/* 4 Mini Metrics + Timeline */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3">
                <Shimmer className="h-2 w-10 mb-1" />
                <Shimmer className="h-4 w-12 mb-1" />
                <Shimmer className="h-2 w-8" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-stretch gap-2 mt-2 flex-1">
            <div className="grid grid-cols-4 gap-2 flex-1">
              <button onClick={() => setRingkasanOpen(true)} className="bg-slate-50 rounded-xl p-2.5 text-center hover:bg-slate-100 transition-colors cursor-pointer text-left">
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Suhu</p>
                <p className="text-base font-bold text-slate-900">
                  {latestTemp !== null ? latestTemp.toFixed(1) : "—"}<span className="text-[10px] text-slate-400">°C</span>
                </p>
                <p className={`text-[9px] mt-0.5 font-medium ${latestTemp !== null && latest !== null ? (isTempSpike(latest.age, latestTemp) ? "text-red-500" : "text-emerald-500") : "text-slate-400"}`}>
                  {latestTemp !== null && latest !== null ? (isTempSpike(latest.age, latestTemp) ? "⚠ Tinggi" : "✓ Normal") : "—"}
                </p>
              </button>
              <button onClick={() => setRingkasanOpen(true)} className="bg-slate-50 rounded-xl p-2.5 text-center hover:bg-slate-100 transition-colors cursor-pointer text-left">
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">RH</p>
                <p className="text-base font-bold text-slate-900">
                  {latestHumid !== null ? latestHumid.toFixed(0) : "—"}<span className="text-[10px] text-slate-400">%</span>
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">60–70%</p>
              </button>
              <button onClick={() => setRingkasanOpen(true)} className="bg-slate-50 rounded-xl p-2.5 text-center hover:bg-slate-100 transition-colors cursor-pointer text-left">
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Umur</p>
                <p className="text-base font-bold text-slate-900">
                  {latest?.age != null ? latest.age : "—"}<span className="text-[10px] text-slate-400">hr</span>
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">
                  {latest?.age != null ? getPhase(latest.age).label : "—"}
                </p>
              </button>
              <button onClick={() => setRingkasanOpen(true)} className="bg-slate-50 rounded-xl p-2.5 text-center hover:bg-slate-100 transition-colors cursor-pointer text-left">
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">⚠</p>
                <p className="text-base font-bold text-slate-900">{totalWarning}</p>
                <p className={`text-[9px] mt-0.5 font-medium ${totalWarning > 0 ? "text-orange-500" : "text-slate-400"}`}>
                  {totalWarning > 0 ? "Aktif" : "Aman"}
                </p>
              </button>
            </div>
            {/* Timeline Mini */}
            {selectedDeviceId && (
              <button onClick={() => setRingkasanOpen(true)} className="shrink-0 flex items-center gap-2 px-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-0.5">
                  {PHASE_MAP.map((phase, i) => {
                    const prevMax = i === 0 ? 0 : PHASE_MAP[i - 1].maxAge;
                    const current = latest?.age ?? 0;
                    const isActive = current >= prevMax && current <= phase.maxAge;
                    const isPast = current > phase.maxAge;
                    return (
                      <div key={i} className={`rounded-full ${isActive ? "w-2 h-2 bg-slate-900" : isPast ? "w-1.5 h-1.5 bg-slate-400" : "w-1.5 h-1.5 bg-slate-200"}`} />
                    );
                  })}
                </div>
                <span className="text-[10px] text-slate-500 truncate">
                  {latest?.age != null ? `${latest.age} hr · ${getPhase(latest.age).label}` : "—"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── ZONE 2: SUHU CHART (rows 3-5) ── */}
      <div className="col-span-12 lg:col-span-9 lg:row-start-3 lg:row-end-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <PanelHeader
          action={
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="select select-xs select-bordered rounded-full bg-slate-50 border-slate-200 text-slate-500 focus:outline-none w-28"
            >
              <option>Hari Ini</option>
              <option>Kemarin</option>
              <option>7 Hari</option>
            </select>
          }
        >
          <SectionTitle sub={selectedDeviceId && selectedDevice ? `Kandang: ${selectedDevice.name}` : "Semua kandang"}>
            Suhu Kandang
          </SectionTitle>
        </PanelHeader>
        {logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center"><EmptyState type="no-data" /></div>
        ) : (
          <div className="p-4 flex-1 flex items-center">
            <div className="h-36 w-full">
              <Line data={chartDataSuhu} options={chartOptions} plugins={[gradientPlugin]} />
            </div>
          </div>
        )}
        {logs.length > 0 && (
          <SpikeChipStrip
            spikes={tempSpikes}
            icon={<FaFire className="text-[10px]" />}
            chipColor="red"
            emptyMessage="Tidak ada lonjakan suhu"
            onShowAll={() => { setSpikeModalType("temp"); setSpikeModalOpen(true); }}
          />
        )}
      </div>

      {/* ── ZONE 3: KONTROL SIDEBAR (rows 3-8) ── */}
      <div className="col-span-12 lg:col-span-3 lg:row-start-3 lg:row-end-9">
        <ControlPanel
          publish={publish}
          deviceId={selectedDeviceId ?? ""}
          currentVfd={latestVfd ?? 0}
          currentDimmer={latestDimmer ?? 0}
          manualOverride={latestManualOverride}
          emergencyMode={latestEmergency}
          currentTemp={latestTemp ?? 0}
          currentHum={latestHumid ?? 0}
        />
      </div>

      {/* ── ZONE 4: RH CHART (rows 6-8) ── */}
      <div className="col-span-12 lg:col-span-9 lg:row-start-6 lg:row-end-9 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <PanelHeader>
          <SectionTitle sub={selectedDeviceId && selectedDevice ? `Kandang: ${selectedDevice.name}` : "Semua kandang"}>
            Kelembapan Kandang
          </SectionTitle>
        </PanelHeader>
        {logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center"><EmptyState type="no-data" /></div>
        ) : (
          <div className="p-4 flex-1 flex items-center">
            <div className="h-32 w-full">
              <Line data={chartDataRh} options={chartOptions} />
            </div>
          </div>
        )}
        {logs.length > 0 && (
          <SpikeChipStrip
            spikes={rhSpikes}
            icon={<FaTint className="text-[10px]" />}
            chipColor="blue"
            emptyMessage="Kelembapan dalam rentang ideal"
            onShowAll={() => { setSpikeModalType("rh"); setSpikeModalOpen(true); }}
          />
        )}
      </div>

      {/* ── ZONE 5: ALERT HISTORY TABLE (rows 9-10) ── */}
      <div className="col-span-12 lg:row-start-9 lg:row-end-11 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <SectionTitle sub="Lonjakan suhu & kelembapan abnormal">Riwayat Alert</SectionTitle>
          {alertHistory.length > 0 && (
            <span className="text-[10px] text-slate-400">{alertHistory.length} kejadian</span>
          )}
        </div>
        {alertHistory.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Belum ada lonjakan atau anomali dalam periode ini.</p>
        ) : (
          <div className="space-y-1.5 max-h-[calc(2*5rem)] overflow-y-auto">
            {alertHistory.map((a) => (
              <div key={a.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
                <span className="shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-700">{a.title}</span>
                    <span className="text-[9px] text-slate-400">{a.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{a.message}</p>
                </div>
                {a.chipLabel && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    a.variant === "red" ? "bg-red-50 text-red-600" : a.variant === "blue" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                  }`}>
                    {a.chipLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <DetailsAlertModal
        open={spikeModalOpen}
        onClose={() => setSpikeModalOpen(false)}
        title={spikeModalType === "temp" ? "Riwayat Lonjakan Suhu" : "Riwayat Kelembapan Abnormal"}
        icon={spikeModalType === "temp" ? <FaFire className="text-red-400 text-xl" /> : <FaTint className="text-blue-400 text-xl" />}
        spikes={spikeModalType === "temp" ? tempSpikes : rhSpikes}
      />

      <RingkasanKandangModal
        open={ringkasanOpen}
        onClose={() => setRingkasanOpen(false)}
        devices={devices}
        allLogs={allLogs}
      />

      <TambahKandangModal
        open={tambahKandangOpen}
        onClose={() => setTambahKandangOpen(false)}
      />
    </div>
  );
}