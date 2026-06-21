"use client";

import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaTrash,
  FaPlus,
  FaQrcode,
  FaCopy,
  FaTimes,
  FaPencilAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import mqtt from "mqtt";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Device {
  _id: string;
  name: string;
  capacity: number;
  currentPopulation?: number;
  active: boolean;
  claimed: boolean;
  claimCode: string;
  harvestTargetDate?: string | null;
  harvestProcessed?: boolean;
  docDate?: string | null;
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-slate-900" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─────────────────────────────────────────────
// EDIT DEVICE MODAL
// ─────────────────────────────────────────────
function EditDeviceModal({
  target,
  name,
  capacity,
  population,
  harvestDate,
  docDate,
  loading,
  onNameChange,
  onCapacityChange,
  onPopulationChange,
  onHarvestDateChange,
  onDocDateChange,
  onConfirm,
  onClose,
}: {
  target: Device | null;
  name: string;
  capacity: string;
  population: string;
  harvestDate: string;
  docDate: string;
  loading: boolean;
  onNameChange: (v: string) => void;
  onCapacityChange: (v: string) => void;
  onPopulationChange: (v: string) => void;
  onHarvestDateChange: (v: string) => void;
  onDocDateChange: (v: string) => void;
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
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300" />
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FaCog className="text-blue-400 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Edit Kandang</h3>
              <p className="text-xs text-slate-400 mt-0.5">Perbarui data kandang dan target siklus.</p>
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
        <div className="px-6 pt-4 pb-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Kandang</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kapasitas (ekor)</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => onCapacityChange(e.target.value)}
              className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ayam Masuk (ekor)</label>
            <input
              type="number"
              value={population}
              onChange={(e) => onPopulationChange(e.target.value)}
              placeholder="0"
              className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Panen</label>
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => onHarvestDateChange(e.target.value)}
              className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal DOC</label>
            <input
              type="date"
              value={docDate}
              onChange={(e) => onDocDateChange(e.target.value)}
              className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
            />
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
            disabled={loading || !name || !capacity}
            className="btn btn-sm flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 border-none text-white font-bold"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DELETE CONFIRM MODAL
// ─────────────────────────────────────────────
function DeleteDeviceModal({
  target,
  loading,
  onConfirm,
  onClose,
}: {
  target: Device | null;
  loading: boolean;
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
              <h3 className="text-lg font-bold text-slate-900">Hapus Kandang</h3>
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
            Apakah Anda yakin ingin menghapus kandang berikut?
          </div>
          <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Nama</span>
              <span className="font-semibold text-slate-800">{target.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kapasitas</span>
              <span className="font-semibold text-slate-800">{target.capacity.toLocaleString()} ekor</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className={target.active ? "text-emerald-600 font-semibold" : "text-slate-400 font-semibold"}>
                {target.active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Koneksi</span>
              <span className={target.claimed ? "text-emerald-600 font-semibold" : "text-orange-500 font-semibold"}>
                {target.claimed ? "Terhubung" : "Belum Terhubung"}
              </span>
            </div>
            {target.claimCode && (
              <div className="flex justify-between">
                <span className="text-slate-400">Claim Code</span>
                <span className="font-mono font-bold text-slate-800 text-[11px] tracking-wider">{target.claimCode}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Dibuat</span>
              <span className="text-slate-600">
                {new Date(target.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </span>
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
            disabled={loading}
            className="btn btn-sm flex-1 rounded-xl bg-red-600 hover:bg-red-700 border-none text-white font-bold"
          >
            {loading ? "Menghapus..." : "Hapus Kandang"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOG AKTIVITAS MODAL
// ─────────────────────────────────────────────
interface LogEntry {
  _id: string;
  action: string;
  field?: string;
  fieldLabel?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
  version?: string;
  notes?: string;
  timestamp: string;
}

const filterLabels: Record<string, string> = {
  all: "Semua",
  config: "Konfigurasi",
  ota: "OTA",
};

function LogAktivitasModal({
  target,
  onClose,
}: {
  target: Device | null;
  onClose: () => void;
}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "config" | "ota">("all");

  useEffect(() => {
    if (!target) return;
    setLoading(true);
    setLogs([]);
    fetch(`/api/devices/${target._id}/logs`)
      .then((r) => r.json())
      .then((data) => setLogs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [target]);

  if (!target) return null;

  const filteredLogs = logs.filter((l) => {
    if (filter === "all") return true;
    if (filter === "config") return l.action === "update";
    if (filter === "ota") return l.action === "ota";
    return true;
  });

  const fmtDate = (ts: string) => {
    const d = new Date(ts);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

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
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300" />
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FaCog className="text-blue-400 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Aktivitas Kandang</h3>
              <p className="text-xs text-slate-400 mt-0.5">{target.name}</p>
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

        {/* Filter tabs */}
        <div className="flex gap-1 px-6 pt-4 pb-2">
          {(["all", "config", "ota"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        <div className="px-6 pt-2 pb-6 max-h-[55vh] overflow-y-auto">
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-40 bg-slate-100 rounded" />
                    <div className="h-2 w-24 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              {filter === "all" ? "Belum ada aktivitas untuk kandang ini." : "Tidak ada aktivitas dengan filter ini."}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    log.action === "ota" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {log.action === "ota" ? "⬆" : "✎"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-700">{log.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{fmtDate(log.timestamp)}</p>
                  </div>
                  {log.action === "ota" && log.version && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 shrink-0">
                      v{log.version}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="btn btn-sm bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl w-full"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function SettingsPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceLoading, setDeviceLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const [qrDevice, setQrDevice] = useState<Device | null>(null);

  const [editTarget, setEditTarget] = useState<Device | null>(null);
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const [editPopulation, setEditPopulation] = useState("");
  const [editHarvestDate, setEditHarvestDate] = useState("");
  const [editDocDate, setEditDocDate] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Device | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [logTarget, setLogTarget] = useState<Device | null>(null);

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
        prev.map((d) =>
          d._id === device._id ? { ...d, active: !d.active } : d
        )
      );
    } catch (err) {
      console.error("Gagal update device:", err);
    }
  };

  // ── Edit device
  const handleClickEdit = (device: Device) => {
    setEditTarget(device);
    setEditName(device.name);
    setEditCapacity(String(device.capacity));
    setEditPopulation(device.currentPopulation != null ? String(device.currentPopulation) : "");
    setEditHarvestDate(device.harvestTargetDate ? device.harvestTargetDate.slice(0, 10) : "");
    setEditDocDate(device.docDate ? device.docDate.slice(0, 10) : "");
  };

  const handleConfirmEdit = async () => {
    if (!editTarget || !editName || !editCapacity) return;
    setEditLoading(true);
    try {
      const body: Record<string, unknown> = {
        name: editName,
        capacity: Number(editCapacity),
      };
      if (editPopulation) body.currentPopulation = Number(editPopulation);
      if (editHarvestDate) body.harvestTargetDate = editHarvestDate;
      else body.harvestTargetDate = null;
      if (editDocDate) body.docDate = editDocDate;
      else body.docDate = null;

      await fetch(`/api/devices/${editTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setDevices((prev) =>
        prev.map((d) =>
          d._id === editTarget._id
            ? {
                ...d,
                name: editName,
                capacity: Number(editCapacity),
                currentPopulation: editPopulation ? Number(editPopulation) : 0,
                harvestTargetDate: editHarvestDate || null,
                docDate: editDocDate || null,
              }
            : d
        )
      );
      setEditTarget(null);

      // ── Kirim DOC date ke ESP32 via MQTT ──
      if (editDocDate) {
        const [y, m, d] = editDocDate.split("-").map(Number);
        const mqttClient = mqtt.connect("wss://mqtt.aldozeno.my.id:443/mqtt", {
          username: "admin",
          password: "ewaldo12345",
          clientId: "pengaturan-" + Math.random().toString(36).substring(2, 10),
          clean: true,
        });
        mqttClient.on("connect", () => {
          mqttClient.publish(
            `device/${editTarget._id}/cmd`,
            JSON.stringify({ type: "setdoc", year: y, month: m, day: d }),
            { qos: 1 },
            () => mqttClient.end()
          );
        });
        mqttClient.on("error", () => mqttClient.end());
      }
    } catch (err) {
      console.error("Gagal update device:", err);
    } finally {
      setEditLoading(false);
    }
  };

  // ── Hapus device
  const handleClickDelete = (device: Device) => setDeleteTarget(device);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await fetch(`/api/devices/${deleteTarget._id}`, { method: "DELETE" });
      setDevices((prev) => prev.filter((d) => d._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Gagal hapus device:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen Kandang</h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola daftar kandang dan perangkat ESP32.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-sm h-10 min-h-0 px-5 rounded-xl font-bold bg-slate-900 hover:bg-slate-700 text-white border-none flex items-center gap-2"
        >
          <FaPlus className="text-xs" /> Tambah Kandang
        </button>
      </div>

      {/* Modal Tambah Kandang */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Tambah Kandang Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Nama Kandang
                </label>
                <input
                  type="text"
                  placeholder="contoh: Kandang A1"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input input-bordered w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Kapasitas (ekor)
                </label>
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
              <h3 className="font-bold text-slate-800">
                QR Code — {qrDevice.name}
              </h3>
              <button
                onClick={() => setQrDevice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl">
                <QRCodeSVG
                  value={qrDevice.claimCode}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="M"
                />
              </div>

              <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Claim Code
                  </p>
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
                Flash kode ini ke ESP32 Anda. Kode hanya bisa digunakan{" "}
                <span className="font-bold text-slate-600">satu kali</span>.
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
        {deviceLoading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 animate-pulse"
              >
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
            Belum ada kandang. Klik "Tambah Kandang" untuk mulai.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {devices.map((device) => (
              <div
                key={device._id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                    <FaCog className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{device.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-400">
                        Ayam: {(device.currentPopulation ?? 0).toLocaleString()} / {device.capacity.toLocaleString()} ekor
                      </p>
                      {device.harvestTargetDate && !device.harvestProcessed && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-semibold">
                          Panen: {new Date(device.harvestTargetDate).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short"
                          })}
                        </span>
                      )}
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
                    onClick={() => handleClickEdit(device)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                    title="Edit kandang"
                  >
                    <FaPencilAlt className="text-xs" />
                  </button>
                  <button
                    onClick={() => setLogTarget(device)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                    title="Aktivitas kandang"
                  >
                    <FaCog className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleClickDelete(device)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus kandang"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditDeviceModal
        target={editTarget}
        name={editName}
        capacity={editCapacity}
        population={editPopulation}
        harvestDate={editHarvestDate}
        docDate={editDocDate}
        loading={editLoading}
        onNameChange={setEditName}
        onCapacityChange={setEditCapacity}
        onPopulationChange={setEditPopulation}
        onHarvestDateChange={setEditHarvestDate}
        onDocDateChange={setEditDocDate}
        onConfirm={handleConfirmEdit}
        onClose={() => setEditTarget(null)}
      />
      <DeleteDeviceModal
        target={deleteTarget}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
      <LogAktivitasModal
        target={logTarget}
        onClose={() => setLogTarget(null)}
      />
    </div>
  );
}
