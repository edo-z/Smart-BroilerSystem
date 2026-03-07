"use client";

import React, { useMemo, useRef, useEffect, useContext, useState } from "react";
import {
  FaHome,
  FaThermometerHalf,
  FaTint,
  FaExclamationTriangle,
  FaBell,
  FaCog,
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
import type { ScriptableContext } from "chart.js";

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
  _id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  recordedAt: string;
}

interface KandangRow {
  id: string;
  umur: string;
  suhu: number | null;
  kelembapan: number | null;
  status: KandangStatus;
}

interface AlertItem {
  id: number;
  icon: React.ReactNode;
  title: string;
  time: string;
  message: string;
  variant: "red" | "blue" | "slate";
}

// ─────────────────────────────────────────────
// STATIC DATA (move outside component to avoid re-creation)
// ─────────────────────────────────────────────
const CHART_LABELS = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"];

const KANDANG_DATA: KandangRow[] = [
  { id: "Kandang A1", umur: "14 Hari", suhu: 32.0, kelembapan: 65, status: "warning" },
  { id: "Kandang A2", umur: "21 Hari", suhu: 28.5, kelembapan: 64, status: "normal" },
  { id: "Kandang B1", umur: "-", suhu: null, kelembapan: null, status: "kosong" },
];

const ALERT_DATA: AlertItem[] = [
  {
    id: 1,
    icon: <FaExclamationTriangle className="text-red-500 mt-1 shrink-0" />,
    title: "Suhu Tinggi",
    time: "10m lalu",
    message: "Kandang A1 mencapai 32°C. Kipas aktif pendinginkan.",
    variant: "red",
  },
  {
    id: 2,
    icon: <FaBell className="text-blue-500 mt-1 shrink-0" />,
    title: "Target Suhu Turun",
    time: "1j lalu",
    message: "Ayam fase 2. Target suhu menurun ke 28°C.",
    variant: "blue",
  },
  {
    id: 3,
    icon: <FaCog className="text-slate-500 mt-1 shrink-0" />,
    title: "Maintenance",
    time: "3j lalu",
    message: "Sensor Kandang B perlu dikalibrasi ulang.",
    variant: "slate",
  },
];

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

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Skeleton loader untuk stat card */
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

/** Stat card siap pakai */
function StatCard({
  icon,
  iconBg,
  title,
  value,
  unit,
  desc,
  descColor = "text-slate-400",
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string | number;
  unit?: string;
  desc: string;
  descColor?: string;
}) {
  return (
    <div className="stat bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="stat-figure">
        <div className={`p-3 ${iconBg} rounded-lg`}>{icon}</div>
      </div>
      <div className="stat-title text-xs font-bold uppercase text-slate-500">{title}</div>
      <div className="stat-value text-3xl text-slate-900 mt-2">
        {value}
        {unit && <span className="text-lg text-slate-500 font-normal">{unit}</span>}
      </div>
      <div className={`stat-desc text-xs font-medium mt-1 ${descColor}`}>{desc}</div>
    </div>
  );
}

/** Baris alert */
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

/** Badge status kandang */
function StatusBadge({ status }: { status: KandangStatus }) {
  const config = {
    warning: "bg-orange-100 text-orange-700",
    normal: "bg-green-100 text-green-700",
    kosong: "bg-slate-100 text-slate-500",
  };
  const label = { warning: "Warning", normal: "Normal", kosong: "Kosong" };
  return (
    <div className={`badge badge-sm border-none gap-1 text-[10px] px-2 py-3 ${config[status]}`}>
      {label[status]}
    </div>
  );
}

