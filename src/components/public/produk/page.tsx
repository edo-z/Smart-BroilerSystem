"use client";
// =====================================================================
// PANDUAN INTEGRASI:
//
// 1. Letakkan <ProductShowcase /> SEBELUM section #produk di LandingPage
// 2. Ganti section #produk yang existing dengan <ProdukSectionWithNav />
// 3. Import keduanya di halaman:
//    import ProductShowcase, { ProdukSectionWithNav } from "./ProductShowcase";
// =====================================================================

import { useEffect, useRef, useState } from "react";
import CountUp from "@/component/CountUp";
import GradientText from "@/component/GradientText";

// ─── Inline Icons ────────────────────────────────────────────────────
const IconTemp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);
const IconDroplet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
const IconCloud = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IconChip = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="6" height="6" rx="1"/>
    <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/>
    <rect x="4" y="4" width="16" height="16" rx="2"/>
  </svg>
);
const IconWifi = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Data Produk ─────────────────────────────────────────────────────
const products = [
  {
    id: "AVS-S1",
    name: "AVESIS Sensor Node",
    tagline: "Edge Intelligence",
    category: "HARDWARE",
    desc: "Unit sensor ESP32-S3 N16R8 dengan SHT31 industrial-grade. Dirancang untuk lingkungan kandang yang lembap, dengan enklosure IP65 dan mounting magnet.",
    specs: [
      { label: "MCU", value: "ESP32-S3 N16R8" },
      { label: "Sensor", value: "SHT31 ±0.5°C" },
      { label: "Koneksi", value: "Wi-Fi 802.11 b/g/n" },
      { label: "Proteksi", value: "IP65 Rated" },
      { label: "Power", value: "5V USB-C / PoE" },
      { label: "Interval", value: "1–60 detik" },
    ],
    badge: "IN DEVELOPMENT",
    accent: "#f97316",
    accentDim: "rgba(249,115,22,0.08)",
    accentBorder: "rgba(249,115,22,0.2)",
    icon: <IconChip />,
    // Representasi visual produk — ganti src ke gambar nyata jika tersedia
    visual: "sensor",
  },
  {
    id: "AVS-G1",
    name: "AVESIS Gateway",
    tagline: "Local Intelligence Hub",
    category: "HARDWARE",
    desc: "Gateway lokal berbasis Raspberry Pi yang mengumpulkan data dari seluruh sensor node di kandang. Mendukung MQTT bridge ke cloud dan edge processing.",
    specs: [
      { label: "Platform", value: "Raspberry Pi 4B" },
      { label: "Protokol", value: "MQTT / HTTP" },
      { label: "Node Max", value: "Up to 32 sensor" },
      { label: "Storage", value: "Local SD + Cloud sync" },
      { label: "Display", value: "2.8\" TFT Status" },
      { label: "Uptime", value: "24/7 Operation" },
    ],
    badge: "COMING SOON",
    accent: "#6366f1",
    accentDim: "rgba(99,102,241,0.08)",
    accentBorder: "rgba(99,102,241,0.2)",
    icon: <IconWifi />,
    visual: "gateway",
  },
  {
    id: "AVS-D1",
    name: "AVESIS Dashboard",
    tagline: "Command & Control",
    category: "SOFTWARE",
    desc: "Aplikasi web Next.js untuk monitoring real-time, histori data, alert threshold, dan manajemen multi-kandang. Berjalan di semua perangkat.",
    specs: [
      { label: "Framework", value: "Next.js 15 App Router" },
      { label: "Database", value: "MongoDB Atlas" },
      { label: "Auth", value: "NextAuth v5" },
      { label: "Deploy", value: "Vercel Edge" },
      { label: "Refresh", value: "Real-time polling" },
      { label: "Theme", value: "Dark / Light" },
    ],
    badge: "LIVE",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.2)",
    icon: <IconCloud />,
    visual: "dashboard",
  },
];

