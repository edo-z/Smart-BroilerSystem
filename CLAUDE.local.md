# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BroilerSmart/AVESIS - Aplikasi monitoring kandang ayam broiler dengan IoT. Aplikasi ini memonitoring suhu dan kelembaban menggunakan sensor SHT31 yang terhubung ke ESP32, dengan data disimpan di MongoDB dan InfluxDB.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Route Groups (App Router)

- `(public)/` - Landing page, login, register (tanpa autentikasi)
- `(dashboard)/` - Dashboard, riwayat, pengaturan (memerlukan autentikasi)
- `(docs)/` - Dokumentasi produk

### Authentication

- NextAuth v5 (beta) dengan JWT strategy
- Providers: Google OAuth dan Credentials (email/password)
- Middleware: `src/middleware.ts` - proteksi route `/dashboard` dan redirect dari `/login`, `/register` jika sudah login
- Server Actions: `src/actions/auth-actions.ts` untuk login/register/logout

### Database

- **MongoDB** - User accounts, devices, metadata
- **InfluxDB** - Time-series sensor data (suhu, kelembaban)

Koneksi database:
- `src/lib/db.ts` - MongoDB client promise
- `src/lib/influx.ts` - InfluxDB query client

### Models (TypeScript Interfaces)

- `IDevice` (`src/models/Device.ts`) - Device IoT dengan apiKey dan claimCode untuk ESP32
- `ISensorLog` (`src/models/SensorLog.ts`) - Log sensor (suhu, kelembaban)

### API Routes

- `/api/auth/[...nextauth]` - NextAuth handlers
- `/api/devices` - CRUD devices user
- `/api/devices/[id]` - Single device operations
- `/api/logs` - Sensor logs
- `/api/sensor/*` - Sensor endpoints untuk ESP32

### Key Components

- `src/component/` - Animation components (GSAP/Motion): SplitText, BlurText, TiltedCard, FadeContent, ScrollReveal, etc.
- `src/components/auth/` - LogoutButton
- `src/components/dashboard/` - SidebarNav
- `src/components/public/` - Landing page sections (fitur, produk, monitoring)
- `src/components/providers/SessionProvider.tsx` - NextAuth session provider

## Environment Variables Required

```
MONGODB_URI=mongodb://...
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
INFLUX_URL=...
INFLUX_TOKEN=...
INFLUX_ORG=...
INFLUX_BUCKET=...
```

## Tech Stack

- **Framework**: Next.js 16.2.1 dengan App Router
- **React**: 19.2.3 dengan React Compiler (`reactCompiler: true` di next.config.ts)
- **Auth**: NextAuth v5 beta, bcryptjs
- **Database**: MongoDB (via mongodb driver), InfluxDB (time-series)
- **Styling**: Tailwind CSS 4, DaisyUI 5
- **Animation**: GSAP 3, Motion 12
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: lucide-react, react-icons

## Code Conventions

- Path alias: `@/*` maps to `./src/*`
- Server Components default, gunakan `"use client"` directive untuk client components
- Gunakan `export const dynamic = "force-dynamic"` untuk route yang memerlukan data fresh
- TypeScript interfaces untuk models ditempatkan di `src/models/`
- API routes menggunakan NextAuth `auth()` untuk validasi session
- Komentar kode dalam Bahasa Indonesia