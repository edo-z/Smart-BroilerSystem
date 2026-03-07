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
  const { name, capacity, active } = body;

  const updateFields: Partial<IDevice> = {};
  if (name !== undefined) updateFields.name = name;
  if (capacity !== undefined) updateFields.capacity = Number(capacity);
  if (active !== undefined) updateFields.active = active;

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada field yang diupdate" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const result = await client
    .db()
    .collection<IDevice>("devices")
    .findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(session.user.id),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );

  if (!result) {
    return NextResponse.json(
      { error: "Device tidak ditemukan atau bukan milik Anda" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
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