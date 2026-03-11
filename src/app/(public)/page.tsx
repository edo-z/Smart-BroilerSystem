"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import {
  FaTemperatureHigh,
  FaTint,
  FaMicrochip,
  FaWifi,
  FaCheckCircle,
  FaBook,
  FaArrowRight,
  FaFire,
  FaAdjust,
  FaFan,
  FaCheck,
  FaReact,
  FaBrain
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import SplitText from "../../component/SplitText";
import BlurText from "../../component/BlurText";
import FadeContent from '../../component/FadeContent'
import TiltedCard from '../../component/TiltedCard';
import GradientText from "@/component/GradientText";
import CountUp from "@/component/CountUp";
import LogoLoop from '@/component/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';
import ProdukSection from "@/components/public/fitur/page";
import MonitoringSection from "@/components/public/monitoring/page";
import { ProdukSectionWithNav } from "@/components/public/produk/page";

// Icon SVGs inline
const IconTemp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);
const IconDroplet = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
const IconCloud = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];
// Alternative with image sources
const imageLogos = [
  { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
  { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];
const features = [
  {
    id: "01",
    icon: <IconTemp />,
    label: "SENSOR PRESISI",
    title: "Akurasi Industri, Data Nyata",
    desc: "Sensor SHT31 industrial-grade dengan akurasi ±0.5°C dan resolusi 0.01°C. Setiap titik data dikalibrasi terhadap standar NIST untuk keandalan yang tak diragukan.",
    stat: "---°C",
    statLabel: "Akurasi Suhu",
    accent: "#0ea5e9",
    accentBg: "rgba(14,165,233,0.06)",
    bar: 92,
  },
  {
    id: "02",
    icon: <IconDroplet />,
    label: "HUMIDITY CONTROL",
    title: "Cegah CRD Sebelum Terjadi",
    desc: "Monitoring kelembaban real-time untuk menjaga RH pada zona optimal 60–70%. Deviasi terdeteksi dalam <3 detik, sebelum berdampak pada sistem pernapasan ayam.",
    stat: "---s",
    statLabel: "Waktu Deteksi",
    accent: "#6366f1",
    accentBg: "rgba(99,102,241,0.06)",
    bar: 78,
  },
  {
    id: "03",
    icon: <IconCloud />,
    label: "CLOUD SYNC",
    title: "Data Tersedia, Di Mana Saja",
    desc: "Sinkronisasi otomatis ke MongoDB Atlas dengan latensi <500ms. Akses histori, tren, dan laporan performa kandang dari perangkat apapun, kapanpun.",
    stat: "---%",
    statLabel: "Uptime SLA",
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.06)",
    bar: 99,
  },
];

// --- Feature Card Component ---
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const [barFill, setBarFill] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(true);
            setTimeout(() => setBarFill(feature.bar), 300);
          }, index * 120);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        background: "#fff",
        border: "1px solid #e8ecf0",
        borderRadius: "16px",
        padding: "36px 32px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = feature.accent;
        el.style.boxShadow = `0 8px 40px ${feature.accent}18`;
        el.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#e8ecf0";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Ambient gradient */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "140px", height: "140px",
        background: `radial-gradient(circle at top right, ${feature.accent}14, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Label + Index */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <span style={{
          fontFamily: "monospace",
          fontSize: "11px",
          fontWeight: 600,
          color: feature.accent,
          letterSpacing: "0.12em",
        }}>
          {feature.label}
        </span>
        <span style={{
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#c8d0d8",
          fontWeight: 500,
        }}>
          {feature.id}
        </span>
      </div>

      {/* Icon */}
      <div style={{
        width: "48px", height: "48px",
        borderRadius: "12px",
        background: feature.accentBg,
        border: `1px solid ${feature.accent}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: feature.accent,
        marginBottom: "20px",
      }}>
        {feature.icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: "18px",
        fontWeight: 700,
        color: "#0f172a",
        lineHeight: 1.3,
        marginBottom: "12px",
        letterSpacing: "-0.01em",
      }}>
        {feature.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: "14px",
        color: "#64748b",
        lineHeight: 1.7,
        marginBottom: "28px",
        flexGrow: 1,
      }}>
        {feature.desc}
      </p>

      {/* Divider */}
      <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "20px" }} />

      {/* Stat + Progress */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: "22px",
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}>
            {feature.stat}
          </span>
          <span style={{
            fontSize: "12px",
            color: "#94a3b8",
            fontWeight: 500,
          }}>
            {feature.statLabel}
          </span>
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
    </div>
  );
}

