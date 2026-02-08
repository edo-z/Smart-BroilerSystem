import React from "react";
import SidebarDocs from "@/components/docs/SidebarDocs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    // Container utama halaman dokumentasi
    <div className="bg-slate-50 min-h-screen pt-20">
      {/* Navbar HANYA muncul di halaman public */}
          <Navbar />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          

          {/* 1. SIDEBAR NAVIGATION */}
          <SidebarDocs />

          {/* 2. KONTEN UTAMA (Place holder untuk halaman) */}
          <main className="flex-1 min-w-0">
            <article className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-200">
              {children}
            </article>
          </main>

          

        </div>
      </div>
      {/* Footer HANYA muncul di halaman public */}
          <Footer />
    </div>
  );
}