// ─── SVG Visual Placeholders ──────────────────────────────────────────
// Ganti komponen ini dengan <Image src="..." /> ketika aset tersedia

function SensorVisual({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Board outline */}
      <rect x="60" y="30" width="160" height="140" rx="8" fill="#1e293b" stroke={accent} strokeWidth="1.2" strokeOpacity="0.4"/>
      {/* MCU chip */}
      <rect x="95" y="60" width="90" height="80" rx="4" fill="#0f172a" stroke={accent} strokeWidth="1" strokeOpacity="0.6"/>
      <text x="140" y="106" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace" opacity="0.8">ESP32-S3</text>
      <text x="140" y="117" textAnchor="middle" fill={accent} fontSize="7" fontFamily="monospace" opacity="0.5">N16R8</text>
      {/* Pins left */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="52" y={68 + i * 14} width="8" height="6" rx="1" fill="#334155" stroke={accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      ))}
      {/* Pins right */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="220" y={68 + i * 14} width="8" height="6" rx="1" fill="#334155" stroke={accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      ))}
      {/* SHT31 sensor small chip */}
      <rect x="68" y="148" width="40" height="12" rx="2" fill="#1e293b" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.4"/>
      <text x="88" y="157" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace" opacity="0.6">SHT31</text>
      {/* USB-C port */}
      <rect x="120" y="162" width="40" height="8" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
      <text x="140" y="168" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">USB-C</text>
      {/* Signal waves */}
      <path d="M200 50 Q210 44 220 50" stroke={accent} strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
      <path d="M196 45 Q210 37 224 45" stroke={accent} strokeWidth="1" strokeOpacity="0.35" fill="none"/>
      <path d="M192 40 Q210 30 228 40" stroke={accent} strokeWidth="0.8" strokeOpacity="0.2" fill="none"/>
      <circle cx="210" cy="55" r="2" fill={accent} opacity="0.6"/>
      {/* LED status */}
      <circle cx="78" cy="48" r="4" fill="#22c55e" opacity="0.8"/>
      <circle cx="78" cy="48" r="7" fill="#22c55e" opacity="0.12"/>
    </svg>
  );
}

function GatewayVisual({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Enclosure */}
      <rect x="50" y="40" width="180" height="120" rx="10" fill="#1e293b" stroke={accent} strokeWidth="1.2" strokeOpacity="0.4"/>
      <rect x="58" y="48" width="164" height="104" rx="7" fill="#0f172a" stroke={accent} strokeWidth="0.6" strokeOpacity="0.2"/>
      {/* Display */}
      <rect x="68" y="58" width="90" height="55" rx="3" fill="#0a0f1e" stroke={accent} strokeWidth="0.8" strokeOpacity="0.5"/>
      <text x="113" y="83" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace" opacity="0.9">28.5°C</text>
      <text x="113" y="95" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace">64% RH</text>
      <rect x="72" y="100" width="82" height="2" rx="1" fill={accent} opacity="0.15"/>
      <rect x="72" y="100" width="55" height="2" rx="1" fill={accent} opacity="0.6"/>
      {/* Ports right */}
      <rect x="170" y="62" width="32" height="8" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.6"/>
      <text x="186" y="68" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">ETH</text>
      <rect x="170" y="76" width="32" height="8" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.6"/>
      <text x="186" y="82" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">USB</text>
      {/* SD slot */}
      <rect x="170" y="90" width="20" height="6" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.6"/>
      <text x="180" y="95" textAnchor="middle" fill="#475569" fontSize="4" fontFamily="monospace">SD</text>
      {/* Status LEDs */}
      {[0,1,2].map(i => (
        <circle key={i} cx={80 + i * 14} cy={128} r="3.5" fill={i===0?"#22c55e":i===1?accent:"#334155"} opacity={i===2?0.3:0.8}/>
      ))}
      {/* Antenna */}
      <rect x="214" y="28" width="4" height="24" rx="2" fill="#334155"/>
      <rect x="208" y="26" width="16" height="4" rx="2" fill="#475569"/>
      {/* WiFi waves */}
      <path d="M218 18 Q224 12 230 18" stroke={accent} strokeWidth="1" strokeOpacity="0.5" fill="none"/>
      <path d="M215 13 Q224 5 233 13" stroke={accent} strokeWidth="0.8" strokeOpacity="0.3" fill="none"/>
    </svg>
  );
}

