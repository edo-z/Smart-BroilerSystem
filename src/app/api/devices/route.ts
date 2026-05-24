export const runtime = "nodejs";

// src/app/api/devices/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { IDevice } from "@/models/Device";
import crypto from "crypto";

// ── GET /api/devices ──────────────────────────────────────
// Ambil semua device milik user yang sedang login
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  // ── Auto-harvest check ──────────────────────────────
  // Cari device dengan harvestTargetDate <= hari ini dan belum diproses
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingHarvests = await db
    .collection<IDevice>("devices")
    .find({
      userId: new ObjectId(session.user.id),
      harvestTargetDate: { $lte: today },
      harvestProcessed: { $ne: true },
    })
    .toArray();

  for (const device of pendingHarvests) {
    const deviceId = device._id!;

    // Hitung cycleDays
    const createdAt = device.createdAt || today;
    const cycleDays = Math.ceil(
      (today.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Arsipkan sensor_logs ke archive_logs
    const logs = await db
      .collection("sensor_logs")
      .find({ deviceId })
      .toArray();

    if (logs.length > 0) {
      const archiveDocs = logs.map((log) => ({
        ...log,
        originalId: log._id,
        _id: undefined,
        deviceName: device.name,
        archivedAt: new Date(),
      }));
      await db.collection("archive_logs").insertMany(archiveDocs);
    }

    // Hapus sensor_logs
    await db.collection("sensor_logs").deleteMany({ deviceId });

    // Catat harvest record
    await db.collection("harvests").insertOne({
      deviceId,
      deviceName: device.name,
      harvestDate: new Date(),
      targetDate: device.harvestTargetDate || today,
      population: device.currentPopulation || 0,
      capacity: device.capacity,
      cycleDays,
      createdAt: new Date(),
    });

    // Reset device untuk siklus baru
    await db.collection<IDevice>("devices").updateOne(
      { _id: deviceId },
      {
        $set: {
          currentPopulation: 0,
          active: false,
          harvestProcessed: true,
          harvestTargetDate: null,
        },
      }
    );
  }

  // ── Return device list ──────────────────────────────
  const devices = await db
    .collection<IDevice>("devices")
    .find({ userId: new ObjectId(session.user.id) })
    .toArray();

  return NextResponse.json(devices);
}

// ── POST /api/devices ─────────────────────────────────────
// Tambah device baru + generate apiKey dan claimCode
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, capacity } = body;

  if (!name || !capacity) {
    return NextResponse.json(
      { error: "name dan capacity wajib diisi" },
      { status: 400 }
    );
  }

  const newDevice: IDevice = {
    userId: new ObjectId(session.user.id),
    name,
    capacity: Number(capacity),
    currentPopulation: 0,
    active: false,
    apiKey: crypto.randomBytes(32).toString("hex"),     // 64 char hex
    claimCode: crypto.randomBytes(4).toString("hex").toUpperCase(), // 8 char, untuk QR
    claimed: false,
    createdAt: new Date(),
  };

  const client = await clientPromise;
  const result = await client
    .db()
    .collection<IDevice>("devices")
    .insertOne(newDevice);

  return NextResponse.json(
    { ...newDevice, _id: result.insertedId },
    { status: 201 }
  );
}