/** Tabel status kandang */
function KandangTable({ data }: { data: KandangRow[] }) {
  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-slate-800">Status Kandang</h3>
        <button className="btn btn-sm btn-primary bg-slate-900 hover:bg-slate-800 border-none text-white rounded-lg h-9 min-h-0 px-4">
          + Tambah Kandang
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider">
            <tr>
              <th>ID Kandang</th>
              <th>Umur Ayam</th>
              <th>Suhu (°C)</th>
              <th>Kelembapan (%)</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50">
                <td className="font-bold text-slate-900">{row.id}</td>
                <td>{row.umur}</td>
                <td className={row.suhu !== null ? (row.status === "warning" ? "text-red-600 font-semibold" : "text-green-600 font-semibold") : "text-slate-400 font-medium"}>
                  {row.suhu !== null ? row.suhu.toFixed(1) : "--"}
                </td>
                <td>{row.kelembapan ?? "-"}</td>
                <td><StatusBadge status={row.status} /></td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHART OPTIONS (stable reference, outside component)
// ─────────────────────────────────────────────
const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: { boxWidth: 10, usePointStyle: true },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      grid: { color: "#f1f5f9" },
      border: { display: false },
      ticks: { color: "#64748b", font: { size: 11 } },
      beginAtZero: false,
    },
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: "#64748b", font: { size: 11 } },
    },
  },
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function DashboardPage() {
  /**
   * FIX 1 & 4: Gradient dibuat lewat plugin di dalam Chart.js lifecycle,
   * bukan di dalam backgroundColor callback — menghindari null ctx & any type.
   * FIX 2: useMemo agar chartData tidak dibuat ulang setiap render.
   */
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [logs, setLogs] = useState<SensorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const chartData = useMemo<ChartData<"line">>(() => ({
    labels: logs.map((l) =>
      new Date(l.recordedAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Suhu (°C)",
        data: logs.map((l) => l.temperature),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: "Kelembapan (%)",
        data: logs.map((l) => l.humidity),
        borderColor: "#3b82f6",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  }), [logs]);

  /**
   * FIX 2 lanjutan: Plugin gradient yang bekerja SETELAH canvas siap,
   * sehingga ctx tidak pernah null.
   */
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

  /**
   * FIX 3: Tidak menggunakan useSession() di sini.
   * Nama user diambil dari props/context layout (server-side).
   * Ganti dengan useUserContext() atau props sesuai arsitektur proyek.
   * Contoh: const userName = useUserContext()?.name?.split(" ")[0] ?? "Peternak Cerdas";
   */
  // Fetch semua device milik user saat pertama load
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("/api/devices");
        const data: Device[] = await res.json();
        setDevices(data);
        // Otomatis pilih device pertama yang sudah claimed
        const firstActive = data.find((d) => d.claimed);
        if (firstActive) setSelectedDeviceId(firstActive._id);
      } catch (err) {
        console.error("Gagal fetch devices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  // Polling data sensor setiap 5 detik
  useEffect(() => {
    if (!selectedDeviceId) return;

    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/sensor/data?deviceId=${selectedDeviceId}&limit=50`);
        const data: SensorLog[] = await res.json();
        // Data dari API urutan terbaru di atas, balik agar chart kiri = lama
        setLogs(data.reverse());
      } catch (err) {
        console.error("Gagal fetch logs:", err);
      }
    };

    fetchLogs(); // langsung fetch pertama kali
    const interval = setInterval(fetchLogs, 5000); // lalu tiap 5 detik
    return () => clearInterval(interval); // cleanup saat unmount
  }, [selectedDeviceId]);
  const userName = "Peternak Cerdas"; // ← ganti dengan context/props dari layout
  // Derived values dari data real
  const latestLog = logs[logs.length - 1] ?? null;
  const avgTemp = latestLog ? latestLog.temperature : null;
  const avgHumid = latestLog ? latestLog.humidity : null;
  const totalActive = devices.filter((d) => d.active).length;
  const totalStandby = devices.filter((d) => !d.active).length;
  return (
    <div className="max-w-7xl mx-auto w-full">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Halo, {userName}!
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Berikut adalah ringkasan performa kandang Anda hari ini.
          </p>
        </div>
        <div className="badge badge-success badge-outline gap-2 px-4 py-3 font-medium border-green-200 text-green-700 bg-green-50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Sistem Normal
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={<FaHome className="text-xl text-slate-400" />}
              iconBg="bg-slate-100"
              title="Total Kandang"
              value={devices.length}
              desc={`${totalActive} Aktif, ${totalStandby} Standby`}
            />
            <StatCard
              icon={<FaThermometerHalf className="text-xl text-red-500" />}
              iconBg="bg-red-50"
              title="Suhu Terkini"
              value={avgTemp !== null ? avgTemp.toFixed(1) : "--"}
              unit="°C"
              desc={avgTemp !== null ? (avgTemp > 31 ? "⚠ Di atas normal" : "▲ Normal") : "Belum ada data"}
              descColor={avgTemp !== null && avgTemp > 31 ? "text-red-500" : "text-green-500"}
            />
            <StatCard
              icon={<FaTint className="text-xl text-blue-500" />}
              iconBg="bg-blue-50"
              title="Kelembapan"
              value={avgHumid !== null ? avgHumid.toFixed(0) : "--"}
              unit="%"
              desc="Rentang Ideal 60-70%"
            />
            <StatCard
              icon={<FaExclamationTriangle className="text-xl text-orange-500" />}
              iconBg="bg-orange-50"
              title="Device Aktif"
              value={totalActive}
              desc={`${devices.filter((d) => d.claimed).length} terhubung`}
            />
          </>
        )}
      </div>

      {/* CHART & ALERTS — FIX 1+2: gradient plugin & useMemo */}
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
          <div className="relative h-87.5 w-full">
            <Line
              data={chartData}
              options={chartOptions}
              plugins={[gradientPlugin]}
            />
          </div>
        </div>

        {/* FIX 6: AlertList sebagai komponen terpisah */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Peringatan Terkini</h3>
          <div className="flex flex-col gap-4 flex-1">
            {ALERT_DATA.map((item) => (
              <AlertCard key={item.id} item={item} />
            ))}
          </div>
          <button className="btn btn-sm btn-outline w-full mt-6 text-xs font-bold border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-300">
            Lihat Semua Log
          </button>
        </div>

      </div>

      {/* FIX 6: KandangTable sebagai komponen terpisah */}
      <KandangTable
        data={devices.map((d) => {
          const lastLog = logs.filter(
            (l) => l.deviceId === d._id
          ).at(-1) ?? null;
          const suhu = lastLog?.temperature ?? null;
          const status: KandangStatus = !d.claimed
            ? "kosong"
            : suhu !== null && suhu > 31
              ? "warning"
              : "normal";
          return {
            id: d.name,
            umur: "-",
            suhu,
            kelembapan: lastLog?.humidity ?? null,
            status,
          };
        })}
      />

    </div>
  );
}