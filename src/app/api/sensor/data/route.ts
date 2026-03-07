// src/app/api/sensor/data/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { IDevice } from "@/models/Device";
import { ISensorLog } from "@/models/SensorLog";
import { ObjectId } from "mongodb";

// ── POST /api/sensor/data ─────────────────────────────────
// Dipanggil ESP32 setiap 1 menit untuk kirim data sensor
// Body: { deviceId: "xxx", apiKey: "xxx", temperature: 31.5, humidity: 64 }
export async function POST(req: Request) {
  const body = await req.json();
  const { deviceId, apiKey, temperature, humidity } = body;

  // Validasi field wajib
  if (!deviceId || !apiKey || temperature === undefined || humidity === undefined) {
    return NextResponse.json(
      { error: "deviceId, apiKey, temperature, humidity wajib diisi" },
      { status: 400 }
    );
  }

  if (!ObjectId.isValid(deviceId)) {
    return NextResponse.json({ error: "deviceId tidak valid" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Validasi apiKey — pastikan device terdaftar dan apiKey cocok
  const device = await db
    .collection<IDevice>("devices")
    .findOne({
      _id: new ObjectId(deviceId),
      apiKey: apiKey,
      claimed: true,
    });

  if (!device) {
    return NextResponse.json(
      { error: "Device tidak dikenali atau apiKey salah" },
      { status: 401 }
    );
  }

  // Simpan data sensor
  const log: ISensorLog = {
    deviceId: new ObjectId(deviceId),
    temperature: Number(temperature),
    humidity: Number(humidity),
    recordedAt: new Date(),
  };

  await db.collection<ISensorLog>("sensor_logs").insertOne(log);

  return NextResponse.json({ success: true });
}

// ── GET /api/sensor/data?deviceId=xxx&limit=100 ───────────
// Dipanggil dashboard untuk polling data terbaru
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");
  const limit = Math.min(Number(searchParams.get("limit") ?? "100"), 500);

  if (!deviceId || !ObjectId.isValid(deviceId)) {
    return NextResponse.json({ error: "deviceId tidak valid" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Ambil data terbaru, diurutkan dari yang terbaru
  const logs = await db
    .collection<ISensorLog>("sensor_logs")
    .find({ deviceId: new ObjectId(deviceId) })
    .sort({ recordedAt: -1 })
    .limit(limit)
    .toArray();

  return NextResponse.json(logs);
}