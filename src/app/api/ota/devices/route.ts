export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Convert userId string to ObjectId
    let userObjectId;
    try {
      userObjectId = new ObjectId(session.user.id as string);
    } catch (e) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    const devices = await db
      .collection("devices")
      .find({ 
        userId: userObjectId,
        claimed: true
      })
      .project({ name: 1, _id: 1, active: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      devices: devices.map(d => ({
        _id: d._id.toString(),
        name: d.name,
        active: d.active,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching devices:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices", details: error.message },
      { status: 500 }
    );
  }
}