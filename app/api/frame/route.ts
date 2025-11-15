import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function json(data: any) {
  return new NextResponse(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

// GET: initial frame
export async function GET() {
  return json({
    version: "vNext",
    image: "https://igoreha.online/api/og?state=start",
    inputText: "yourname",
    buttons: [
      { label: "Check name", action: "post" }
    ]
  });
}

// POST: handle input
export async function POST(req: Request) {
  const body = await req.json();
  const input = body?.untrustedData?.inputText || "";
  const name = input.trim().toLowerCase();

  return json({
    version: "vNext",
    image: `https://igoreha.online/api/og?state=result&name=${name}`,
    buttons: [
      {
        label: "Open in Radar",
        action: "link",
        target: `https://igoreha.online/check?name=${name}`
      },
      {
        label: "Check another",
        action: "post"
      }
    ]
  });
}
