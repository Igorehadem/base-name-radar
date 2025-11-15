import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// GET: стартовый экран Frame
export async function GET() {
  return NextResponse.json({
    version: "vNext",
    image: "https://igoreha.online/api/og?state=start",
    text: "Check any Base name",
    inputText: "yourname",
    buttons: [
      {
        label: "Check name",
        action: "post"
      }
    ]
  });
}

// POST: обработка ввода пользователя
export async function POST(req: Request) {
  const body = await req.json();
  const input = body?.untrustedData?.inputText || "";

  const formatted = input.trim().toLowerCase();

  return NextResponse.json({
    version: "vNext",
    image: `https://igoreha.online/api/og?state=result&name=${formatted}`,
    text: `Checking name: ${formatted}`,
    buttons: [
      {
        label: "Open in Radar",
        action: "link",
        target: `https://igoreha.online/check?name=${formatted}`
      },
      {
        label: "Check another",
        action: "post"
      }
    ]
  });
}
