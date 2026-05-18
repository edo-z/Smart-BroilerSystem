export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { IFirmware } from "@/models/Firmware";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const FIRMARE_DIR = path.join(process.cwd(), "public", "firmware");
const COLLECTION_NAME = "firmwares";

async function ensureDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getNextVersion(firmwares: IFirmware[]): string {
  if (firmwares.length === 0) {
    return "1.0.0";
  }
  
  const versions = firmwares
    .map(f => {
      const parts = f.version.split(".").map(Number);
      return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 };
    })
    .sort((a, b) => {
      if (a.major !== b.major) return b.major - a.major;
      if (a.minor !== b.minor) return b.minor - a.minor;
      return b.patch - a.patch;
    });
  
  const latest = versions[0];
  latest.patch += 1;
  
  return `${latest.major}.${latest.minor}.${latest.patch}`;
}

function calculateMD5(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("md5");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "File wajib diisi" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID wajib diisi" }, { status: 400 });
    }

    ensureDirectory(FIRMARE_DIR);

    const client = await clientPromise;
    const db = client.db();

    const firmwares = await db
      .collection<IFirmware>(COLLECTION_NAME)
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray();

    const nextVersion = getNextVersion(firmwares);
    const filename = `esp32-firmware-v${nextVersion}.bin`;
    const filePath = path.join(FIRMARE_DIR, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const md5 = calculateMD5(filePath);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aldozeno.my.id";
    const url = `${baseUrl}/firmware/${filename}`;

    const firmware: IFirmware = {
      version: nextVersion,
      md5,
      filename,
      url,
      size: buffer.length,
      uploadedAt: new Date(),
      uploadedBy: new ObjectId(userId),
    };

    await db.collection<IFirmware>(COLLECTION_NAME).insertOne(firmware);

    return NextResponse.json({
      success: true,
      message: "Firmware uploaded successfully",
      firmware: {
        version: firmware.version,
        md5: firmware.md5,
        url: firmware.url,
        size: firmware.size,
      },
    });
  } catch (error: any) {
    console.error("Error uploading firmware:", error);
    return NextResponse.json(
      { error: "Failed to upload firmware", details: error.message },
      { status: 500 }
    );
  }
}