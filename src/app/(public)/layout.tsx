
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Navbar HANYA muncul di halaman public */}
            <Navbar />

            {/* Konten halaman (Home, Login, dll) muncul di bawah Navbar */}
            {children}

            {/* Footer HANYA muncul di halaman public */}
            <Footer />
        </>
    );
}