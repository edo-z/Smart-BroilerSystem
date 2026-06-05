"use client";

import { useEffect, useRef, useState } from "react";
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
const IconCog = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
// ─── PRODUK SECTION (MERGED) ──────────────────────────────────────────

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
  {
    id: "04",
    icon: <IconChip />,
    label: "HARDWARE",
    title: "Otak di Balik Kandang Pintar",
    desc: "Ditenagai ESP32-S3 N16R8 dengan dual-core 240MHz dan 16MB Flash. Menjalankan algoritma Fuzzy Logic lokal untuk respons instan tanpa bergantung penuh pada koneksi cloud.",
    stat: "240MHz",
    statLabel: "Dual-Core Speed",
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.06)",
    bar: 85,
    detail: {
      headline: "Komponen & Arsitektur",
      points: [
        "Dual-core Xtensa LX7 @ 240MHz dengan 8MB PSRAM",
        "Onboard Fuzzy Logic controller untuk keputusan real-time",
        "OTA firmware update via WiFi tanpa turun ke kandang",
        "Deep sleep mode untuk efisiensi daya saat idle",
      ],
    },
  },
  {
    id: "05",
    icon: <IconCog />,
    label: "SPESIFIKASI",
    title: "Spesifikasi Teknis Sistem",
    desc: "Detail lengkap komponen perangkat keras dan perangkat lunak yang membentuk ekosistem BroilerSmart — dari firmware ESP32 hingga deployment Next.js.",
    stat: "100%",
    statLabel: "Open Source",
    accent: "#ec4899",
    accentBg: "rgba(236,72,153,0.06)",
    bar: 90,
    detail: {
      headline: "Arsitektur End-to-End",
      points: [
        "MQTT broker untuk komunikasi ESP32 ↔ Server real-time",
        "Next.js App Router dengan TypeScript untuk dashboard",
        "TailwindCSS + DaisyUI untuk UI komponen yang responsif",
        "Native MongoDB Driver — tanpa Mongoose, performa maksimal",
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

export default function ProdukSectionMerged() {
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
          #produk > div > div:first-of-type {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          #produk [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          #produk [style*="padding: 40px"] {
            padding: 24px !important;
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