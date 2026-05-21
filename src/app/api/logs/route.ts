
import { NextResponse } from "next/server";
import { auth } from "@/auth";
export const runtime = "nodejs";

const PROXY_URL = process.env.API_PROXY_URL || "https://api.aldozeno.my.id";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "20";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const params = new URLSearchParams({ page, limit });
  if (deviceId) params.set("deviceIds", deviceId);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const proxyRes = await fetch(`${PROXY_URL}/api/logs?${params}`);
  const data = await proxyRes.json();

  if (!proxyRes.ok) {
    return NextResponse.json(data, { status: proxyRes.status });
  }

  return NextResponse.json(data);
}