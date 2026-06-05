"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaMicrochip,
  FaWifi,
  FaCheckCircle,
  FaBook,
  FaReact,
  FaBrain
} from "react-icons/fa";
import SplitText from "../../component/SplitText";
import BlurText from "../../component/BlurText";
import TiltedCard from '../../component/TiltedCard';
import LogoLoop from '@/component/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';
import ProdukSectionMerged from "@/components/public/produk/page";
import MonitoringSection from "@/components/public/monitoring/page";

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



const SplitTex = () => {
  console.log('All letters have animated!');
};
const BlurTex = () => {
  console.log('Animation completed!');
};


export default function LandingPage() {

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-700 flex flex-col antialiased">

      {/* ========================================= */}
      {/* 1. HERO SECTION                           */}
      {/* ========================================= */}
      <div
        id="home"
        className="hero min-h-screen pb-20 py-auto relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white backdrop-blur-sm z-0" />
        <div className="hero-content text-center max-w-6xl flex-col lg:flex-row gap-8 lg:gap-16 px-4 relative z-10">

          <div className="w-full text-center space-y-10">
            <SplitText
              text="AVESIS"
              className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight text-black font-serif mb-1"
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
              <div className="gap-4 pt-auto mb-4">
                <Link href="/login" className="btn btn-outline bg-white/50 hover:bg-slate-900 border-none hover:text-white text-slate-900 px-8 rounded-lg shadow-xl transition-shadow font-semibold backdrop-blur-sm z-0">
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
              imageSrc='/images/white.webp'
              altText=''
              captionText="Kandang A1"
              containerHeight="400px"
              containerWidth="min(400px, 85vw)"
              imageHeight="300px"
              imageWidth="min(300px, 70vw)"
              rotateAmplitude={-12}
              scaleOnHover={1.05}
              showMobileWarning
              showTooltip
              displayOverlayContent
              overlayContent={
                <div className="relative justify-center animate-fade-in z-0">
                  <div className="w-full max-w-md bg-white backdrop-blur-md p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-blue-300">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-sm font-semibold text-slate-800">Kandang A1 - Online</span>
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
      {/* 2. FITUR / PRODUK SECTION               */}
      {/* ========================================= */}
      
        <ProdukSectionMerged />
      

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
            <div className="w-full md:w-1/2 p-6 md:p-14">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Terpercaya di Berbagai Kandang</h2>
              <p className="text-slate-700 mb-8">
                Sistem BroilerSmart telah diuji dan berjalan di berbagai lingkungan produksi — dari kandang closed-house skala kecil hingga menengah.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-blue-600">99.9%</div>
                  <div className="text-xs text-slate-500 mt-1">Uptime Monitoring</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-indigo-600">&lt;500ms</div>
                  <div className="text-xs text-slate-500 mt-1">Latensi Data</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-emerald-600">24/7</div>
                  <div className="text-xs text-slate-500 mt-1">Operasi Otomatis</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-amber-600">100%</div>
                  <div className="text-xs text-slate-500 mt-1">Open Source</div>
                </div>
              </div>
              <a href="https://github.com/edo-z/Smart-BroilerSystem" className="btn btn-primary w-full btn-outline border-slate-700 text-slate-900 hover:bg-slate-900 hover:text-white">
                <FaBook className="ml-2" />Source Code
              </a>
            </div>

            <div className="w-full md:w-1/2 bg-slate-900 p-6 md:p-14 text-white flex flex-col justify-center">
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