const SplitTex = () => {
  console.log('All letters have animated!');
};
const BlurTex = () => {
  console.log('Animation completed!');
};

// Registrasi Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function LandingPage() {

  // Heading visibility for produk section
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setHeadingVisible(true);
    }, { threshold: 0.2 });
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  // --- CONFIG CHART ---
  const chartData = {
    labels: ["0 Hari", "7 Hari", "14 Hari", "21 Hari", "28 Hari", "32 Hari"],
    datasets: [
      {
        label: "Suhu Ideal (°C)",
        data: [34, 32.5, 29, 27, 24.5, 24],
        borderColor: "#3b82f6",
        backgroundColor: (context: any) => {
          const ctx = context.chart?.ctx;
          if (!ctx) return "rgba(59, 130, 246, 0.2)";
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)");
          gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#3b82f6",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { family: "sans-serif", size: 13 },
        bodyFont: { family: "sans-serif", size: 13 },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `Target: ${context.parsed.y}°C`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 20,
        max: 36,
        grid: { color: "#f1f5f9", drawBorder: false },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: function (value: any) { return value + "°C"; }
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } }
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-700 flex flex-col antialiased">

      {/* ========================================= */}
      {/* 1. HERO SECTION                           */}
      {/* ========================================= */}
      <div
        id="home"
        className="hero min-h-screen pb-20 py-auto relative overflow-hidden"
        style={{
          backgroundImage: "url('')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white backdrop-blur-sm z-0" />
        <div className="hero-content text-center max-w-6xl flex-col lg:flex-row gap-16 px-4 relative z-10">

          <div className="w-full text-center space-y-10">
            <SplitText
              text="AVESIS"
              className="text-8xl font-bold leading-tight text-black font-serif mb-1"
              delay={100}
              duration={1.05}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={SplitTex}
            />
            <BlurText
              className="text-lg text-slate-700 leading-tight font-semibold justify-center mb-1"
              text='"Empowering Humans with Precision Automation"'
              delay={60}
              animateBy="letters"
              direction="bottom"
              onAnimationComplete={BlurTex} animationFrom={undefined} animationTo={undefined} />

            <BlurText
              className="text-lg text-slate-700 leading-tight font-medium justify-center mt-3"
              text="Membangun Masa Depan dengan Ketepatan"
              delay={65}
              animateBy="letters"
              direction="bottom"
              onAnimationComplete={BlurTex} animationFrom={undefined} animationTo={undefined} />

            <div className="gap-4 pt-auto">
              <div className="ga-4 pt-auto mb-4">
                <Link href="/login" className="btn btn-outline bg-white/50 hover:bg-slate-900 border-none hover:text-white text-slate-900 px-auto rounded-lg shadow-xl transition-shadow font-semibold backdrop-blur-sm z-0">
                  <BlurText
                    text="Mulai Sekarang!"
                    delay={50}
                    animateBy="letters"
                    direction="bottom"
                    onAnimationComplete={BlurTex} animationFrom={undefined} animationTo={undefined} />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white">
            <TiltedCard
              imageSrc='../../../public/images/white.webp'
              altText=''
              captionText="Kandang A1"
              containerHeight="400px"
              containerWidth="400px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={-12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip
              displayOverlayContent
              overlayContent={
                <div className="relative justify-center animate-fade-in z-0">
                  <div className="w-full max-w-md bg-white backdrop-blur-md p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-blue-300">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-sm font-semibold text-shadow-slate-800">Kandang A1 - Online</span>
                      </div>
                      <span className="text-xs font-mono text-black/40">ID: 261E5CDB</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/10 p-4 rounded-2xl border border-blue-300 hover:shadow-xl">
                        <div className="text-xs text-black/50 uppercase font-semibold mb-1">Suhu</div>
                        <div className="text-3xl font-bold text-slate-700">28.5<span className="text-sm text-slate-900 ml-1">°C</span></div>
                        <div className="text-xs font-semibold text-black/50 mt-1">Target Terpenuhi</div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-2xl border border-blue-300 hover:shadow-xl">
                        <div className="text-xs text-black/50 uppercase font-semibold mb-1">Kelembapan</div>
                        <div className="text-3xl font-bold text-slate-700">64<span className="text-sm text-slate-900 ml-1">%</span></div>
                        <div className="text-xs font-semibold text-black/50 mt-1">Rentang Normal</div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 flex items-center gap-4 border border-blue-300 hover:shadow-xl">
                      <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-normal mb-1">
                          <span className="text-slate-900 font-normal">Kenyamanan Kandang</span>
                          <span className="text-blue-600 font-bold">85%</span>
                        </div>
                        <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-400 h-full w-[85%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. FITUR / PRODUK SECTION (REDESIGNED)   */}
      {/* ========================================= */}
      

        <ProdukSection />
        <ProdukSectionWithNav /> 
      

      {/* ========================================= */}
      {/* 3. MONITORING / GRAFIK BIOLOGIS           */}
      {/* ========================================= */}
      
        <MonitoringSection />
      

      {/* ========================================= */}
      {/* 5. TIPS & CTA                              */}
      {/* ========================================= */}
      <section id="tips" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-10 md:p-14">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Mau Jadi Bagian Dalam Tim Pengembang?</h2>
              <p className="text-slate-700 mb-8">
                Kami selalu mencari individu yang passionate untuk bergabung dalam perjalanan inovasi kami. Jika Anda tertarik untuk berkontribusi pada proyek open-source kami.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-slate-700">
                <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-400" /> Bergabung dengan Tim</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-400" /> Kontribusi pada Proyek</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-400" /> Dukungan Komunitas</li>
              </ul>
              <a href="https://github.com/edo-z/Smart-BroilerSystem" className="btn btn-primary w-full btn-outline border-slate-700  text-slate-900  hover:bg-slate-900  hover:text-white">
                <FaBook className="ml-2" />Source Code
              </a>
            </div>

            <div className="w-full md:w-1/2 bg-slate-900 p-10 md:p-14 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Siap Mempelajari Produk Kami?</h3>
              <p className="text-slate-400 mb-8">
                Semua dokumentasi teknis, panduan instalasi, dan tips pemeliharaan tersedia untuk memastikan Anda mendapatkan hasil maksimal dari sistem kami.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-400" /> Dokumentasi Teknis Lengkap</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-400" /> Panduan Instalasi</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-400" /> Tips Pemeliharaan</li>
              </ul>
              <a href="/docs/overview" className="btn btn-primary w-full btn-outline border-white text-white hover:bg-white hover:text-slate-900">
                Lihat Dokumentasi <FaBook className="ml-2" />
              </a>
            </div>
          </div>

          {/* Tech Stack Strip */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold mb-6">
                Powered By Modern Technology
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-slate-600 text-sm font-medium">
                <Link href="/docs" className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <FaMicrochip /> <span>ESP32S3 N16R8</span>
                </Link>
                <Link href="/docs/logic" className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <FaBrain /> <span>Fuzzy Logic</span>
                </Link>
                <Link href="/docs/software" className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <FaWifi /> <span>MQTT IoT</span>
                </Link>
                <Link href="/docs/software" className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <FaReact /> <span>Next.js</span>
                </Link>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold mt-8 mb-8">
                And More in Our Open-Source Stack
              </p>
              <div style={{ height: '60px', position: 'relative', overflow: 'hidden' }} >
                {/* Basic horizontal loop */}
                <LogoLoop
                  logos={techLogos}
                  speed={100}
                  direction="left"
                  logoHeight={50}
                  gap={80}
                  hoverSpeed={30}
                  scaleOnHover
                  fadeOut
                  fadeOutColor="#ffffff"
                  ariaLabel="Technology partners"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}