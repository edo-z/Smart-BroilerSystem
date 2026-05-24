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
  const { name, capacity, active, claimCode, currentPopulation, harvestTargetDate } = body;

  const updateFields: Partial<IDevice> = {};
  if (name !== undefined) updateFields.name = name;
  if (capacity !== undefined) updateFields.capacity = Number(capacity);
  if (active !== undefined) updateFields.active = active;
  if (claimCode !== undefined) updateFields.claimCode = "";
  if (currentPopulation !== undefined) updateFields.currentPopulation = Number(currentPopulation);
  if (harvestTargetDate !== undefined) updateFields.harvestTargetDate = new Date(harvestTargetDate);

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
  const result = await client
    .db()
    .collection<IDevice>("devices")
    .findOneAndUpdate(filter, { $set: updateFields }, { returnDocument: "after" });

  if (!result) {
    return NextResponse.json(
      { error: "Device tidak ditemukan atau bukan milik Anda" },
      { status: 404 }
    );
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