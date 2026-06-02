"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaThermometerHalf,
  FaTint,
  FaSearch,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getPhase, isTempSpike } from "@/lib/sensor";

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
  _id?: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  age: number;
  vfd: number;
  dimmer: number;
  timestamp: string;
  deviceName?: string;
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
function getTempStatus(temp: number, age: number): {
  label: string;
  badgeClass: string;
} {
  if (isTempSpike(age, temp)) return { label: "Warning", badgeClass: "bg-orange-100 text-orange-700 border-orange-200" };
  if (temp < getPhase(age).tempLow) return { label: "Dingin",   badgeClass: "bg-blue-100 text-blue-700 border-blue-200" };
  return { label: "Normal",   badgeClass: "bg-green-100 text-green-700 border-green-200" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  if (total > 1) pages.push(total);
  return pages;
}

// ─────────────────────────────────────────────
// SKELETON ROW
// ─────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i}><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
      ))}
    </tr>
  );
}

// ─────────────────────────────────────────────
// DELETE CONFIRM MODAL
// ─────────────────────────────────────────────
function DeleteLogModal({
  log,
  deviceName,
  deleting,
  onConfirm,
  onClose,
}: {
  log: SensorLog | null;
  deviceName: string;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!log) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white overflow-hidden"
        style={{
          boxShadow:
            "0 32px 64px -12px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)",
        }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-400 to-red-300" />
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <FaExclamationTriangle className="text-red-400 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Hapus Log</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs w-8 h-8 min-h-0 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <FaTimes />
          </button>
        </div>
        <div className="h-px bg-slate-100 mx-6" />
        <div className="px-6 pt-4 pb-4 space-y-2">
          <div className="text-sm text-slate-600">
            Apakah Anda yakin ingin menghapus log berikut?
          </div>
          <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Device</span>
              <span className="font-semibold text-slate-800">{deviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Waktu</span>
              <span className="font-semibold text-slate-800">{formatDate(log.timestamp)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Suhu</span>
              <span className="font-semibold text-slate-800">{log.temperature.toFixed(1)} °C</span>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-2">
          <button
            onClick={onClose}
            className="btn btn-sm flex-1 rounded-xl border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="btn btn-sm flex-1 rounded-xl bg-red-600 hover:bg-red-700 border-none text-white font-bold"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BULK DELETE CONFIRM MODAL
// ─────────────────────────────────────────────
function BulkDeleteModal({
  target,
  logCount,
  deleting,
  onConfirm,
  onClose,
}: {
  target: { deviceId: string; deviceName: string } | null;
  logCount: number;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!target) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white overflow-hidden"
        style={{
          boxShadow:
            "0 32px 64px -12px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)",
        }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-400 to-red-300" />
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <FaExclamationTriangle className="text-red-400 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Hapus Semua Data</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs w-8 h-8 min-h-0 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <FaTimes />
          </button>
        </div>
        <div className="h-px bg-slate-100 mx-6" />
        <div className="px-6 pt-4 pb-4 space-y-2">
          <div className="text-sm text-slate-600">
            Apakah Anda yakin ingin menghapus <span className="font-bold">{logCount}</span> log untuk:
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Device</span>
              <span className="font-semibold text-slate-800">{target.deviceName}</span>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-2">
          <button
            onClick={onClose}
            className="btn btn-sm flex-1 rounded-xl border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="btn btn-sm flex-1 rounded-xl bg-red-600 hover:bg-red-700 border-none text-white font-bold"
          >
            {deleting ? "Menghapus..." : `Hapus ${logCount} Log`}
          </button>
        </div>
      </div>
    </div>
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
  const [deleteTarget, setDeleteTarget] = useState<SensorLog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkDeleteTarget, setBulkDeleteTarget] = useState<{ deviceId: string; deviceName: string } | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [filterDevice, setFilterDevice] = useState("all");

  // Lookup deviceId → device name
  const deviceMap = useMemo(() => {
    const map = new Map<string, string>();
    devices.forEach((d) => map.set(d._id, d.name));
    return map;
  }, [devices]);

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



  // ── Filter search di client (dari data yang sudah di-fetch)
  const filtered = logs.filter((log) =>
    search === "" ||
    log.deviceId.toLowerCase().includes(search.toLowerCase()) ||
    String(log.temperature).includes(search) ||
    String(log.humidity).includes(search)
  );

  // ── Delete log
  const handleDelete = useCallback(async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/logs/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus log");
      setDeleteTarget(null);
      fetchLogs();
    } catch (err) {
      console.error("Gagal hapus log:", err);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, fetchLogs]);

  // ── Bulk delete all logs for device
  const handleBulkDelete = useCallback(async () => {
    if (!bulkDeleteTarget?.deviceId) return;
    setBulkDeleting(true);
    try {
      const res = await fetch(`/api/logs?deviceId=${bulkDeleteTarget.deviceId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus semua log");
      setBulkDeleteTarget(null);
      fetchLogs();
    } catch (err) {
      console.error("Gagal hapus semua log:", err);
    } finally {
      setBulkDeleting(false);
    }
  }, [bulkDeleteTarget, fetchLogs]);

  // ── Export CSV
  const handleExport = () => {
    const header = ["Waktu", "Device", "Suhu (°C)", "Kelembapan (%)", "Umur (hari)", "VFD (%)", "Dimmer (%)", "Status"];
    const rows = logs.map((l) => [
      formatDate(l.timestamp),
      l.deviceId,
      l.temperature,
      l.humidity,
      l.age,
      l.vfd,
      l.dimmer,
      getTempStatus(l.temperature, l.age).label,
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
          <FaDownload className="text-xs" /> Export Halaman (CSV)
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
            onChange={(e) => { setPage(1); setFilterDevice(e.target.value); }}
            className="select select-bordered select-xs rounded-lg bg-slate-50 border-slate-200 text-slate-600 h-9 min-h-0 text-xs focus:outline-none"
          >
            <option value="all">Semua Device</option>
            {devices.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          {filterDevice !== "all" && (
            <button
              onClick={() => {
                const name = deviceMap.get(filterDevice) ?? filterDevice;
                setBulkDeleteTarget({ deviceId: filterDevice, deviceName: name });
              }}
              className="btn btn-sm h-9 min-h-0 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 font-bold text-xs flex items-center gap-1.5 shrink-0"
            >
              <FaTrash className="text-[10px]" /> Hapus Semua Data
            </button>
          )}
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Menampilkan <span className="font-bold text-slate-600">{filtered.length}</span> dari{" "}
          <span className="font-bold text-slate-600">{logs.length}</span> log (halaman ini)
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
                <th>Umur (hari)</th>
                <th>VFD (%)</th>
                <th>Dimmer (%)</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                    Tidak ada data yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const status = getTempStatus(log.temperature, log.age);
                  return (
                    <tr key={log._id || log.timestamp} className="hover:bg-slate-50/50">
                      <td className="font-mono text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td>
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                          {deviceMap.get(log.deviceId) ?? log.deviceId}
                        </span>
                      </td>
                      <td className={`font-semibold ${isTempSpike(log.age, log.temperature) ? "text-red-600" : "text-green-600"}`}>
                        {log.temperature.toFixed(1)}
                      </td>
                      <td className="text-slate-600">{log.humidity.toFixed(0)}</td>
                      <td className="text-slate-600">{log.age}</td>
                      <td className="text-slate-600">{log.vfd}</td>
                      <td className="text-slate-600">{log.dimmer}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setDeleteTarget(log)}
                          className="btn btn-ghost btn-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg w-8 h-8 min-h-0"
                          title="Hapus log"
                        >
                          <FaTrash className="text-xs" />
                        </button>
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
            {getPageRange(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`e${i}`} className="px-1 text-slate-300 text-xs">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`btn btn-xs w-8 h-8 min-h-0 rounded-lg font-bold text-xs border-none ${
                    p === page ? "bg-slate-900 text-white" : "btn-ghost text-slate-600"
                  }`}
                >
                  {p}
                </button>
              )
            )}
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

      <DeleteLogModal
        log={deleteTarget}
        deviceName={deleteTarget ? (deviceMap.get(deleteTarget.deviceId) ?? deleteTarget.deviceId) : ""}
        deleting={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
      <BulkDeleteModal
        target={bulkDeleteTarget}
        logCount={total}
        deleting={bulkDeleting}
        onConfirm={handleBulkDelete}
        onClose={() => setBulkDeleteTarget(null)}
      />
    </div>
  );
}