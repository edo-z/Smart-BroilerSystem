"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FaThermometerHalf,
  FaTint,
  FaSearch,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Device {
  _id: string;
  name: string;
  active: boolean;
  claimed: boolean;
}

interface SensorLog {
  _id: string;
  deviceId: string;
  deviceName: string;
  temperature: number;
  humidity: number;
  recordedAt: string;
}

interface LogsResponse {
  logs: SensorLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 15;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getTempStatus(temp: number): {
  label: string;
  badgeClass: string;
} {
  if (temp > 31) return { label: "Warning",  badgeClass: "bg-orange-100 text-orange-700 border-orange-200" };
  if (temp < 26) return { label: "Dingin",   badgeClass: "bg-blue-100 text-blue-700 border-blue-200" };
  return           { label: "Normal",   badgeClass: "bg-green-100 text-green-700 border-green-200" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

// ─────────────────────────────────────────────
// SKELETON ROW
// ─────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i}><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
      ))}
    </tr>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function RiwayatPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<SensorLog[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState("");
  const [filterDevice, setFilterDevice] = useState("all");

  // ── Fetch devices untuk dropdown filter
  useEffect(() => {
    fetch("/api/devices")
      .then((r) => r.json())
      .then((data: Device[]) => setDevices(data))
      .catch(console.error);
  }, []);

  // ── Fetch logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(filterDevice !== "all" && { deviceId: filterDevice }),
      });
      const res = await fetch(`/api/logs?${params}`);
      const data: LogsResponse = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Gagal fetch logs:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filterDevice]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset ke page 1 saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [filterDevice]);

  // ── Filter search di client (dari data yang sudah di-fetch)
  const filtered = logs.filter((log) =>
    search === "" ||
    log.deviceName.toLowerCase().includes(search.toLowerCase()) ||
    String(log.temperature).includes(search) ||
    String(log.humidity).includes(search)
  );

  // ── Export CSV
  const handleExport = () => {
    const header = ["Waktu", "Device", "Suhu (°C)", "Kelembapan (%)", "Status"];
    const rows = logs.map((l) => [
      formatDate(l.recordedAt),
      l.deviceName,
      l.temperature,
      l.humidity,
      getTempStatus(l.temperature).label,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riwayat-sensor-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto w-full">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Riwayat Log Sensor</h2>
          <p className="text-slate-500 text-sm mt-1">
            Data historis suhu dan kelembapan dari seluruh device Anda.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn btn-sm h-10 min-h-0 px-5 rounded-xl font-bold bg-slate-900 hover:bg-slate-700 text-white border-none flex items-center gap-2"
        >
          <FaDownload className="text-xs" /> Export CSV
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Log",      value: total,                                                          color: "border-slate-200",  icon: <FaFilter className="text-slate-400" /> },
          { label: "Total Device",   value: devices.length,                                                 color: "border-blue-200",   icon: <FaThermometerHalf className="text-blue-400" /> },
          { label: "Suhu Tertinggi", value: logs.length ? Math.max(...logs.map((l) => l.temperature)).toFixed(1) + "°C" : "--", color: "border-red-200",    icon: <FaThermometerHalf className="text-red-400" /> },
          { label: "Rata-rata Suhu", value: logs.length ? (logs.reduce((a, b) => a + b.temperature, 0) / logs.length).toFixed(1) + "°C" : "--", color: "border-green-200",  icon: <FaTint className="text-green-400" /> },
        ].map((card) => (
          <div key={card.label} className={`bg-white rounded-2xl border ${card.color} p-5 shadow-sm flex items-center gap-4`}>
            <div className="text-2xl">{card.icon}</div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama device, suhu, kelembapan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-8 rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-9"
            />
          </div>
          <select
            value={filterDevice}
            onChange={(e) => setFilterDevice(e.target.value)}
            className="select select-bordered select-xs rounded-lg bg-slate-50 border-slate-200 text-slate-600 h-9 min-h-0 text-xs focus:outline-none"
          >
            <option value="all">Semua Device</option>
            {devices.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Menampilkan <span className="font-bold text-slate-600">{filtered.length}</span> dari{" "}
          <span className="font-bold text-slate-600">{total}</span> total log
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th>Waktu</th>
                <th>Device</th>
                <th>Suhu (°C)</th>
                <th>Kelembapan (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                    Tidak ada data yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const status = getTempStatus(log.temperature);
                  return (
                    <tr key={log._id} className="hover:bg-slate-50/50">
                      <td className="font-mono text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(log.recordedAt)}
                      </td>
                      <td>
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                          {log.deviceName}
                        </span>
                      </td>
                      <td className={`font-semibold ${log.temperature > 31 ? "text-red-600" : "text-green-600"}`}>
                        {log.temperature.toFixed(1)}
                      </td>
                      <td className="text-slate-600">{log.humidity.toFixed(0)}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Halaman <span className="font-bold text-slate-700">{page}</span> dari{" "}
            <span className="font-bold text-slate-700">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-ghost btn-xs w-8 h-8 min-h-0 rounded-lg disabled:opacity-30"
            >
              <FaChevronLeft className="text-[10px]" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`btn btn-xs w-8 h-8 min-h-0 rounded-lg font-bold text-xs border-none ${
                  p === page ? "bg-slate-900 text-white" : "btn-ghost text-slate-600"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-ghost btn-xs w-8 h-8 min-h-0 rounded-lg disabled:opacity-30"
            >
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}