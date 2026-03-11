"use client";
import { useEffect, useRef, useState } from "react";
import GradientText from "@/component/GradientText";

// ── Icons ──────────────────────────────────────────────
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
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IconChip = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M9 7V4M12 7V4M15 7V4M9 20v-3M12 20v-3M15 20v-3M4 9h3M4 12h3M4 15h3M20 9h-3M20 12h-3M20 15h-3" />
  </svg>
);
const IconCog = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// ── Tab Data ────────────────────────────────────────────
const tabs = [
  {
    id: "sensor",
    label: "Sensor Presisi",
    icon: <IconTemp />,
    accent: "#0ea5e9",
    accentBg: "rgba(14,165,233,0.08)",
    tag: "SHT31 Industrial",
    headline: "Akurasi Industri, Data Nyata",
    desc: "Sensor SHT31 industrial-grade dengan akurasi ±0.5°C dan resolusi 0.01°C. Setiap titik data dikalibrasi terhadap standar NIST untuk keandalan yang tak diragukan di seluruh siklus produksi.",
    stats: [
      { label: "Akurasi Suhu", value: "±0.5°C" },
      { label: "Resolusi", value: "0.01°C" },
      { label: "Sampling Rate", value: "1 Hz" },
      { label: "Range Suhu", value: "0–85°C" },
    ],
    highlights: [
      "Kalibrasi otomatis terhadap standar NIST",
      "Kompensasi drift jangka panjang",
      "Tahan kondisi kandang lembab dan berdebu",
      "Dual-channel: suhu + kelembapan dalam satu sensor",
    ],
    visual: "temp",
  },
  {
    id: "humidity",
    label: "Humidity Control",
    icon: <IconDroplet />,
    accent: "#6366f1",
    accentBg: "rgba(99,102,241,0.08)",
    tag: "RH Monitoring",
    headline: "Cegah CRD Sebelum Terjadi",
    desc: "Monitoring kelembapan real-time untuk menjaga RH pada zona optimal 60–70%. Deviasi terdeteksi dalam <3 detik, sebelum berdampak pada sistem pernapasan ayam dan meningkatkan risiko CRD.",
    stats: [
      { label: "Akurasi RH", value: "±2% RH" },
      { label: "Waktu Deteksi", value: "<3 detik" },
      { label: "Range RH", value: "0–100%" },
      { label: "Zona Optimal", value: "60–70%" },
    ],
    highlights: [
      "Deteksi lonjakan RH sebelum berdampak klinis",
      "Korelasi otomatis suhu–kelembapan",
      "Alert threshold yang dapat dikonfigurasi",
      "Log histori per kandang per siklus",
    ],
    visual: "humidity",
  },
  {
    id: "cloud",
    label: "Cloud Sync",
    icon: <IconCloud />,
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.08)",
    tag: "MongoDB Atlas",
    headline: "Data Tersedia, Di Mana Saja",
    desc: "Sinkronisasi otomatis ke MongoDB Atlas dengan latensi <500ms. Akses histori lengkap, tren performa, dan laporan kandang dari perangkat apapun — smartphone, tablet, atau desktop.",
    stats: [
      { label: "Latensi Sync", value: "<500ms" },
      { label: "Uptime SLA", value: "99.9%" },
      { label: "Retensi Data", value: "24 bulan" },
      { label: "Multi-device", value: "∞ akses" },
    ],
    highlights: [
      "Auto-sync setiap perubahan data sensor",
      "Dashboard histori dengan filter per siklus",
      "Export laporan PDF/CSV",
      "Enkripsi end-to-end data kandang",
    ],
    visual: "cloud",
  },
  {
    id: "hardware",
    label: "Hardware",
    icon: <IconChip />,
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.08)",
    tag: "ESP32-S3",
    headline: "Otak di Balik Kandang Pintar",
    desc: "Ditenagai ESP32-S3 N16R8 dengan dual-core 240MHz dan 16MB Flash. Menjalankan algoritma Fuzzy Logic lokal untuk respons instan tanpa bergantung penuh pada koneksi cloud.",
    stats: [
      { label: "MCU", value: "ESP32-S3" },
      { label: "Flash", value: "16MB" },
      { label: "RAM", value: "8MB PSRAM" },
      { label: "Koneksi", value: "WiFi + BLE" },
    ],
    highlights: [
      "Dual-core Xtensa LX7 @ 240MHz",
      "Onboard Fuzzy Logic controller",
      "OTA firmware update via WiFi",
      "Deep sleep mode untuk efisiensi daya",
    ],
    visual: "hardware",
  },
  {
    id: "spesifikasi",
    label: "Spesifikasi",
    icon: <IconCog />,
    accent: "#ec4899",
    accentBg: "rgba(236,72,153,0.08)",
    tag: "Sistem Lengkap",
    headline: "Spesifikasi Teknis Sistem",
    desc: "Detail lengkap komponen perangkat keras dan perangkat lunak yang membentuk ekosistem BroilerSmart — dari firmware ESP32 hingga deployment Next.js di Vercel, dirancang untuk performa optimal dan skalabilitas jangka panjang, sesuai standar industri peternakan modern, dengan fokus pada keandalan, keamanan, dan kemudahan integrasi untuk peternak di seluruh dunia.",
    stats: [
      { label: "Protokol IoT", value: "MQTT" },
      { label: "Frontend", value: "Next.js 15" },
      { label: "Database", value: "MongoDB Atlas" },
      { label: "Hosting", value: "Vercel" },
    ],
    highlights: [
      "MQTT broker untuk komunikasi ESP32 ↔ Server",
      "Next.js App Router dengan TypeScript",
      "TailwindCSS + DaisyUI untuk UI komponen",
      "Native MongoDB Driver (tanpa Mongoose)",
    ],
    visual: "spec",
  },
];

