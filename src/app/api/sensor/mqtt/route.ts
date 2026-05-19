export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "sensor_logs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { deviceId, temperature, humidity, age, vfd, dimmer } = body;

    if (!deviceId || temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { error: "deviceId, temperature, humidity wajib diisi" },
        { status: 400 }
      );
    }

    let deviceObjectId;
    try {
      deviceObjectId = new ObjectId(deviceId);
    } catch (e) {
      return NextResponse.json(
        { error: "Format deviceId tidak valid" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const sensorData = {
      deviceId: deviceObjectId,
      temperature: Number(temperature),
      humidity: Number(humidity),
      age: age !== undefined ? Number(age) : 0,
      vfd: vfd !== undefined ? Number(vfd) : 0,
      dimmer: dimmer !== undefined ? Number(dimmer) : 0,
      timestamp: new Date(),
      createdAt: new Date(),
    };

    await db.collection(COLLECTION_NAME).insertOne(sensorData);

    console.log("[MQTT-API] Data saved:", sensorData);

    return NextResponse.json({ 
      success: true, 
      message: "Data berhasil disimpan" 
    });

  } catch (error: any) {
    console.error("[MQTT-API] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}