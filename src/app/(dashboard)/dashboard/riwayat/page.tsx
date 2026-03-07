"use client";

import React, { useState, useMemo } from "react";
import {
  FaExclamationTriangle,
  FaBell,
  FaCog,
  FaThermometerHalf,
  FaTint,
  FaSearch,
  FaDownload,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";

// ==================== DATA DUMMY ====================
type LogEntry = {
  id: number;
  timestamp: string;
  kandang: string;
  type: "critical" | "warning" | "info" | "normal";
  category: "suhu" | "kelembapan" | "sistem" | "maintenance";
  message: string;
  value?: string;
  resolved: boolean;
};

const RAW_LOGS: LogEntry[] = [
  { id: 1,  timestamp: "2025-03-05 23:45:12", kandang: "A1", type: "critical", category: "suhu",        message: "Suhu melebihi batas maksimum (32.4°C)",         value: "32.4°C", resolved: true  },
  { id: 2,  timestamp: "2025-03-05 22:10:08", kandang: "A2", type: "warning",  category: "kelembapan",  message: "Kelembapan mendekati batas bawah (57%)",        value: "57%",    resolved: true  },
  { id: 3,  timestamp: "2025-03-05 21:00:00", kandang: "A1", type: "info",     category: "sistem",      message: "Kipas otomatis aktif karena suhu tinggi",       value: "-",      resolved: true  },
  { id: 4,  timestamp: "2025-03-05 19:30:00", kandang: "A2", type: "normal",   category: "suhu",        message: "Suhu kembali normal (28.5°C)",                  value: "28.5°C", resolved: true  },
  { id: 5,  timestamp: "2025-03-05 18:00:00", kandang: "B1", type: "info",     category: "maintenance", message: "Kalibrasi sensor dijadwalkan",                  value: "-",      resolved: false },
  { id: 6,  timestamp: "2025-03-05 16:45:33", kandang: "A1", type: "warning",  category: "suhu",        message: "Suhu naik cepat dalam 10 menit (+2.3°C)",       value: "30.8°C", resolved: true  },
  { id: 7,  timestamp: "2025-03-05 15:00:00", kandang: "A2", type: "info",     category: "sistem",      message: "Perubahan target suhu fase 2 (→28°C)",          value: "28°C",   resolved: true  },
  { id: 8,  timestamp: "2025-03-05 12:00:00", kandang: "A1", type: "normal",   category: "kelembapan",  message: "Kelembapan stabil dalam rentang ideal (63%)",   value: "63%",    resolved: true  },
  { id: 9,  timestamp: "2025-03-05 09:15:00", kandang: "B1", type: "critical", category: "sistem",      message: "Koneksi sensor B1 terputus selama 5 menit",     value: "-",      resolved: true  },
  { id: 10, timestamp: "2025-03-05 08:00:00", kandang: "A2", type: "info",     category: "maintenance", message: "Pengecekan rutin harian selesai",                value: "-",      resolved: true  },
  { id: 11, timestamp: "2025-03-04 23:00:00", kandang: "A1", type: "warning",  category: "kelembapan",  message: "Kelembapan di atas batas (76%)",                value: "76%",    resolved: true  },
  { id: 12, timestamp: "2025-03-04 20:00:00", kandang: "A2", type: "normal",   category: "suhu",        message: "Suhu malam normal (27.8°C)",                    value: "27.8°C", resolved: true  },
  { id: 13, timestamp: "2025-03-04 17:30:00", kandang: "A1", type: "critical", category: "suhu",        message: "Suhu ekstrem terdeteksi (34.1°C)",              value: "34.1°C", resolved: true  },
  { id: 14, timestamp: "2025-03-04 14:00:00", kandang: "B1", type: "info",     category: "maintenance", message: "Baterai backup sensor B1 diganti",              value: "-",      resolved: true  },
  { id: 15, timestamp: "2025-03-04 10:30:00", kandang: "A1", type: "warning",  category: "suhu",        message: "Suhu sedikit di atas target (30.2°C)",          value: "30.2°C", resolved: true  },
];

const ITEMS_PER_PAGE = 8;

// ==================== HELPERS ====================
const typeConfig: Record<LogEntry["type"], { label: string; badgeClass: string; icon: React.ReactNode }> = {
  critical: { label: "Critical",  badgeClass: "bg-red-100 text-red-700 border-red-200",        icon: <FaExclamationTriangle /> },
  warning:  { label: "Warning",   badgeClass: "bg-orange-100 text-orange-700 border-orange-200", icon: <FaExclamationTriangle /> },
  info:     { label: "Info",      badgeClass: "bg-blue-100 text-blue-700 border-blue-200",      icon: <FaInfoCircle /> },
  normal:   { label: "Normal",    badgeClass: "bg-green-100 text-green-700 border-green-200",   icon: <FaCheckCircle /> },
};

const categoryIcon: Record<LogEntry["category"], React.ReactNode> = {
  suhu:        <FaThermometerHalf className="text-red-400" />,
  kelembapan:  <FaTint className="text-blue-400" />,
  sistem:      <FaWifi className="text-slate-400" />,
  maintenance: <FaCog className="text-slate-400" />,
};

function FaWifi(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" className={props.className}>
      <path d="M1 9l2 2c5.52-5.52 14.48-5.52 20 0l2-2C18.46 2.38 5.54 2.38 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
    </svg>
  );
}

