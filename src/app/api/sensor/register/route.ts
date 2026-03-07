// src/app/api/sensor/register/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { IDevice } from "@/models/Device";

// ── POST /api/sensor/register ─────────────────────────────
// Dipanggil ESP32 saat pertama kali setup
// Body: { claimCode: "ABCD1234" }
export async function POST(req: Request) {
  const body = await req.json();
  const { claimCode } = body;

  if (!claimCode) {
    return NextResponse.json(
      { error: "claimCode wajib diisi" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const device = await client
    .db()
    .collection<IDevice>("devices")
    .findOne({ claimCode: claimCode.toUpperCase(), claimed: false });

  if (!device) {
    return NextResponse.json(
      { error: "Kode tidak valid atau sudah digunakan" },
      { status: 404 }
    );
  }

  // Tandai device sebagai sudah diklaim + aktif
  await client
    .db()
    .collection<IDevice>("devices")
    .updateOne(
      { _id: device._id },
      {
        $set: {
          claimed: true,
          active: true,
          claimCode: "", // hapus claimCode agar tidak bisa dipakai ulang
        },
      }
    );

  // Kembalikan apiKey ke ESP32 — disimpan di EEPROM/flash ESP32
  return NextResponse.json({
    success: true,
    deviceId: device._id.toString(),
    apiKey: device.apiKey,
    name: device.name,
  });
}