import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  let body: { code?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { code } = body;

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const validCodes = (process.env.PRO_CODES || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);

  const normalizedCode = code.trim().toUpperCase();

  if (!validCodes.includes(normalizedCode)) {
    return NextResponse.json(
      { error: "Невалиден код. Провери дали си го въвел/а правилно." },
      { status: 403 },
    );
  }

  // Generate HMAC-signed activation token
  const secret = process.env.PRO_SECRET || "spesti-default-secret";
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = String(timestamp);
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const token = Buffer.from(
    JSON.stringify({ t: timestamp, s: signature }),
  ).toString("base64");

  return NextResponse.json({ token });
}
