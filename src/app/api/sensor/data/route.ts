export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { ISensorLog } from "@/models/SensorLog";

const COLLECTION_NAME = "sensor_logs";
const TTL_SECONDS = 90 * 24 * 60 * 60;

async function ensureIndexes(db: any) {
  const collection = db.collection(COLLECTION_NAME);
  
  await collection.createIndex(
    { timestamp: -1, deviceId: 1 },
    { name: "compound_query" }
  );

  await collection.createIndex(
    { createdAt: 1 },
    { 
      name: "ttl_index", 
      expireAfterSeconds: TTL_SECONDS 
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, apiKey, temperature, humidity, age, vfd, dimmer } = body;

    if (!deviceId || !apiKey || temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { error: "Field deviceId, apiKey, temperature, dan humidity wajib diisi" },
        { status: 400 }
      );
    }

    if (age === undefined || vfd === undefined || dimmer === undefined) {
      return NextResponse.json(
        { error: "Field age, vfd, dan dimmer wajib diisi" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(deviceId)) {
      return NextResponse.json({ error: "Format deviceId tidak valid" }, { status: 400 });
    }

    if (age < 0 || age > 50 || vfd < 0 || vfd > 100 || dimmer < 0 || dimmer > 100) {
      return NextResponse.json(
        { error: "age harus 0-50, vfd dan dimmer harus 0-100" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    await ensureIndexes(db);

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

    const now = new Date();
    const sensorData: ISensorLog = {
      deviceId: new ObjectId(deviceId),
      temperature: Number(temperature),
      humidity: Number(humidity),
      age: Number(age),
      vfd: Number(vfd),
      dimmer: Number(dimmer),
      timestamp: now,
      createdAt: now,
    };

    await db.collection(COLLECTION_NAME).insertOne(sensorData);

    return NextResponse.json({ 
      success: true, 
      message: "Data berhasil disimpan di MongoDB" 
    });

  } catch (error: any) {
    console.error("Error pada POST Sensor Data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");
    const limit = Math.min(Number(searchParams.get("limit") || "50"), 200);
    const range = searchParams.get("range") || "1h";

    if (!deviceId || !ObjectId.isValid(deviceId)) {
      return NextResponse.json({ error: "deviceId tidak valid atau kosong" }, { status: 400 });
    }

    let startTime = new Date();
    const rangeValue = parseInt(range.replace(/[^0-9]/g, ""));
    const rangeUnit = range.replace(/[0-9]/g, "").toLowerCase();
    
    if (rangeUnit === "h") {
      startTime.setHours(startTime.getHours() - rangeValue);
    } else if (rangeUnit === "d") {
      startTime.setDate(startTime.getDate() - rangeValue);
    } else if (rangeUnit === "m") {
      startTime.setMinutes(startTime.getMinutes() - rangeValue);
    }

    const client = await clientPromise;
    const db = client.db();

    const data = await db
      .collection<ISensorLog>(COLLECTION_NAME)
      .find({
        deviceId: new ObjectId(deviceId),
        timestamp: { $gte: startTime },
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error pada GET Sensor Data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari MongoDB", details: error.message },
      { status: 500 }
    );
  }
}