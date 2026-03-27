export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { IDevice } from "@/models/Device";

export async function POST(req: Request) {
  try {
    const { claimCode, deviceName } = await req.json();

    if (!claimCode) {
      return NextResponse.json({ error: "Claim code wajib diisi" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // 1. Cari device yang claimCode-nya cocok DAN belum diklaim (claimed: false)
    const device = await db.collection<IDevice>("devices").findOne({
      claimCode: claimCode,
      claimed: false,
    });

    if (!device) {
      return NextResponse.json(
        { error: "Kode klaim tidak valid atau sudah digunakan" },
        { status: 404 }
      );
    }

    // 2. Update device tersebut
    await db.collection<IDevice>("devices").updateOne(
      { _id: device._id },
      {
        $set: {
          name: deviceName || device.name,
          claimed: true,   // Tandai sudah diklaim
          claimCode: "",    // KOSONGKAN kode agar menghilang di dashboard
          active: true,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Perangkat berhasil diaktifkan",
      deviceId: device._id,
      apiKey: device.apiKey // Kirim balik apiKey agar ESP32 bisa menyimpannya
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}