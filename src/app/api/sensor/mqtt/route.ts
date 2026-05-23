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
      expireAfterSeconds: TTL_SECONDS,
    }
  );
}

function extractDeviceIdFromTopic(topic: string): string | null {
  const match = topic.match(/^device\/([^/]+)\/data$/);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    // Validasi webhook secret (opsional, jika env var diset)
    const webhookSecret = process.env.EMQX_WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = req.headers.get("authorization");
      const secretParam = authHeader?.replace("Bearer ", "") || "";
      if (secretParam !== webhookSecret) {
        console.warn("[MQTT Webhook] Invalid secret");
        return NextResponse.json(
          { error: "Unauthorized: Invalid webhook secret" },
          { status: 401 }
        );
      }
    }

    const body = await req.json();

    // EMQX Webhook bisa mengirim dalam format wrapper ({payload: ...})
    // atau langsung sebagai raw JSON ({deviceId: ..., ...})
    let sensorPayload: any;

    if (body.payload) {
      if (typeof body.payload === "string") {
        try {
          sensorPayload = JSON.parse(body.payload);
        } catch {
          console.error("[MQTT Webhook] Gagal parse payload string:", body.payload);
          return NextResponse.json(
            { error: "Invalid payload format" },
            { status: 400 }
          );
        }
      } else if (typeof body.payload === "object") {
        sensorPayload = body.payload;
      } else {
        return NextResponse.json(
          { error: "Unsupported payload type" },
          { status: 400 }
        );
      }
    } else if (body.deviceId && body.apiKey) {
      // Raw format: body langsung berisi data sensor
      sensorPayload = body;
    } else {
      return NextResponse.json(
        { error: "Missing payload field" },
        { status: 400 }
      );
    }

    const { deviceId, apiKey, temperature, humidity, age, vfd, dimmer } = sensorPayload;

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
      return NextResponse.json(
        { error: "Format deviceId tidak valid" },
        { status: 400 }
      );
    }

    if (age < 0 || age > 50 || vfd < 0 || vfd > 255 || dimmer < 0 || dimmer > 255) {
      return NextResponse.json(
        { error: "age harus 0-50, vfd dan dimmer harus 0-255 (PWM 8-bit)" },
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

    console.log("[MQTT Webhook] Data tersimpan:", {
      deviceId,
      temperature,
      humidity,
      age,
      vfd,
      dimmer,
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil disimpan via MQTT Webhook",
    });
  } catch (error: any) {
    console.error("[MQTT Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
