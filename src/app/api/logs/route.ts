

// src/app/api/logs/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { IDevice } from "@/models/Device";
import { ISensorLog } from "@/models/SensorLog";
export const runtime = "nodejs";

// ── GET /api/logs ─────────────────────────────────────────
// Query params:
//   deviceId  → filter per device (opsional, default semua device milik user)
//   page      → halaman (default 1)
//   limit     → jumlah per halaman (default 20, max 100)
//   from      → filter tanggal mulai ISO string (opsional)
//   to        → filter tanggal akhir ISO string (opsional)
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const skip = (page - 1) * limit;

  const client = await clientPromise;
  const db = client.db();

  // 1. Ambil semua device milik user untuk validasi kepemilikan
  const userDevices = await db
    .collection<IDevice>("devices")
    .find({ userId: new ObjectId(session.user.id) })
    .project({ _id: 1, name: 1 })
    .toArray();

  if (userDevices.length === 0) {
    return NextResponse.json({ logs: [], total: 0, page, limit });
  }

  const userDeviceIds = userDevices.map((d) => d._id);

  // 2. Bangun filter query
  const filter: Record<string, unknown> = {
    // Hanya ambil log dari device milik user ini
    deviceId: deviceId && ObjectId.isValid(deviceId)
      ? new ObjectId(deviceId)
      : { $in: userDeviceIds },
  };

  // Filter tanggal jika ada
  if (from || to) {
    filter.recordedAt = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(to) } : {}),
    };
  }

  // 3. Query dengan pagination
  const [logs, total] = await Promise.all([
    db
      .collection<ISensorLog>("sensor_logs")
      .find(filter)
      .sort({ recordedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db
      .collection<ISensorLog>("sensor_logs")
      .countDocuments(filter),
  ]);

  // 4. Gabungkan nama device ke setiap log
  const deviceMap = Object.fromEntries(
    userDevices.map((d) => [d._id.toString(), d.name])
  );

  const logsWithName = logs.map((log) => ({
    ...log,
    deviceName: deviceMap[log.deviceId.toString()] ?? "Unknown",
  }));

  return NextResponse.json({
    logs: logsWithName,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}