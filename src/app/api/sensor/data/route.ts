export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db"; // Singleton MongoDB
import { queryClient, influxClient, BUCKET } from "@/lib/influx"; // Konfigurasi InfluxDB
import { Point } from "@influxdata/influxdb-client";
import { ObjectId } from "mongodb";

// Ambil variabel lingkungan untuk InfluxDB
const org = process.env.INFLUX_ORG || "";

/**
 * ── POST /api/sensor/data ───────────────────────────────────────
 * Alur: ESP32 -> NextJS -> Validasi Mongo -> Simpan InfluxDB
 * Tujuan: Menangani penulisan data cepat (High-frequency writes)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, apiKey, temperature, humidity } = body;

    // 1. Validasi Input Dasar
    if (!deviceId || !apiKey || temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { error: "Field deviceId, apiKey, temperature, dan humidity wajib diisi" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(deviceId)) {
      return NextResponse.json({ error: "Format deviceId tidak valid" }, { status: 400 });
    }

    // 2. Validasi Keamanan & Identitas (Domain MongoDB)
    const client = await clientPromise;
    const db = client.db();
    
    // Mencari perangkat yang sudah di-claim dan memiliki API Key yang cocok
    const device = await db.collection("devices").findOne({
      _id: new ObjectId(deviceId),
      apiKey: apiKey,
      claimed: true,
    });

    if (!device) {
      return NextResponse.json(
        { error: "Autentikasi gagal: Perangkat tidak ditemukan atau API Key salah" },
        { status: 401 }
      );
    }

    // 3. Penyimpanan Data Time-Series (Domain InfluxDB)
    // Kita tidak lagi menyimpan ke MongoDB 'sensor_logs' untuk efisiensi
    const writeApi = influxClient.getWriteApi(org, BUCKET);
    
    const point = new Point("sensor_data")
      .tag("kandang_id", deviceId) // Tag digunakan untuk filtering cepat
      .floatField("temperature", Number(temperature))
      .floatField("humidity", Number(humidity))
      .timestamp(new Date()); // Menggunakan waktu server saat ini

    writeApi.writePoint(point);
    
    // Penting: Tutup writeApi untuk memastikan data ter-flush ke server InfluxDB
    await writeApi.close();

    return NextResponse.json({ 
      success: true, 
      message: "Data berhasil disimpan di InfluxDB" 
    });

  } catch (error: any) {
    console.error("Error pada POST Sensor Data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * ── GET /api/sensor/data ────────────────────────────────────────
 * Alur: Dashboard -> NextJS -> Query Flux InfluxDB -> Result
 * Tujuan: Mengambil data historis untuk grafik secara instan
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");
    
    // Range waktu fleksibel, default 1 jam terakhir (-1h)
    const timeRange = searchParams.get("range") || "-1h"; 

    if (!deviceId || !ObjectId.isValid(deviceId)) {
      return NextResponse.json({ error: "deviceId tidak valid atau kosong" }, { status: 400 });
    }

    /**
     * Query Flux:
     * 1. Ambil data dari bucket
     * 2. Filter berdasarkan waktu dan ID kandang
     * 3. Pivot: mengubah data dari baris per field menjadi satu objek per waktu
     * 4. Sort: data terbaru muncul di atas
     */
    const fluxQuery = `
      from(bucket: "${BUCKET}")
        |> range(start: ${timeRange})
        |> filter(fn: (r) => r["_measurement"] == "sensor_data")
        |> filter(fn: (r) => r["kandang_id"] == "${deviceId}")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: true)
    `;

    const data = await queryClient.collectRows(fluxQuery);
    
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error pada GET Sensor Data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari InfluxDB", details: error.message },
      { status: 500 }
    );
  }
}