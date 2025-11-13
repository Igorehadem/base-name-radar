// Simple Farcaster Frame handler (HTTP endpoint-like placeholder)
// Actual hosting (serverless / pages function) will wire this into Warpcast.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const inputText: string =
    body?.untrustedData?.inputText?.trim().toLowerCase() || "";

  const name = inputText || "example";

  const checkUrl = `https://YOUR_DOMAIN_HERE/check?name=${encodeURIComponent(
    name
  )}`;

  const frame = {
    version: "vNext",
    image: `https://YOUR_DOMAIN_HERE/api/frame-og?name=${encodeURIComponent(
      name
    )}`,
    buttons: [
      {
        label: "Check on site",
        action: "link",
        target: checkUrl
      }
    ],
    inputText: "Enter a name to check",
  };

  return NextResponse.json(frame);
}
