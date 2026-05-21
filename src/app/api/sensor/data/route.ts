export const runtime = "nodejs";

import { NextResponse } from "next/server";

const PROXY_URL = process.env.API_PROXY_URL || "https://api.aldozeno.my.id";

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

    const proxyRes = await fetch(`${PROXY_URL}/api/sensor/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await proxyRes.json();
    const status = proxyRes.ok ? 200 : proxyRes.status;
    return NextResponse.json(data, { status });

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
    const limit = searchParams.get("limit") || "50";
    const range = searchParams.get("range") || "1h";

    const proxyRes = await fetch(`${PROXY_URL}/api/sensor/data?deviceId=${deviceId}&limit=${limit}&range=${range}`);
    const data = await proxyRes.json();

    if (!proxyRes.ok) {
      return NextResponse.json(data, { status: proxyRes.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error pada GET Sensor Data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data", details: error.message },
      { status: 500 }
    );
  }
}