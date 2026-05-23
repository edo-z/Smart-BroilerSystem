"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaUpload, FaDownload, FaHistory, FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaMicrochip } from "react-icons/fa";

const API_BASE = "https://api.aldozeno.my.id";
const POLL_INTERVAL = 10000;

interface FirmwareMeta {
  version: string;
  filename: string;
  size: number;
  sha256: string;
  md5: string;
  notes: string;
  uploadedAt: string;
  downloadCount?: number;
  url?: string;
}

export default function FirmwarePage() {
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadKey, setUploadKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({ type: "", msg: "" });
  const [latest, setLatest] = useState<FirmwareMeta | null>(null);
  const [history, setHistory] = useState<FirmwareMeta[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchLatest = useCallback(async () => {
    try {
      const r = await fetch(API_BASE + "/api/firmware/latest");
      if (r.ok) setLatest(await r.json());
    } catch { /* ignore */ }
    setLoadingLatest(false);
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const r = await fetch(API_BASE + "/api/firmware/history");
      if (r.ok) setHistory(await r.json());
    } catch { /* ignore */ }
    setLoadingHistory(false);
  }, []);

  useEffect(() => { fetchLatest(); fetchHistory(); }, [fetchLatest, fetchHistory]);

  const validateVersion = (v: string) => /^\d+\.\d+\.\d+$/.test(v);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (!file) { setStatus({ type: "error", msg: "Pilih file .bin terlebih dahulu" }); return; }
    if (!file.name.endsWith(".bin")) { setStatus({ type: "error", msg: "File harus berekstensi .bin" }); return; }
    if (!validateVersion(version)) { setStatus({ type: "error", msg: "Format version harus x.y.z (contoh: 1.1.0)" }); return; }
    if (!uploadKey) { setStatus({ type: "error", msg: "Upload Key wajib diisi" }); return; }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("version", version);
      form.append("notes", notes);

      const r = await fetch(API_BASE + "/api/firmware/upload", {
        method: "POST",
        headers: { "X-Upload-Key": uploadKey },
        body: form,
      });

      const data = await r.json();
      if (r.ok) {
        setStatus({ type: "success", msg: `Firmware v${version} berhasil diupload! SHA256: ${data.sha256.substring(0, 16)}...` });
        setFile(null); setVersion(""); setNotes("");
        fetchLatest(); fetchHistory();
      } else {
        setStatus({ type: "error", msg: data.error || `Upload gagal (${r.status})` });
      }
    } catch (err: unknown) {
      setStatus({ type: "error", msg: "Network error: " + (err instanceof Error ? err.message : "unknown") });
    }
    setUploading(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 text-emerald-400">
            <FaMicrochip className="text-4xl" />
            <h1 className="text-3xl font-bold font-mono tracking-tight text-white">BROILERSMART FIRMWARE</h1>
          </div>
          <p className="text-sm text-slate-400 font-mono">Over-the-Air Update System &mdash; ESP32-S3</p>
        </div>

        {/* Status Toast */}
        {status.type && (
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg border font-mono text-sm ${
            status.type === "success"
              ? "bg-emerald-900/40 border-emerald-700 text-emerald-300"
              : "bg-red-900/40 border-red-700 text-red-300"
          }`}>
            {status.type === "success" ? <FaCheckCircle className="shrink-0" /> : <FaExclamationTriangle className="shrink-0" />}
            {status.msg}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Upload Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm uppercase tracking-wider">
              <FaUpload />
              Upload Firmware
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">File .merged.bin</label>
                <input type="file" accept=".bin" onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-mono file:bg-slate-800 file:text-emerald-300 hover:file:bg-slate-700 w-full text-sm font-mono text-slate-400" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Version (x.y.z)</label>
                <input type="text" value={version} onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.1.0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-600" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  placeholder="Deskripsi perubahan firmware ini"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-600 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <FaShieldAlt className="text-emerald-500" />
                  Upload Key
                </label>
                <input type="password" value={uploadKey} onChange={(e) => setUploadKey(e.target.value)}
                  placeholder="Masukkan upload key"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-600" />
              </div>

              <button type="submit" disabled={uploading}
                className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-mono text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                {uploading ? (
                  <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                ) : (
                  <><FaUpload /> Upload Firmware</>
                )}
              </button>
            </form>
          </div>

          {/* Latest Firmware */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm uppercase tracking-wider">
              <FaDownload />
              Latest Firmware
            </div>

            {loadingLatest ? (
              <div className="text-sm font-mono text-slate-500 animate-pulse">Loading...</div>
            ) : latest ? (
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold font-mono text-white">v{latest.version}</span>
                  <span className="text-xs font-mono text-slate-500">{formatSize(latest.size)}</span>
                </div>
                {latest.notes && <p className="text-sm text-slate-400">{latest.notes}</p>}
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex gap-2">
                    <span className="text-slate-500 shrink-0">MD5:</span>
                    <span className="text-slate-400 truncate">{latest.md5}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 shrink-0">SHA256:</span>
                    <span className="text-slate-400 truncate">{latest.sha256}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 shrink-0">Uploaded:</span>
                    <span className="text-slate-400">{new Date(latest.uploadedAt).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm font-mono text-slate-500">Belum ada firmware diupload</div>
            )}
          </div>
        </div>

        {/* Upload History */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm uppercase tracking-wider">
            <FaHistory />
            Upload History
          </div>

          {loadingHistory ? (
            <div className="text-sm font-mono text-slate-500 animate-pulse">Loading...</div>
          ) : history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="pb-3 pr-4">Version</th>
                    <th className="pb-3 pr-4">Size</th>
                    <th className="pb-3 pr-4 hidden md:table-cell">MD5</th>
                    <th className="pb-3 pr-4">Uploaded</th>
                    <th className="pb-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((fw) => (
                    <tr key={fw.version} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-semibold text-white">v{fw.version}</td>
                      <td className="py-3 pr-4 text-slate-400">{formatSize(fw.size)}</td>
                      <td className="py-3 pr-4 text-slate-500 hidden md:table-cell font-mono text-xs">{fw.md5.substring(0, 12)}...</td>
                      <td className="py-3 pr-4 text-slate-400 text-xs">{new Date(fw.uploadedAt).toLocaleDateString("id-ID")}</td>
                      <td className="py-3 text-slate-400 text-xs max-w-[200px] truncate">{fw.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm font-mono text-slate-500">Belum ada riwayat upload</div>
          )}
        </div>

      </div>
    </div>
  );
}
