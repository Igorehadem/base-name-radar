import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    version: "vNext",
    image: `https://igoreha.online/api/og?state=start`,
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
