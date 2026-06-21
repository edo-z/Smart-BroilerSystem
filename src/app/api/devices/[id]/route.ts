export const runtime = "nodejs";

// src/app/api/devices/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { IDevice } from "@/models/Device";

// ── PATCH /api/devices/[id] ───────────────────────────────
export async function PATCH(
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

  const body = await req.json();
  const { name, capacity, active, claimCode, currentPopulation, harvestTargetDate, docDate } = body;

  const updateFields: Partial<IDevice> = {};
  if (name !== undefined) updateFields.name = name;
  if (capacity !== undefined) updateFields.capacity = Number(capacity);
  if (active !== undefined) updateFields.active = active;
  if (claimCode !== undefined) updateFields.claimCode = "";
  if (currentPopulation !== undefined) updateFields.currentPopulation = Number(currentPopulation);
  if (harvestTargetDate !== undefined) updateFields.harvestTargetDate = new Date(harvestTargetDate);
  if (docDate !== undefined) updateFields.docDate = new Date(docDate);

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada field yang diupdate" },
      { status: 400 }
    );
  }

  const filter: Record<string, unknown> = {
    _id: new ObjectId(id),
    userId: new ObjectId(session.user.id),
  };

  // Auto-claim flow: filter by claimCode + not yet claimed
  if (claimCode !== undefined) {
    filter.claimCode = claimCode;
    filter.claimed = false;
  }

  const client = await clientPromise;
  const db = client.db();

  // Fetch old doc for logging
  const oldDoc = await db.collection<IDevice>("devices").findOne(filter);

  const result = await db
    .collection<IDevice>("devices")
    .findOneAndUpdate(filter, { $set: updateFields }, { returnDocument: "after" });

  if (!result) {
    return NextResponse.json(
      { error: "Device tidak ditemukan atau bukan milik Anda" },
      { status: 404 }
    );
  }

  // ── Log perubahan ke device_logs ──
  const logs: Record<string, unknown>[] = [];
  const loggableFields = ["name", "capacity", "currentPopulation", "docDate", "harvestTargetDate", "active"] as const;
  const fieldLabels: Record<string, string> = {
    name: "Nama kandang",
    capacity: "Kapasitas",
    currentPopulation: "Populasi ayam",
    docDate: "Tanggal DOC",
    harvestTargetDate: "Target panen",
    active: "Status aktif",
  };

  for (const field of loggableFields) {
    if (body[field] === undefined) continue;
    const oldVal = oldDoc?.[field as keyof IDevice];
    const newVal = field === "docDate" || field === "harvestTargetDate"
      ? new Date(body[field])
      : field === "capacity" || field === "currentPopulation"
        ? Number(body[field])
        : body[field];

    const oldStr = oldVal instanceof Date ? oldVal.toISOString().slice(0, 10) : String(oldVal ?? "");
    const newStr = newVal instanceof Date ? newVal.toISOString().slice(0, 10) : String(newVal ?? "");

    if (oldStr !== newStr) {
      logs.push({
        deviceId: new ObjectId(id),
        userId: new ObjectId(session.user.id),
        action: "update",
        field,
        fieldLabel: fieldLabels[field] || field,
        oldValue: oldStr,
        newValue: newStr,
        description: `${fieldLabels[field] || field}: ${oldStr || "(kosong)"} → ${newStr || "(kosong)"}`,
        timestamp: new Date(),
      });
    }
  }

  if (logs.length > 0) {
    await db.collection("device_logs").insertMany(logs);
  }

  return NextResponse.json({
    message: "Sukses! Perangkat telah diperbarui.",
    data: result,
  });
}

// ── DELETE /api/devices/[id] ──────────────────────────────
export async function DELETE(
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
  const result = await client
    .db()
    .collection<IDevice>("devices")
    .deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id),
    });

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { error: "Device tidak ditemukan atau bukan milik Anda" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}