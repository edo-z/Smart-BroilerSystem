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
  const devices = await client
    .db()
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