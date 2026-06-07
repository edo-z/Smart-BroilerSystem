export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { encode } from "@auth/core/jwt";

export async function POST(req: Request) {
  if (process.env.AUTH_TEST_MODE !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const client = await clientPromise;
    const user = await client.db().collection("users").findOne({ email });

    if (!user?.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const now = Math.floor(Date.now() / 1000);
    const token = await encode({
      secret: process.env.AUTH_SECRET!,
      salt: "authjs.session-token",
      token: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        sub: user._id.toString(),
        iat: now,
        exp: now + 30 * 24 * 60 * 60,
        jti: crypto.randomUUID(),
      },
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    });

    response.cookies.set("authjs.session-token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      secure: false,
    });

    return response;
  } catch (error) {
    console.error("test-login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
