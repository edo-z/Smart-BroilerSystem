# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BroilerSmart/AVESIS - Aplikasi monitoring kandang ayam broiler dengan IoT. Dashboard Next.js menerima data suhu/kelembaban dari ESP32 melalui MQTT, disimpan di InfluxDB untuk time-series dan MongoDB untuk metadata.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

### Route Groups (App Router)

```
src/app/
├── (public)/       # Landing page, login, register (tanpa auth)
├── (dashboard)/    # Dashboard, riwayat, pengaturan (memerlukan auth)
└── (docs)/         # Dokumentasi produk
```

### Authentication Flow

1. NextAuth v5 beta dengan JWT strategy (tidak ada session database)
2. `src/auth.ts` - konfigurasi utama: providers (Google OAuth + Credentials), callbacks, adapter MongoDB
3. `src/auth.config.ts` - konfigurasi route protection untuk middleware
4. `src/middleware.ts` - proteksi route `/dashboard`, redirect dari `/login`, `/register` jika sudah login
5. `src/actions/auth-actions.ts` - Server Actions untuk login/register/logout

### Database Stack

| Database | Kegunaan |
|----------|----------|
| MongoDB | User accounts, device metadata, API keys |
| InfluxDB | Time-series sensor data (temperature, humidity) |

**MongoDB Connection (`src/lib/db.ts`)**:
- Singleton pattern dengan global caching di development mode
- Menggunakan `clientPromise` untuk koneksi yang reusable

**InfluxDB (`src/lib/influx.ts`)**:
- `queryClient` untuk Flux queries
- `influxClient.getWriteApi()` untuk menulis data sensor

### API Routes

| Route | Method | Fungsi |
|-------|--------|--------|
| `/api/auth/[...nextauth]` | ALL | NextAuth handlers |
| `/api/devices` | GET, POST | List/create devices user |
| `/api/devices/[id]` | GET, PUT, DELETE | Single device operations |
| `/api/devices/register` | POST | Claim device dengan claimCode |
| `/api/sensor/data` | POST, GET | ESP32 kirim data / Dashboard ambil grafik |
| `/api/sensor/register` | POST | Registrasi device baru |
| `/api/logs` | GET | Sensor logs (MongoDB fallback) |

### Sensor Data Flow

1. ESP32 POST ke `/api/sensor/data` dengan `{deviceId, apiKey, temperature, humidity}`
2. API validasi device di MongoDB (apiKey match + claimed = true)
3. Data disimpan ke InfluxDB sebagai Point dengan tag `kandang_id`
4. Dashboard query InfluxDB via Flux query untuk grafik

### Models (TypeScript Interfaces)

```typescript
// src/models/Device.ts
interface IDevice {
  userId: ObjectId;      // ref → users._id
  name: string;          // "Kandang A1"
  capacity: number;      // jumlah ayam
  active: boolean;
  apiKey: string;        // autentikasi ESP32 (64 char hex)
  claimCode: string;     // kode QR setup (8 char)
  claimed: boolean;     // false = belum diklaim
  createdAt: Date;
}

// src/models/SensorLog.ts
interface ISensorLog {
  _time: string;         // ISO string dari InfluxDB
  kandang_id: string;    // Tag untuk filtering
  temperature: number;
  humidity: number;
  _measurement: string;  // "sensor_data"
}
```

## Key Components

- `src/component/` - Animation components (GSAP/Motion): SplitText, BlurText, TiltedCard, FadeContent, ScrollReveal, dll.
- `src/components/auth/LogoutButton.tsx` - Logout button dengan server action
- `src/components/dashboard/SidebarNav.tsx` - Sidebar navigasi dashboard
- `src/components/providers/SessionProvider.tsx` - NextAuth session provider wrapper

## Tech Stack

- **Framework**: Next.js 16.2.1 dengan App Router
- **React**: 19.2.3 dengan React Compiler (`reactCompiler: true` di next.config.ts)
- **Auth**: NextAuth v5 beta, bcryptjs untuk password hashing
- **Database**: MongoDB (mongodb driver), InfluxDB (time-series)
- **Styling**: Tailwind CSS 4, DaisyUI 5
- **Animation**: GSAP 3, Motion 12
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: lucide-react, react-icons

## Environment Variables

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

## Code Conventions

- Path alias: `@/*` maps to `./src/*`
- Server Components default, gunakan `"use client"` directive untuk client components
- `export const dynamic = "force-dynamic"` untuk route dengan data fresh
- `export const runtime = "nodejs"` di API routes untuk menghindari edge runtime issues dengan MongoDB
- TypeScript interfaces untuk models di `src/models/`
- API routes menggunakan `auth()` dari NextAuth untuk validasi session
- Komentar kode dalam Bahasa Indonesia
- Gunakan `suppressHydrationWarning` pada komponen yang render data real-time (untuk menghindari hydration mismatch dengan timestamp)

## Common Patterns

### MongoDB Client Singleton (Development)

```typescript
// Pattern untuk mencegah hot-reload membuat koneksi baru
let clientPromise: Promise<MongoClient>;
if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
}
```

### InfluxDB Write

```typescript
const writeApi = influxClient.getWriteApi(org, BUCKET);
const point = new Point("sensor_data")
  .tag("kandang_id", deviceId)
  .floatField("temperature", temperature)
  .floatField("humidity", humidity)
  .timestamp(new Date());
writeApi.writePoint(point);
await writeApi.close(); // Penting: flush data
```

### InfluxDB Flux Query

```typescript
const fluxQuery = `
  from(bucket: "${BUCKET}")
    |> range(start: -1h)
    |> filter(fn: (r) => r["_measurement"] == "sensor_data")
    |> filter(fn: (r) => r["kandang_id"] == "${deviceId}")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> sort(columns: ["_time"], desc: true)
`;
const data = await queryClient.collectRows(fluxQuery);
```