// No edge runtime — use Node.js so Warpcast accepts Content-Length

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = {
    version: "vNext",
    image: "https://igoreha.online/api/og?state=start",
    inputText: "yourname",
    buttons: [
      { label: "Check name", action: "post" }
    ]
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = (body?.untrustedData?.inputText || "").trim().toLowerCase();

  const payload = {
    version: "vNext",
    image: `https://igoreha.online/api/og?state=result&name=${name}`,
    buttons: [
      {
        label: "Open in Radar",
        action: "link",
        target: `https://igoreha.online/check?name=${name}`
      },
      { label: "Check another", action: "post" }
    ]
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
