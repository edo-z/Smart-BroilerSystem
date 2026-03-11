"use client";
import { useState, useRef, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaFire, FaAdjust, FaFan } from "react-icons/fa";
import CountUp from "@/component/CountUp";
import GradientText from "@/component/GradientText";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "kurva" | "fase" | "humidity" | "biologis";

interface Tab {
    id: TabId;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    accent: string;
    accentRgb: string;
}

// ─── Tab Definitions ──────────────────────────────────────────────────────────
const tabs: Tab[] = [
    {
        id: "kurva",
        label: "Kurva Suhu",
        shortLabel: "01",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
        accent: "#3b82f6",
        accentRgb: "59,130,246",
    },
    {
        id: "fase",
        label: "Fase Pertumbuhan",
        shortLabel: "02",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="4" />
            </svg>
        ),
        accent: "#f97316",
        accentRgb: "249,115,22",
    },
    {
        id: "humidity",
        label: "Kelembapan",
        shortLabel: "03",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
        ),
        accent: "#6366f1",
        accentRgb: "99,102,241",
    },
    {
        id: "biologis",
        label: "Info Biologis",
        shortLabel: "04",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
            </svg>
        ),
        accent: "#10b981",
        accentRgb: "16,185,129",
    },
];

// ─── Chart Data ───────────────────────────────────────────────────────────────
const tempChartData = {
    labels: ["0 Hari", "7 Hari", "14 Hari", "21 Hari", "28 Hari", "32 Hari"],
    datasets: [
        {
            label: "Suhu Ideal (°C)",
            data: [34, 32.5, 29, 27, 24.5, 24],
            borderColor: "#3b82f6",
            backgroundColor: (context: any) => {
                const ctx = context.chart?.ctx;
                if (!ctx) return "rgba(59,130,246,0.2)";
                const g = ctx.createLinearGradient(0, 0, 0, 260);
                g.addColorStop(0, "rgba(59,130,246,0.45)");
                g.addColorStop(1, "rgba(59,130,246,0)");
                return g;
            },
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#0d1829",
            pointBorderColor: "#3b82f6",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
        },
    ],
};

const humidityChartData = {
    labels: ["0 Hari", "7 Hari", "14 Hari", "21 Hari", "28 Hari", "32 Hari"],
    datasets: [
        {
            label: "RH Ideal (%)",
            data: [70, 68, 65, 63, 62, 60],
            borderColor: "#6366f1",
            backgroundColor: (context: any) => {
                const ctx = context.chart?.ctx;
                if (!ctx) return "rgba(99,102,241,0.2)";
                const g = ctx.createLinearGradient(0, 0, 0, 260);
                g.addColorStop(0, "rgba(99,102,241,0.45)");
                g.addColorStop(1, "rgba(99,102,241,0)");
                return g;
            },
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#0d1829",
            pointBorderColor: "#6366f1",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
        },
    ],
};

