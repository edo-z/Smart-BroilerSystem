export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import mqtt from "mqtt";

const EMQX_BROKER = "mqtts://pa120029.ala.asia-southeast1.emqxsl.com";
const EMQX_PORT = 8883;
const EMQX_USER = "aldoo";
const EMQX_PASS = "Ew4ld012345";

export async function POST(req: Request) {
  try {
    const { deviceId, version } = await req.json();

    if (!deviceId || !version) {
      return NextResponse.json(
        { error: "deviceId dan version wajib diisi" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const firmware = await db.collection("firmwares").findOne(
      { version },
      { sort: { uploadedAt: -1 } }
    );

    if (!firmware) {
      return NextResponse.json(
        { error: "Firmware version tidak ditemukan" },
        { status: 404 }
      );
    }

    const device = await db.collection("devices").findOne(
      { _id: new ObjectId(deviceId) }
    );

    if (!device) {
      return NextResponse.json(
        { error: "Device tidak ditemukan" },
        { status: 404 }
      );
    }

    const mqttClient = mqtt.connect(EMQX_BROKER, {
      port: EMQX_PORT,
      username: EMQX_USER,
      password: EMQX_PASS,
      clientId: `dashboard-${Date.now()}`,
      reconnectPeriod: 5000,
      rejectUnauthorized: false,
    });

    return new Promise<NextResponse>((resolve) => {
      mqttClient.on("connect", () => {
        console.log("[MQTT] Connected to EMQX for OTA trigger");

        const topic = `device/${deviceId}/ota`;
        const payload = JSON.stringify({
          action: "ota",
          url: firmware.url,
          md5: firmware.md5,
          version: firmware.version,
        });

        mqttClient.publish(topic, payload, { qos: 1 }, (err) => {
          if (err) {
            console.error("[MQTT] Publish error:", err);
            mqttClient.end();
            resolve(
              NextResponse.json(
                { error: "Failed to publish OTA command" },
                { status: 500 }
              )
            );
          } else {
            console.log(`[MQTT] OTA command published to ${topic}`);
            console.log(`[MQTT] Payload: ${payload}`);
            mqttClient.end();
            resolve(
              NextResponse.json({
                success: true,
                message: "OTA command sent successfully",
                deviceId,
                version: firmware.version,
                url: firmware.url,
              })
            );
          }
        });
      });

      mqttClient.on("error", (err) => {
        console.error("[MQTT] Connection error:", err);
        mqttClient.end();
        resolve(
          NextResponse.json(
            { error: "MQTT connection failed" },
            { status: 500 }
          )
        );
      });

      setTimeout(() => {
        mqttClient.end();
        resolve(
          NextResponse.json(
            { error: "MQTT connection timeout" },
            { status: 504 }
          )
        );
      }, 10000);
    });
  } catch (error: any) {
    console.error("Error triggering OTA:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}