function DashboardVisual({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Browser frame */}
      <rect x="30" y="24" width="220" height="152" rx="8" fill="#0f172a" stroke={accent} strokeWidth="1" strokeOpacity="0.3"/>
      {/* Titlebar */}
      <rect x="30" y="24" width="220" height="20" rx="8" fill="#1e293b"/>
      <rect x="30" y="36" width="220" height="8" fill="#1e293b"/>
      <circle cx="46" cy="34" r="3.5" fill="#ef4444" opacity="0.6"/>
      <circle cx="58" cy="34" r="3.5" fill="#f59e0b" opacity="0.6"/>
      <circle cx="70" cy="34" r="3.5" fill="#22c55e" opacity="0.6"/>
      {/* URL bar */}
      <rect x="86" y="28" width="120" height="12" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.6"/>
      <text x="146" y="36.5" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">avesis.vercel.app</text>
      {/* Sidebar */}
      <rect x="30" y="44" width="36" height="132" fill="#0d1829" rx="0"/>
      {[0,1,2,3].map(i => (
        <rect key={i} x="38" y={58 + i * 22} width="20" height="14" rx="3" fill={i===0?accent:"#1e293b"} opacity={i===0?0.2:0.5}/>
      ))}
      {/* Main area */}
      {/* Stat cards */}
      <rect x="74" y="50" width="48" height="30" rx="4" fill="#1e293b"/>
      <text x="98" y="62" textAnchor="middle" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">28.5°</text>
      <text x="98" y="72" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Suhu</text>
      <rect x="128" y="50" width="48" height="30" rx="4" fill="#1e293b"/>
      <text x="152" y="62" textAnchor="middle" fill="#6366f1" fontSize="9" fontFamily="monospace" fontWeight="bold">64%</text>
      <text x="152" y="72" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Kelembapan</text>
      <rect x="182" y="50" width="48" height="30" rx="4" fill="#1e293b"/>
      <text x="206" y="62" textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace" fontWeight="bold">Online</text>
      <text x="206" y="72" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Status</text>
      {/* Mini chart */}
      <rect x="74" y="88" width="156" height="52" rx="4" fill="#1e293b"/>
      {/* Chart line */}
      <polyline points="84,130 104,122 124,118 144,112 164,108 184,106 204,104 220,102" stroke={accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="84,130 104,122 124,118 144,112 164,108 184,106 204,104 220,102 220,136 84,136" fill={accent} opacity="0.06"/>
      {/* Chart dots */}
      {[[84,130],[144,112],[220,102]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill={accent} opacity="0.8"/>
      ))}
      {/* Table */}
      <rect x="74" y="146" width="156" height="24" rx="4" fill="#1e293b"/>
      {["Kandang A1","Kandang A2","Kandang B1"].map((t,i)=>(
        <text key={i} x={90 + i * 52} y={161} fill="#475569" fontSize="5" fontFamily="monospace">{t}</text>
      ))}
    </svg>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────
function ProductCard({ product, isActive, onClick }: {
  product: typeof products[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: isActive ? product.accentDim : "#fff",
        border: `1.5px solid ${isActive || hovered ? product.accent : "#e8ecf0"}`,
        borderRadius: "12px",
        padding: "20px",
        transition: "all 0.25s ease",
        transform: isActive ? "translateY(-2px)" : hovered ? "translateY(-1px)" : "none",
        boxShadow: isActive ? `0 8px 32px ${product.accent}20` : hovered ? `0 4px 16px rgba(0,0,0,0.07)` : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "8px",
          background: `${product.accent}12`,
          border: `1px solid ${product.accent}25`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: product.accent,
        }}>
          {product.icon}
        </div>
        <span style={{
          fontFamily: "monospace",
          fontSize: "9px",
          fontWeight: 700,
          color: product.badge === "LIVE" ? "#22c55e" : product.badge === "IN DEVELOPMENT" ? product.accent : "#94a3b8",
          background: product.badge === "LIVE" ? "rgba(34,197,94,0.1)" : product.badge === "IN DEVELOPMENT" ? `${product.accent}15` : "rgba(148,163,184,0.1)",
          border: `1px solid ${product.badge === "LIVE" ? "rgba(34,197,94,0.25)" : product.badge === "IN DEVELOPMENT" ? `${product.accent}30` : "rgba(148,163,184,0.25)"}`,
          padding: "3px 8px",
          borderRadius: "99px",
          letterSpacing: "0.08em",
        }}>
          {product.badge === "LIVE" && <span style={{ marginRight: "4px" }}>●</span>}
          {product.badge}
        </span>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8", marginBottom: "4px", letterSpacing: "0.1em" }}>
        {product.id}
      </div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>
        {product.name}
      </div>
      <div style={{ fontSize: "11px", color: product.accent, fontWeight: 500, marginTop: "2px" }}>
        {product.tagline}
      </div>

      {isActive && (
        <div style={{ marginTop: "12px", height: "2px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "100%", background: product.accent, borderRadius: "99px", animation: "fillBar 0.6s ease forwards" }} />
        </div>
      )}
    </div>
  );
}

// ─── Product Detail Panel ─────────────────────────────────────────────
function ProductDetail({ product }: { product: typeof products[0] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [product.id]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(16px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>
      {/* Product Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span style={{
            fontFamily: "monospace", fontSize: "10px", fontWeight: 600,
            color: "#94a3b8", letterSpacing: "0.12em",
            background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px",
          }}>
            {product.category}
          </span>
          <span style={{
            fontFamily: "monospace", fontSize: "9px", fontWeight: 700,
            color: product.badge === "LIVE" ? "#22c55e" : product.badge === "IN DEVELOPMENT" ? product.accent : "#94a3b8",
            letterSpacing: "0.1em",
          }}>
            {product.badge === "LIVE" ? "● " : ""}{product.badge}
          </span>
        </div>
        <h3 style={{
          fontSize: "clamp(24px, 3vw, 34px)",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
          marginBottom: "8px",
        }}>
          {product.name}
        </h3>
        <div style={{ fontSize: "14px", color: product.accent, fontWeight: 600, marginBottom: "16px" }}>
          {product.tagline}
        </div>
        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.75, maxWidth: "480px" }}>
          {product.desc}
        </p>
      </div>

      {/* Visual Box */}
      <div style={{
        background: "#f8fafc",
        border: `1px solid ${product.accentBorder}`,
        borderRadius: "20px",
        padding: "32px",
        marginBottom: "28px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(${product.accent}08 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }} />
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "200px", height: "200px",
          background: `radial-gradient(circle, ${product.accent}10, transparent 65%)`,
        }} />
        <div style={{ width: "280px", height: "200px", position: "relative", zIndex: 1 }}>
          {product.visual === "sensor" && <SensorVisual accent={product.accent} />}
          {product.visual === "gateway" && <GatewayVisual accent={product.accent} />}
          {product.visual === "dashboard" && <DashboardVisual accent={product.accent} />}
        </div>
        {/* Product ID watermark */}
        <div style={{
          position: "absolute", bottom: "12px", right: "16px",
          fontFamily: "monospace", fontSize: "10px", color: "#cbd5e1",
          letterSpacing: "0.1em",
        }}>
          {product.id}
        </div>
      </div>

      {/* Specs Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
      }}>
        {product.specs.map((spec) => (
          <div key={spec.label} style={{
            background: "#f8fafc",
            border: "1px solid #e8ecf0",
            borderRadius: "10px",
            padding: "12px 14px",
          }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#94a3b8", letterSpacing: "0.1em", marginBottom: "4px" }}>
              {spec.label}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a" }}>
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION 1: PRODUCT SHOWCASE ─────────────────────────────────────
export default function ProductShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setSectionVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const active = products[activeIdx];

  return (
    <section
      id="showcase"
      ref={sectionRef}
      style={{
        padding: "100px 0",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px", position: "relative" }}>

        {/* ── Header ── */}
        <div style={{
          marginBottom: "56px",
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? "none" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: "99px",
            padding: "6px 14px",
            marginBottom: "20px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#64748b", letterSpacing: "0.1em", fontWeight: 600 }}>
              AVESIS PRODUCT LINE
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" as const, gap: "16px" }}>
            <h2 style={{
              fontSize: "clamp(30px, 5vw, 46px)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              margin: 0,
            }}>
              Ekosistem Produk<br />
              <GradientText
                colors={["#f97316", "#6366f1", "#10b981"]}
                animationSpeed={6}
                showBorder={false}
                className="font-extrabold"
              >
                End-to-End
              </GradientText>{" "}
              <span style={{ color: "#0f172a" }}>AVESIS</span>
            </h2>
            <p style={{
              fontSize: "13px", color: "#64748b", lineHeight: 1.75,
              maxWidth: "320px", margin: 0,
            }}>
              Dari sensor di kandang hingga dashboard di genggaman — setiap komponen dirancang untuk bekerja bersama secara seamless.
            </p>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "28px",
          alignItems: "start",
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? "none" : "translateY(24px)",
          transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
        }}>

          {/* LEFT: Product Selector */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                isActive={activeIdx === i}
                onClick={() => setActiveIdx(i)}
              />
            ))}

            {/* Stats strip */}
            <div style={{
              marginTop: "8px",
              padding: "20px",
              background: "#f8fafc",
              border: "1px solid #e8ecf0",
              borderRadius: "12px",
            }}>
              <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#94a3b8", letterSpacing: "0.1em", marginBottom: "12px" }}>
                EKOSISTEM STATS
              </div>
              {[
                { label: "Komponen Total", val: 3, suffix: "" },
                { label: "Hardware Unit", val: 2, suffix: "" },
                { label: "Open-Source", val: 100, suffix: "%" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{s.label}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                    <CountUp from={0} to={s.val} duration={1.2} className="" />{s.suffix}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Detail */}
          <div style={{
            background: "#fff",
            border: "1px solid #e8ecf0",
            borderRadius: "20px",
            padding: "40px",
            minHeight: "560px",
          }}>
            <ProductDetail product={active} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fillBar {
          from { width: 0; }
          to { width: 100%; }
        }
        @media (max-width: 768px) {
          #showcase [style*="grid-template-columns: 300px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          #showcase [style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── SECTION 2: PRODUK SECTION WITH SLIDE NAV ─────────────────────────
// Ganti section #produk yang ada dengan komponen ini
// Salin seluruh kode features[] dan FeatureCard dari file asli

const features = [
  {
    id: "01",
    icon: <IconTemp />,
    label: "SENSOR PRESISI",
    title: "Akurasi Industri, Data Nyata",
    desc: "Sensor SHT31 industrial-grade dengan akurasi ±0.5°C dan resolusi 0.01°C. Setiap titik data dikalibrasi terhadap standar NIST untuk keandalan yang tak diragukan.",
    stat: "±0.5°C",
    statLabel: "Akurasi Suhu",
    accent: "#0ea5e9",
    accentBg: "rgba(14,165,233,0.06)",
    bar: 92,
    detail: {
      headline: "Presisi yang Dapat Diandalkan",
      points: [
        "Kalibrasi NIST-traceable dari pabrik",
        "Resolusi 0.01°C untuk deteksi anomali dini",
        "Kompensasi drift otomatis setiap 24 jam",
        "Response time <8 detik ke kondisi baru",
      ],
    },
  },
  {
    id: "02",
    icon: <IconDroplet />,
    label: "HUMIDITY CONTROL",
    title: "Cegah CRD Sebelum Terjadi",
    desc: "Monitoring kelembaban real-time untuk menjaga RH pada zona optimal 60–70%. Deviasi terdeteksi dalam <3 detik, sebelum berdampak pada sistem pernapasan ayam.",
    stat: "<3 detik",
    statLabel: "Waktu Deteksi",
    accent: "#6366f1",
    accentBg: "rgba(99,102,241,0.06)",
    bar: 78,
    detail: {
      headline: "Zona Kelembapan Optimal",
      points: [
        "Target RH 60–70% untuk kesehatan saluran napas",
        "Alert otomatis saat RH keluar rentang aman",
        "Histori tren 30 hari untuk analisis pola",
        "Integrasi dengan kontrol ventilasi otomatis",
      ],
    },
  },
  {
    id: "03",
    icon: <IconCloud />,
    label: "CLOUD SYNC",
    title: "Data Tersedia, Di Mana Saja",
    desc: "Sinkronisasi otomatis ke MongoDB Atlas dengan latensi <500ms. Akses histori, tren, dan laporan performa kandang dari perangkat apapun, kapanpun.",
    stat: "99.9%",
    statLabel: "Uptime SLA",
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.06)",
    bar: 99,
    detail: {
      headline: "Infrastruktur Cloud Terpercaya",
      points: [
        "MongoDB Atlas multi-region replication",
        "Enkripsi TLS 1.3 end-to-end",
        "Backup otomatis setiap 6 jam",
        "API rate-limited untuk keamanan akses",
      ],
    },
  },
];

// ─── Slide Nav Fitur ──────────────────────────────────────────────────
function FeatureSlideNav({ activeIdx, onSelect }: { activeIdx: number; onSelect: (i: number) => void }) {
  return (
    <div style={{
      display: "flex",
      gap: "0",
      background: "#fff",
      borderRadius: "14px",
      padding: "5px",
      border: "1px solid #e8ecf0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      width: "fit-content",
      margin: "0 auto 52px auto",
      position: "relative",
    }}>
      {features.map((f, i) => (
        <button
          key={f.id}
          onClick={() => onSelect(i)}
          style={{
            cursor: "pointer",
            padding: "10px 22px",
            borderRadius: "10px",
            border: "none",
            background: activeIdx === i ? f.accent : "transparent",
            color: activeIdx === i ? "#fff" : "#64748b",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "monospace",
            letterSpacing: "0.08em",
            transition: "all 0.22s ease",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            whiteSpace: "nowrap" as const,
            boxShadow: activeIdx === i ? `0 4px 16px ${f.accent}40` : "none",
          }}
        >
          <span style={{ opacity: activeIdx === i ? 1 : 0.5, display: "flex" }}>{f.icon}</span>
          {f.label}
        </button>
      ))}
    </div>
  );
}

// ─── Feature Detail Panel ─────────────────────────────────────────────
function FeatureDetailPanel({ feature }: { feature: typeof features[0] }) {
  const [vis, setVis] = useState(false);
  const [barFill, setBarFill] = useState(0);

  useEffect(() => {
    setVis(false);
    setBarFill(0);
    const t1 = setTimeout(() => setVis(true), 60);
    const t2 = setTimeout(() => setBarFill(feature.bar), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [feature.id]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(12px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>
      {/* LEFT: Feature Card (existing style) */}
      <div style={{
        background: "#fff",
        border: `1.5px solid ${feature.accent}35`,
        borderRadius: "20px",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 8px 40px ${feature.accent}12`,
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "180px", height: "180px",
          background: `radial-gradient(circle at top right, ${feature.accent}12, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 600, color: feature.accent, letterSpacing: "0.12em" }}>
            {feature.label}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#c8d0d8" }}>{feature.id}</span>
        </div>

        <div style={{
          width: "52px", height: "52px", borderRadius: "14px",
          background: feature.accentBg,
          border: `1px solid ${feature.accent}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: feature.accent, marginBottom: "24px",
        }}>
          {feature.icon}
        </div>

        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", lineHeight: 1.25, marginBottom: "14px", letterSpacing: "-0.015em" }}>
          {feature.title}
        </h3>
        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.75, marginBottom: "32px" }}>
          {feature.desc}
        </p>

        <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "26px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            {feature.stat}
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{feature.statLabel}</span>
        </div>
        <div style={{ height: "3px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${barFill}%`,
            background: `linear-gradient(90deg, ${feature.accent}88, ${feature.accent})`,
            borderRadius: "99px",
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      </div>

      {/* RIGHT: Detail points */}
      <div style={{ display: "flex", flexDirection: "column" as const, justifyContent: "center", gap: "0" }}>
        <div style={{
          fontFamily: "monospace", fontSize: "10px", color: "#94a3b8",
          letterSpacing: "0.12em", marginBottom: "16px",
        }}>
          DETAIL KEMAMPUAN
        </div>
        <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.015em", marginBottom: "28px" }}>
          {feature.detail.headline}
        </h4>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>
          {feature.detail.points.map((pt, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "flex-start", gap: "14px",
                padding: "16px 18px",
                background: "#f8fafc",
                border: "1px solid #e8ecf0",
                borderRadius: "12px",
                opacity: vis ? 1 : 0,
                transform: vis ? "none" : "translateX(8px)",
                transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
              }}
            >
              <div style={{
                width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
                background: `${feature.accent}12`,
                border: `1px solid ${feature.accent}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={feature.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>{pt}</span>
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        <div style={{ display: "flex", gap: "8px", marginTop: "28px" }}>
          {features.map((f, i) => (
            <div key={i} style={{
              height: "3px",
              flex: 1,
              borderRadius: "99px",
              background: i === features.indexOf(feature) ? feature.accent : "#e2e8f0",
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProdukSectionWithNav() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setHeadingVisible(true);
    }, { threshold: 0.2 });
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="produk" style={{ padding: "96px 0", background: "#ffffff", position: "relative", overflow: "hidden" }}>

      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px", position: "relative" }}>

        {/* Header */}
        <div
          ref={headingRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "end",
            marginBottom: "56px",
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div>
            <h2 style={{
              fontSize: "clamp(38px, 6vw, 50px)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.35,
              letterSpacing: "-0.025em",
              margin: "0 0 0 0",
            }}>
              Teknologi untuk{" "}
              <GradientText
                colors={["#5227FF", "#0ea5e9", "#6366f1"]}
                animationSpeed={8}
                showBorder={false}
                className="font-extrabold"
              >
                Manajemen Broiler Modern
              </GradientText>
            </h2>
          </div>

          <div>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.75, margin: 0, maxWidth: "380px" }}>
              Dikembangkan berdasarkan standar internasional manajemen peternakan broiler modern —
              dari sensor hingga cloud, setiap komponen dirancang untuk keandalan operasional.
            </p>
            <div style={{ display: "flex", gap: "32px", marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #e8ecf0" }}>
              {[["3", "Sensor Aktif"], ["<500ms", "Sync Latency"], ["24/7", "Monitoring"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{val}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slide Nav ── */}
        <FeatureSlideNav activeIdx={activeFeature} onSelect={setActiveFeature} />

        {/* ── Feature Detail Panel ── */}
        <FeatureDetailPanel feature={features[activeFeature]} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          #produk [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          #produk [style*="grid-template-columns: 1fr 1fr"]:last-of-type {
            grid-template-columns: 1fr !important;
          }
          #produk button[style] {
            padding: 8px 12px !important;
            font-size: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}