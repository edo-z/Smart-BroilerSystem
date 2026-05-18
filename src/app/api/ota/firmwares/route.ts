export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const firmwares = await db
      .collection("firmwares")
      .find({})
      .sort({ uploadedAt: -1 })
      .project({ version: 1, md5: 1, url: 1, size: 1, uploadedAt: 1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      firmwares: firmwares.map(f => ({
        version: f.version,
        md5: f.md5,
        url: f.url,
        size: f.size,
        uploadedAt: f.uploadedAt,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching firmwares:", error);
    return NextResponse.json(
      { error: "Failed to fetch firmwares", details: error.message },
      { status: 500 }
    );
  }
}