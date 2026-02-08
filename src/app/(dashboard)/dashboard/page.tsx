"use client";

import React from "react";
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
} from "chart.js";
import { useSession } from "next-auth/react";

// Register Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  // === DATA GRAFIK SIMULASI ===
  const chartData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
    datasets: [
      {
        label: "Suhu (°C)",
        data: [28, 27.5, 29, 31, 30.5, 29.5, 28.5],
        borderColor: "#ef4444", // Red-500
        backgroundColor: (context: any) => {
          const ctx = context.chart?.ctx;
          if (!ctx) return "rgba(239, 68, 68, 0.1)";
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(239, 68, 68, 0.4)");
          gradient.addColorStop(1, "rgba(239, 68, 68, 0)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
      },
      {
        label: "Kelembapan (%)",
        data: [60, 62, 65, 58, 62, 65, 63],
        borderColor: "#3b82f6", // Blue-500
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
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
        // Fix untuk error Chart.js v4 terbaru:
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

  // Karena user data sudah diambil di Layout (Server Side),
  // kita tidak perlu 'useSession' lagi di sini kecuali untuk data real-time.
  // Tapi untuk greeting sederhana, kita pakai dummy string dulu atau ambil dari Client State.
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "Peternak Cerdas";

  return (
    <div className="max-w-7xl mx-auto w-full">
      
      {/* HEADER / GREETING */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Halo, {userName}! 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Berikut adalah ringkasan performa kandang Anda hari ini.
          </p>
        </div>
        <div className="badge badge-success badge-outline gap-2 px-4 py-3 font-medium border-green-200 text-green-700 bg-green-50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Sistem Normal
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Kandang */}
        <div className="stat bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="stat-figure text-slate-400">
            <div className="p-3 bg-slate-100 rounded-lg"><FaHome className="text-xl" /></div>
          </div>
          <div className="stat-title text-xs font-bold uppercase text-slate-500">Total Kandang</div>
          <div className="stat-value text-3xl text-slate-900 mt-2">3</div>
          <div className="stat-desc text-xs text-slate-400 mt-1">1 Aktif, 2 Standby</div>
        </div>

        {/* Suhu */}
        <div className="stat bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="stat-figure text-red-500">
            <div className="p-3 bg-red-50 rounded-lg"><FaThermometerHalf className="text-xl" /></div>
          </div>
          <div className="stat-title text-xs font-bold uppercase text-slate-500">Rata-rata Suhu</div>
          <div className="stat-value text-3xl text-slate-900 mt-2">
            29<span className="text-lg text-slate-500 font-normal">°C</span>
          </div>
          <div className="stat-desc text-xs text-green-500 font-medium mt-1 flex items-center gap-1">
            <span>▲</span> Normal (Target 28°C)
          </div>
        </div>

        {/* Kelembapan */}
        <div className="stat bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="stat-figure text-blue-500">
            <div className="p-3 bg-blue-50 rounded-lg"><FaTint className="text-xl" /></div>
          </div>
          <div className="stat-title text-xs font-bold uppercase text-slate-500">Kelembapan</div>
          <div className="stat-value text-3xl text-slate-900 mt-2">
            62<span className="text-lg text-slate-500 font-normal">%</span>
          </div>
          <div className="stat-desc text-xs text-slate-400 mt-1">Rentang Ideal 60-70%</div>
        </div>

        {/* Alerts */}
        <div className="stat bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="stat-figure text-orange-500">
            <div className="p-3 bg-orange-50 rounded-lg"><FaExclamationTriangle className="text-xl" /></div>
          </div>
          <div className="stat-title text-xs font-bold uppercase text-slate-500">Alerts</div>
          <div className="stat-value text-3xl text-slate-900 mt-2">1</div>
          <div className="stat-desc text-xs text-red-500 font-medium mt-1">1 Critical Alert</div>
        </div>
      </div>

      {/* CHART & ALERTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Monitoring 24 Jam Terakhir</h3>
            <select className="select select-bordered select-xs rounded-full w-32 bg-slate-50 border-slate-200 text-slate-600 focus:outline-none">
              <option>Hari Ini</option>
              <option>Kemarin</option>
              <option>7 Hari</option>
            </select>
          </div>
          <div className="relative h-[350px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Alerts List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Peringatan Terkini</h3>
          
          <div className="flex flex-col gap-4 flex-1">
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 transition-transform hover:scale-[1.02]">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-red-700">Suhu Tinggi</h4>
                    <span className="text-[10px] text-slate-400 font-mono">10m lalu</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Kandang A1 mencapai 32°C. Kipas aktif pendinginkan.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 transition-transform hover:scale-[1.02]">
              <div className="flex items-start gap-3">
                <FaBell className="text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-blue-700">Target Suhu Turun</h4>
                    <span className="text-[10px] text-slate-400 font-mono">1j lalu</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Ayam fase 2. Target suhu menurun ke 28°C.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 transition-transform hover:scale-[1.02]">
              <div className="flex items-start gap-3">
                <FaCog className="text-slate-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-700">Maintenance</h4>
                    <span className="text-[10px] text-slate-400 font-mono">3j lalu</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sensor Kandang B perlu dikalibrasi ulang.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-sm btn-outline w-full mt-6 text-xs font-bold border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-300">
            Lihat Semua Log
          </button>
        </div>
      </div>

      {/* TABLE STATUS KANDANG */}
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
              <tr className="hover:bg-slate-50/50">
                <td className="font-bold text-slate-900">Kandang A1</td>
                <td>14 Hari</td>
                <td className="text-red-600 font-semibold">32.0</td>
                <td>65</td>
                <td>
                  <div className="badge badge-sm badge-warning bg-orange-100 text-orange-700 border-none gap-1 text-[10px] px-2 py-3">
                    Warning
                  </div>
                </td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10">
                    Detail
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="font-bold text-slate-900">Kandang A2</td>
                <td>21 Hari</td>
                <td className="text-green-600 font-semibold">28.5</td>
                <td>64</td>
                <td>
                  <div className="badge badge-sm badge-success bg-green-100 text-green-700 border-none gap-1 text-[10px] px-2 py-3">
                    Normal
                  </div>
                </td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10">
                    Detail
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="font-bold text-slate-900">Kandang B1</td>
                <td>-</td>
                <td className="text-slate-400 font-medium">--</td>
                <td>-</td>
                <td>
                  <div className="badge badge-sm badge-ghost bg-slate-100 text-slate-500 border-none gap-1 text-[10px] px-2 py-3">
                    Kosong
                  </div>
                </td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10">
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}