function makeChartOptions(color: string, unit: string, min: number, max: number) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(13,24,41,0.96)",
                titleFont: { size: 12 },
                bodyFont: { size: 13 },
                padding: 12,
                displayColors: false,
                borderColor: `rgba(${color},0.25)`,
                borderWidth: 1,
                callbacks: {
                    label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}${unit}`,
                },
            },
        },
        scales: {
            y: {
                min, max,
                grid: { color: "rgba(255,255,255,0.04)" },
                ticks: { color: "#475569", font: { size: 11 }, callback: (v: any) => v + unit },
                border: { color: "transparent" },
            },
            x: {
                grid: { display: false },
                ticks: { color: "#475569", font: { size: 11 } },
                border: { color: "rgba(255,255,255,0.06)" },
            },
        },
    };
}

// ─── Tab Content Components ───────────────────────────────────────────────────

function KurvaSuhu() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                        Target Suhu Kandang
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                        Hari 0 — 32
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 2, background: "#3b82f6", borderRadius: 2 }} />
                    <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#475569" }}>Suhu Ideal (°C)</span>
                </div>
            </div>

            {/* Chart */}
            <div style={{
                background: "#0a1628",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: "24px 20px 16px",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: 0, right: 0,
                    width: 160, height: 160,
                    background: "radial-gradient(circle at top right, rgba(59,130,246,0.07), transparent 70%)",
                    pointerEvents: "none",
                }} />
                <div style={{ height: 260 }}>
                    <Line data={tempChartData} options={makeChartOptions("59,130,246", "°C", 20, 36) as any} />
                </div>
            </div>

            {/* Stat Strip */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                background: "#0a1628",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 14,
                overflow: "hidden",
            }}>
                {[
                    { label: "Suhu Awal", value: "34°C", sub: "Hari ke-0" },
                    { label: "Suhu Akhir", value: "24°C", sub: "Hari ke-32" },
                    { label: "Penurunan", value: "−10°C", sub: "Total Rentang" },
                ].map((s, i) => (
                    <div key={s.label} style={{
                        padding: "16px 18px",
                        borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}>
                        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{s.value}</div>
                        <div style={{ fontSize: "11px", color: "#334155", marginTop: 2 }}>{s.sub}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FasePertumbuhan() {
    const phases = [
        {
            id: "PHASE 01", range: "0–14 hari", name: "Brooding",
            desc: "Fase pemanas kritis. Anak ayam belum mampu mengatur suhu tubuh sendiri — brooder harus menjaga suhu stabil di zona termal optimal.",
            temp: 34, color: "#f97316", colorRgb: "249,115,22",
            icon: <FaFire style={{ color: "#f97316", fontSize: 11 }} />,
            fill: "100%",
            details: ["Suhu brooder: 32–34°C", "Kelembapan: 65–70%", "Ventilasi minimal", "Litter kering & bersih"],
        },
        {
            id: "PHASE 02", range: "15–25 hari", name: "Transition",
            desc: "Ayam mulai menghasilkan panas metabolisme sendiri. Suhu diturunkan secara progresif 0.5°C per hari untuk adaptasi bertahap.",
            temp: 28, color: "#3b82f6", colorRgb: "59,130,246",
            icon: <FaAdjust style={{ color: "#3b82f6", fontSize: 11 }} />,
            fill: "60%",
            details: ["Suhu target: 26–28°C", "Kelembapan: 60–65%", "Ventilasi sedang", "Pantau FCR harian"],
        },
        {
            id: "PHASE 03", range: "26–32 hari", name: "Finisher",
            desc: "Kipas aktif membuang akumulasi panas metabolisme. Ventilasi optimal kunci FCR terbaik dan pertumbuhan bobot maksimal.",
            temp: 24, color: "#06b6d4", colorRgb: "6,182,212",
            icon: <FaFan style={{ color: "#06b6d4", fontSize: 11 }} />,
            fill: "30%",
            details: ["Suhu target: 22–24°C", "Kelembapan: 55–60%", "Ventilasi penuh", "Persiapan panen"],
        },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
                <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                    Siklus Produksi
                </div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                    3 Fase Pertumbuhan
                </div>
            </div>

            {phases.map((p) => (
                <div key={p.id} style={{
                    background: "#0a1628",
                    border: `1px solid rgba(${p.colorRgb},0.18)`,
                    borderRadius: 16,
                    padding: "22px 24px",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                    cursor: "default",
                }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `rgba(${p.colorRgb},0.45)`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = `rgba(${p.colorRgb},0.18)`)}
                >
                    <div style={{
                        position: "absolute", top: 0, right: 0, width: 120, height: 120,
                        background: `radial-gradient(circle at top right, rgba(${p.colorRgb},0.08), transparent 70%)`,
                        pointerEvents: "none",
                    }} />

                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: `rgba(${p.colorRgb},0.1)`,
                            border: `1px solid rgba(${p.colorRgb},0.2)`,
                            borderRadius: 6, padding: "4px 10px",
                        }}>
                            {p.icon}
                            <span style={{ fontFamily: "monospace", fontSize: "10px", color: p.color, fontWeight: 600, letterSpacing: "0.08em" }}>{p.id}</span>
                        </div>
                        <span style={{ fontFamily: "monospace", fontSize: "12px", color: p.color, fontWeight: 700 }}>{p.range}</span>
                    </div>

                    {/* Name + desc */}
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{p.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.65, marginBottom: 16 }}>{p.desc}</div>

                    {/* Detail chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                        {p.details.map(d => (
                            <span key={d} style={{
                                fontFamily: "monospace", fontSize: "10px",
                                color: "#475569", background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 4, padding: "3px 8px",
                            }}>{d}</span>
                        ))}
                    </div>

                    {/* Temp + bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "24px", fontWeight: 800, color: p.color }}>
                            ~<CountUp from={0} to={p.temp} separator="," direction="up" duration={1} className="count-up-text" />°C
                        </span>
                        <div style={{ height: 3, width: 100, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: p.fill, background: `linear-gradient(90deg, ${p.color}66, ${p.color})`, borderRadius: 99, transition: "width 1s ease" }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Kelembapan() {
    const zones = [
        { label: "Terlalu Kering", range: "< 50%", risk: "Debu berlebih, iritasi saluran napas", color: "#ef4444", colorRgb: "239,68,68" },
        { label: "Zona Optimal", range: "60–70%", risk: "Kondisi ideal untuk pertumbuhan maksimal", color: "#10b981", colorRgb: "16,185,129" },
        { label: "Terlalu Lembap", range: "> 75%", risk: "CRD, Aspergillosis, litter basah", color: "#f59e0b", colorRgb: "245,158,11" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
                <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                    Relative Humidity (RH)
                </div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                    Kelembapan Kandang
                </div>
            </div>

            {/* Chart */}
            <div style={{
                background: "#0a1628",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: "24px 20px 16px",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: 0, right: 0, width: 160, height: 160,
                    background: "radial-gradient(circle at top right, rgba(99,102,241,0.07), transparent 70%)",
                    pointerEvents: "none",
                }} />
                <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                    Kurva RH Ideal — Hari 0 hingga 32
                </div>
                <div style={{ height: 220 }}>
                    <Line data={humidityChartData} options={makeChartOptions("99,102,241", "%", 50, 80) as any} />
                </div>
            </div>

            {/* Zone cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {zones.map((z) => (
                    <div key={z.label} style={{
                        background: "#0a1628",
                        border: `1px solid rgba(${z.colorRgb},0.18)`,
                        borderRadius: 14,
                        padding: "18px 16px",
                        position: "relative",
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                    }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = `rgba(${z.colorRgb},0.45)`)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = `rgba(${z.colorRgb},0.18)`)}
                    >
                        <div style={{
                            position: "absolute", top: 0, right: 0, width: 80, height: 80,
                            background: `radial-gradient(circle at top right, rgba(${z.colorRgb},0.1), transparent 70%)`,
                            pointerEvents: "none",
                        }} />
                        <div style={{
                            display: "inline-block",
                            width: 8, height: 8, borderRadius: "50%",
                            background: z.color,
                            marginBottom: 10,
                            boxShadow: `0 0 8px ${z.color}`,
                        }} />
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{z.label}</div>
                        <div style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 800, color: z.color, marginBottom: 8 }}>{z.range}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.6 }}>{z.risk}</div>
                    </div>
                ))}
            </div>

            {/* Tip strip */}
            <div style={{
                background: "rgba(99,102,241,0.07)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 12,
                padding: "14px 18px",
                display: "flex", alignItems: "flex-start", gap: 12,
            }}>
                <div style={{ width: 3, minHeight: 32, background: "#6366f1", borderRadius: 99, marginTop: 2 }} />
                <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#a5b4fc", marginBottom: 4 }}>Monitoring Interval</div>
                    <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.65 }}>
                        Sensor SHT31 membaca RH setiap 5 detik. Deviasi &gt;5% dari target memicu notifikasi ke dashboard secara real-time.
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoBiologis() {
    const bioData = [
        {
            title: "Feed Conversion Ratio (FCR)",
            value: "1.6–1.8",
            unit: "kg pakan / kg bobot",
            desc: "Nilai FCR ideal untuk broiler modern. Semakin rendah FCR, semakin efisien konversi pakan menjadi daging.",
            color: "#10b981", colorRgb: "16,185,129",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" /><polyline points="18 9 13 14 8 9 3 14" />
                </svg>
            ),
        },
        {
            title: "Target Bobot Panen",
            value: "1.8–2.2",
            unit: "kg / ekor (hari ke-32)",
            desc: "Bobot panen optimal pada usia 30–35 hari dengan manajemen suhu dan nutrisi yang tepat.",
            color: "#f97316", colorRgb: "249,115,22",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
            ),
        },
        {
            title: "Mortalitas Target",
            value: "< 3%",
            unit: "per siklus produksi",
            desc: "Dengan kontrol lingkungan otomatis, angka kematian dapat ditekan di bawah 3% per siklus.",
            color: "#3b82f6", colorRgb: "59,130,246",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
        },
        {
            title: "Kepadatan Kandang",
            value: "8–10",
            unit: "ekor / m²",
            desc: "Kepadatan optimal untuk sirkulasi udara dan kenyamanan termal. Kepadatan berlebih meningkatkan heat stress.",
            color: "#a855f7", colorRgb: "168,85,247",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
            ),
        },
    ];

    const milestones = [
        { day: "0", event: "DOC Masuk", note: "Anak ayam 1 hari" },
        { day: "7", event: "Vaksin ND", note: "Tetes mata / air minum" },
        { day: "14", event: "Vaksin Gumboro", note: "Via air minum" },
        { day: "21", event: "Vaksin ND Ulang", note: "Booster" },
        { day: "32", event: "Panen", note: "Bobot 1.8–2.2 kg" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
                <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                    Standar Produksi
                </div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                    Parameter Biologis
                </div>
            </div>

            {/* KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                {bioData.map((b) => (
                    <div key={b.title} style={{
                        background: "#0a1628",
                        border: `1px solid rgba(${b.colorRgb},0.18)`,
                        borderRadius: 14,
                        padding: "20px",
                        position: "relative",
                        overflow: "hidden",
                        transition: "border-color 0.2s, transform 0.2s",
                        cursor: "default",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${b.colorRgb},0.45)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${b.colorRgb},0.18)`; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        <div style={{
                            position: "absolute", top: 0, right: 0, width: 100, height: 100,
                            background: `radial-gradient(circle at top right, rgba(${b.colorRgb},0.09), transparent 70%)`,
                            pointerEvents: "none",
                        }} />
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `rgba(${b.colorRgb},0.1)`,
                            border: `1px solid rgba(${b.colorRgb},0.2)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: b.color, marginBottom: 14,
                        }}>
                            {b.icon}
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                            {b.title}
                        </div>
                        <div style={{ fontSize: "22px", fontWeight: 800, color: b.color, letterSpacing: "-0.02em", marginBottom: 2 }}>
                            {b.value}
                        </div>
                        <div style={{ fontSize: "11px", color: "#475569", marginBottom: 10 }}>{b.unit}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.65 }}>{b.desc}</div>
                    </div>
                ))}
            </div>

            {/* Timeline milestones */}
            <div style={{
                background: "#0a1628",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 14,
                padding: "20px 22px",
            }}>
                <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
                    Milestone Siklus Produksi
                </div>
                <div style={{ position: "relative", paddingLeft: 28 }}>
                    {/* Vertical line */}
                    <div style={{
                        position: "absolute", left: 7, top: 6, bottom: 6,
                        width: 1, background: "rgba(255,255,255,0.06)",
                    }} />
                    {milestones.map((m, i) => (
                        <div key={m.day} style={{
                            display: "flex", alignItems: "flex-start", gap: 16,
                            marginBottom: i < milestones.length - 1 ? 18 : 0,
                            position: "relative",
                        }}>
                            {/* Dot */}
                            <div style={{
                                position: "absolute", left: -28,
                                width: 14, height: 14, borderRadius: "50%",
                                background: i === milestones.length - 1 ? "#10b981" : "#1e2d40",
                                border: `2px solid ${i === milestones.length - 1 ? "#10b981" : "rgba(255,255,255,0.12)"}`,
                                boxShadow: i === milestones.length - 1 ? "0 0 10px rgba(16,185,129,0.5)" : "none",
                                top: 2,
                            }} />
                            <div style={{
                                fontFamily: "monospace", fontSize: "11px", fontWeight: 700,
                                color: "#475569", minWidth: 32,
                            }}>
                                D-{m.day}
                            </div>
                            <div>
                                <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0", marginBottom: 2 }}>{m.event}</div>
                                <div style={{ fontSize: "11px", color: "#475569" }}>{m.note}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MonitoringSection() {
    const [activeTab, setActiveTab] = useState<TabId>("kurva");
    const [animating, setAnimating] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const activeTabData = tabs.find((t) => t.id === activeTab)!;

    const handleTabChange = (id: TabId) => {
        if (id === activeTab) return;
        setAnimating(true);
        setTimeout(() => {
            setActiveTab(id);
            setAnimating(false);
        }, 180);
    };

    const contentMap: Record<TabId, React.ReactNode> = {
        kurva: <KurvaSuhu />,
        fase: <FasePertumbuhan />,
        humidity: <Kelembapan />,
        biologis: <InfoBiologis />,
    };

    return (
        <section
            id="monitoring"
            style={{
                background: "#080f1a",
                padding: "100px 0",
                position: "relative",
                overflow: "hidden",
                minHeight: "100vh",
            }}
        >
            {/* Background glows */}
            <div style={{ position: "absolute", top: -120, left: -80, width: 600, height: 600, background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -100, right: -60, width: 500, height: 500, background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />
            {/* Dot grid */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", position: "relative" }}>

                {/* ── Section Header ── */}
                <div style={{ marginBottom: 48 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                        <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#f8fafc", lineHeight: 1.15, letterSpacing: "-0.025em", margin: 0 }}>
                            Adaptasi Kenyamanan<br />
                            <span style={{ color: "#60a5fa" }}>
                                <GradientText
                                    colors={["#5227FF", "#0ea5e9", "#6366f1"]}
                                    animationSpeed={8}
                                    showBorder={false}
                                    className="font-extrabold"
                                >
                                    Secara Cerdas
                                </GradientText>
                            </span>
                        </h2>
                        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.75, maxWidth: 340, margin: 0 }}>
                            Sistem mengikuti kurva biologis standar secara otomatis — dari fase menetas hingga siap panen.
                        </p>
                    </div>
                </div>

                {/* ── Main Layout: Sidebar + Content ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "220px 1fr",
                    gap: 24,
                    alignItems: "start",
                }}>

                    {/* ── LEFT: Vertical Sidebar Nav ── */}
                    <div style={{
                        background: "#0d1829",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 20,
                        padding: "12px",
                        position: "sticky",
                        top: 24,
                    }}>

                        {/* Nav label */}
                        <div style={{
                            fontFamily: "monospace", fontSize: "9px",
                            color: "#334155", letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            padding: "8px 12px 12px",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            marginBottom: 8,
                        }}>
                            Navigasi
                        </div>

                        {/* Tab items */}
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "12px 14px",
                                        borderRadius: 12,
                                        border: "none",
                                        cursor: "pointer",
                                        marginBottom: 4,
                                        background: isActive ? `rgba(${tab.accentRgb},0.12)` : "transparent",
                                        transition: "background 0.2s, color 0.2s",
                                        textAlign: "left",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                                >
                                    {/* Active left bar */}
                                    {isActive && (
                                        <div style={{
                                            position: "absolute", left: 0, top: "20%", bottom: "20%",
                                            width: 3, borderRadius: 99,
                                            background: tab.accent,
                                            boxShadow: `0 0 8px ${tab.accent}`,
                                        }} />
                                    )}

                                    {/* Icon */}
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 9,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: isActive ? `rgba(${tab.accentRgb},0.15)` : "rgba(255,255,255,0.04)",
                                        color: isActive ? tab.accent : "#475569",
                                        transition: "background 0.2s, color 0.2s",
                                        flexShrink: 0,
                                    }}>
                                        {tab.icon}
                                    </div>

                                    {/* Label */}
                                    <div>
                                        <div style={{
                                            fontSize: "13px",
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? "#f1f5f9" : "#64748b",
                                            transition: "color 0.2s",
                                            lineHeight: 1.2,
                                            marginBottom: 2,
                                        }}>
                                            {tab.label}
                                        </div>
                                        <div style={{
                                            fontFamily: "monospace", fontSize: "9px",
                                            color: isActive ? tab.accent : "#334155",
                                            transition: "color 0.2s",
                                        }}>
                                            {tab.shortLabel}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── RIGHT: Content Area ── */}
                    <div
                        ref={contentRef}
                        style={{
                            background: "#0d1829",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 20,
                            padding: "32px",
                            minHeight: 600,
                            opacity: animating ? 0 : 1,
                            transform: animating ? "translateY(8px)" : "translateY(0)",
                            transition: "opacity 0.18s ease, transform 0.18s ease",
                        }}
                    >
                        {/* Content breadcrumb */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            marginBottom: 28,
                            paddingBottom: 20,
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: `rgba(${activeTabData.accentRgb},0.12)`,
                                border: `1px solid rgba(${activeTabData.accentRgb},0.2)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: activeTabData.accent,
                            }}>
                                {activeTabData.icon}
                            </div>
                            <div>
                                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                    Monitoring /
                                </span>
                                <span style={{ fontFamily: "monospace", fontSize: "9px", color: activeTabData.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: 4 }}>
                                    {activeTabData.label}
                                </span>
                            </div>
                        </div>

                        {/* Dynamic content */}
                        {contentMap[activeTab]}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 768px) {
          #monitoring [style*="grid-template-columns: 220px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          #monitoring [style*="position: sticky"] {
            position: static !important;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0;
          }
        }
      `}</style>
        </section>
    );
}