// ==================== SUMMARY CARDS ====================
function SummaryCard({ label, count, color, icon }: { label: string; count: number; color: string; icon: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-2xl border ${color} p-5 shadow-sm flex items-center gap-4`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{count}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE ====================
export default function LogHistoryPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterKandang, setFilterKandang] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return RAW_LOGS.filter((log) => {
      const matchSearch =
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.kandang.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || log.type === filterType;
      const matchKandang = filterKandang === "all" || log.kandang === filterKandang;
      const matchCategory = filterCategory === "all" || log.category === filterCategory;
      return matchSearch && matchType && matchKandang && matchCategory;
    });
  }, [search, filterType, filterKandang, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const counts = useMemo(() => ({
    critical: RAW_LOGS.filter((l) => l.type === "critical").length,
    warning:  RAW_LOGS.filter((l) => l.type === "warning").length,
    info:     RAW_LOGS.filter((l) => l.type === "info").length,
    normal:   RAW_LOGS.filter((l) => l.type === "normal").length,
  }), []);

  return (
    <div className="max-w-7xl mx-auto w-full">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Riwayat Log</h2>
          <p className="text-slate-500 text-sm mt-1">
            Rekam jejak seluruh aktivitas dan peringatan sistem monitoring.
          </p>
        </div>
        <button className="btn btn-sm h-10 min-h-0 px-5 rounded-xl font-bold bg-slate-900 hover:bg-slate-700 text-white border-none flex items-center gap-2">
          <FaDownload className="text-xs" /> Export CSV
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Critical Alert" count={counts.critical} color="border-red-200"    icon={<FaExclamationTriangle className="text-red-500" />} />
        <SummaryCard label="Warning"        count={counts.warning}  color="border-orange-200" icon={<FaBell className="text-orange-500" />} />
        <SummaryCard label="Info"           count={counts.info}     color="border-blue-200"   icon={<FaInfoCircle className="text-blue-500" />} />
        <SummaryCard label="Normal"         count={counts.normal}   color="border-green-200"  icon={<FaCheckCircle className="text-green-500" />} />
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Cari log berdasarkan pesan atau kandang..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input input-bordered w-full pl-8 rounded-xl text-sm bg-slate-50 border-slate-200 focus:outline-none h-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <FaFilter className="text-slate-400 text-xs shrink-0" />
            {[
              { value: filterType,     options: ["all","critical","warning","info","normal"], labels: ["Semua Tipe","Critical","Warning","Info","Normal"],       setter: (v: string) => { setFilterType(v); setPage(1); } },
              { value: filterKandang,  options: ["all","A1","A2","B1"],                       labels: ["Semua Kandang","Kandang A1","Kandang A2","Kandang B1"],  setter: (v: string) => { setFilterKandang(v); setPage(1); } },
              { value: filterCategory, options: ["all","suhu","kelembapan","sistem","maintenance"], labels: ["Semua Kategori","Suhu","Kelembapan","Sistem","Maintenance"], setter: (v: string) => { setFilterCategory(v); setPage(1); } },
            ].map((f, i) => (
              <select
                key={i}
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                className="select select-bordered select-xs rounded-lg bg-slate-50 border-slate-200 text-slate-600 h-9 min-h-0 text-xs focus:outline-none pr-6"
              >
                {f.options.map((opt, j) => (
                  <option key={opt} value={opt}>{f.labels[j]}</option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-400">
          Menampilkan <span className="font-bold text-slate-600">{filtered.length}</span> dari {RAW_LOGS.length} entri log
        </div>
      </div>

      {/* LOG TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="w-40">Waktu</th>
                <th className="w-24">Kandang</th>
                <th className="w-20">Kategori</th>
                <th>Pesan</th>
                <th className="w-24">Nilai</th>
                <th className="w-24">Tipe</th>
                <th className="w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    Tidak ada log yang sesuai filter.
                  </td>
                </tr>
              ) : (
                paginated.map((log) => {
                  const tc = typeConfig[log.type];
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="font-mono text-xs text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td>
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                          {log.kandang}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          {categoryIcon[log.category]}
                          <span className="capitalize">{log.category}</span>
                        </div>
                      </td>
                      <td className="text-slate-700 text-xs leading-relaxed max-w-xs">{log.message}</td>
                      <td className="font-mono text-xs font-semibold text-slate-600">{log.value || "—"}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${tc.badgeClass}`}>
                          <span className="text-[8px]">{tc.icon}</span>
                          {tc.label}
                        </span>
                      </td>
                      <td className="text-center">
                        {log.resolved ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600">
                            <FaCheckCircle /> Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500">
                            <FaTimesCircle /> Pending
                          </span>
                        )}
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
            Halaman <span className="font-bold text-slate-700">{currentPage}</span> dari{" "}
            <span className="font-bold text-slate-700">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-ghost btn-xs w-8 h-8 min-h-0 rounded-lg disabled:opacity-30"
            >
              <FaChevronLeft className="text-[10px]" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`btn btn-xs w-8 h-8 min-h-0 rounded-lg font-bold text-xs border-none ${
                  p === currentPage ? "bg-slate-900 text-white" : "btn-ghost text-slate-600"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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