// ── Visual Decorations per Tab ──────────────────────────
function PanelVisual({ type, accent }: { type: string; accent: string }) {
  if (type === "temp") return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {[34, 32.5, 29, 27, 24].map((val, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8", width: "40px" }}>
            D{[0, 7, 14, 21, 28][i]}
          </span>
          <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${((val - 20) / 16) * 100}%`,
              background: `linear-gradient(90deg, ${accent}66, ${accent})`,
              borderRadius: "99px",
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#475569", width: "40px", textAlign: "right" }}>{val}°C</span>
        </div>
      ))}
    </div>
  );

  if (type === "humidity") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {[
        { zone: "Brooding", rh: 65, ok: true },
        { zone: "Grower", rh: 68, ok: true },
        { zone: "Finisher", rh: 72, ok: false },
        { zone: "Target", rh: 65, ok: true },
      ].map((z) => (
        <div key={z.zone} style={{
          background: z.ok ? `${accent}0d` : "rgba(239,68,68,0.06)",
          border: `1px solid ${z.ok ? accent + "33" : "rgba(239,68,68,0.25)"}`,
          borderRadius: "10px", padding: "12px 14px",
        }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>{z.zone}</div>
          <div style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 700, color: z.ok ? accent : "#ef4444" }}>{z.rh}%</div>
          <div style={{ fontSize: "10px", color: z.ok ? "#10b981" : "#ef4444", marginTop: "2px" }}>
            {z.ok ? "✓ Normal" : "⚠ Alert"}
          </div>
        </div>
      ))}
    </div>
  );

  if (type === "cloud") return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {[
        { label: "ESP32 → MQTT Broker", ms: "12ms", done: true },
        { label: "Broker → Next.js API", ms: "38ms", done: true },
        { label: "API → MongoDB Atlas", ms: "95ms", done: true },
        { label: "Atlas → Dashboard", ms: "210ms", done: true },
      ].map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: `${accent}22`, border: `1px solid ${accent}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: accent }} />
          </div>
          <div style={{ flex: 1, fontSize: "12px", color: "#475569" }}>{step.label}</div>
          <span style={{ fontFamily: "monospace", fontSize: "11px", color: accent, fontWeight: 600 }}>{step.ms}</span>
        </div>
      ))}
      <div style={{ marginTop: "4px", padding: "10px 14px", background: `${accent}0d`, borderRadius: "8px", border: `1px solid ${accent}22` }}>
        <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>Total Latency</div>
        <div style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 700, color: accent }}>355ms avg</div>
      </div>
    </div>
  );

  if (type === "hardware") return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {[
        { part: "MCU", detail: "ESP32-S3 N16R8 Dual-Core 240MHz", pct: 90 },
        { part: "Sensor", detail: "SHT31 Industrial Grade", pct: 75 },
        { part: "Power", detail: "5V DC / 500mA typical", pct: 50 },
        { part: "Connectivity", detail: "802.11 b/g/n + BLE 5.0", pct: 85 },
        { part: "Storage", detail: "16MB Flash + 8MB PSRAM", pct: 65 },
      ].map((item) => (
        <div key={item.part}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "12px", color: "#475569" }}><b style={{ color: "#0f172a" }}>{item.part}</b> · {item.detail}</span>
          </div>
          <div style={{ height: "3px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${item.pct}%`,
              background: `linear-gradient(90deg, ${accent}66, ${accent})`,
              borderRadius: "99px",
            }} />
          </div>
        </div>
      ))}
    </div>
  );

  // spec
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0", border: "1px solid #e8ecf0", borderRadius: "12px", overflow: "hidden" }}>
      {[
        ["Protokol Komunikasi", "MQTT over TCP/IP"],
        ["Framework Frontend", "Next.js 15 App Router"],
        ["Bahasa", "TypeScript 5.x"],
        ["Database Driver", "Native MongoDB (no Mongoose)"],
        ["Auth", "NextAuth v5"],
        ["Deployment", "Vercel Edge Network"],
        ["UI Library", "TailwindCSS + DaisyUI"],
        ["OTA Update", "ESP32 via HTTP/WiFi"],
      ].map(([k, v], i) => (
        <div key={k} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 14px",
          background: i % 2 === 0 ? "#fafbfc" : "#fff",
          borderBottom: "1px solid #f1f5f9",
        }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>{k}</span>
          <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 600, color: "#0f172a" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Section ────────────────────────────────────────
export default function ProdukSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [displayTab, setDisplayTab] = useState(0);
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const prevTab = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.2 }
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTabChange = (idx: number) => {
    if (idx === activeTab || animating) return;
    prevTab.current = activeTab;
    setAnimating(true);
    setTimeout(() => {
      setDisplayTab(idx);
      setActiveTab(idx);
      setAnimating(false);
    }, 220);
  };

  const tab = tabs[displayTab];

  return (
    <section
      id="produk"
      style={{
        padding: "96px 0 80px",
        background: "#b9babc0d",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px", position: "relative" }}>

        {/* ── Section Header ── */}
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
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              margin: "0 0 0 4px",
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
            <p style={{
              fontSize: "15px", color: "#64748b",
              lineHeight: 1.75, margin: 0, maxWidth: "380px",
            }}>
              Dikembangkan berdasarkan standar internasional manajemen peternakan broiler modern —
              dari sensor hingga cloud, setiap komponen dirancang untuk keandalan operasional.
            </p>
            <div style={{
              display: "flex", gap: "32px", marginTop: "28px",
              paddingTop: "24px", borderTop: "1px solid #e8ecf0",
            }}>
              {[["3", "Sensor Aktif"], ["<500ms", "Sync Latency"], ["24/7", "Monitoring"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{val}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Underline Tab Navbar ── */}
        <div style={{
          position: "relative",
          marginBottom: "0",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <div style={{
            display: "flex",
            gap: "0",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}>
            {tabs.map((t, i) => {
              const isActive = i === activeTab;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabChange(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 22px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    position: "relative",
                    whiteSpace: "nowrap" as const,
                    transition: "color 0.2s",
                    color: isActive ? t.accent : "#94a3b8",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "14px",
                  }}
                >
                  {/* Icon */}
                  <span style={{
                    opacity: isActive ? 1 : 0.5,
                    transition: "opacity 0.2s",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {t.icon}
                  </span>
                  {t.label}

                  {/* Active underline */}
                  <span style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: isActive ? t.accent : "transparent",
                    borderRadius: "2px 2px 0 0",
                    transition: "background 0.2s",
                  }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Big Panel ── */}
        <div style={{
          background: "#fff",
          border: "1px solid #e8ecf0",
          borderTop: "none",
          borderRadius: "0 0 20px 20px",
          overflow: "hidden",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.22s ease, transform 0.22s ease",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "420px",
          }}>

            {/* LEFT: Info */}
            <div style={{
              padding: "48px 48px 48px 48px",
              borderRight: "1px solid #f1f5f9",
              display: "flex",
              flexDirection: "column" as const,
            }}>
              {/* Tag */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: tab.accentBg,
                border: `1px solid ${tab.accent}33`,
                borderRadius: "6px",
                padding: "4px 12px",
                marginBottom: "20px",
                alignSelf: "flex-start",
              }}>
                <span style={{ color: tab.accent, display: "flex" }}>{tab.icon}</span>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: tab.accent,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                }}>
                  {tab.tag}
                </span>
              </div>

              {/* Headline */}
              <h3 style={{
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}>
                {tab.headline}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: "14px",
                color: "#64748b",
                lineHeight: 1.8,
                marginBottom: "32px",
                maxWidth: "420px",
              }}>
                {tab.desc}
              </p>

              {/* Highlights */}
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px", marginTop: "auto" }}>
                {tab.highlights.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%",
                      background: tab.accentBg,
                      border: `1px solid ${tab.accent}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: "1px",
                    }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={tab.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Stats + Visual */}
            <div style={{
              padding: "48px",
              background: "#fafbfc",
              display: "flex",
              flexDirection: "column" as const,
              gap: "32px",
            }}>
              {/* Stats Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}>
                {tab.stats.map((s) => (
                  <div key={s.label} style={{
                    background: "#fff",
                    border: "1px solid #e8ecf0",
                    borderRadius: "12px",
                    padding: "16px 18px",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = tab.accent + "55";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${tab.accent}12`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#e8ecf0";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "6px", fontFamily: "monospace", letterSpacing: "0.08em" }}>
                      {s.label}
                    </div>
                    <div style={{
                      fontFamily: "monospace",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: tab.accent,
                      letterSpacing: "-0.02em",
                    }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual */}
              <div style={{
                background: "#fff",
                border: "1px solid #e8ecf0",
                borderRadius: "12px",
                padding: "20px",
                flex: 1,
              }}>
                <div style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#94a3b8",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  marginBottom: "16px",
                }}>
                  Live Preview
                </div>
                <PanelVisual type={tab.visual} accent={tab.accent} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Tagline ── */}
        <div style={{
          marginTop: "48px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}>
          <div style={{ height: "1px", width: "60px", background: "#e2e8f0" }} />
          <span style={{
            fontFamily: "monospace",
            fontSize: "11px",
            color: "#94a3b8",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}>
            Standar Internasional Manajemen Broiler
          </span>
          <div style={{ height: "1px", width: "60px", background: "#e2e8f0" }} />
        </div>
      </div>

      <style>{`
        #produk button:hover { background: rgba(0,0,0,0.02) !important; }
        @media (max-width: 768px) {
          #produk [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          #produk [style*="grid-template-columns: 1fr 1fr"]:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}