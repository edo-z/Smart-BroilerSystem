export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

interface DeviceLog {
  _id: ObjectId;
  deviceId?: ObjectId | null;
  userId: ObjectId;
  action: string;
  field?: string;
  fieldLabel?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
  version?: string;
  notes?: string;
  timestamp: Date;
}

// ── GET /api/devices/[id]/logs ───────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Ambil logs spesifik device + system-wide logs (deviceId = null, misal OTA)
  const logs = await db
    .collection<DeviceLog>("device_logs")
    .find({
      $or: [
        { deviceId: new ObjectId(id) },
        { deviceId: null },
      ],
      userId: new ObjectId(session.user.id),
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .toArray();

  return NextResponse.json(logs);
}
