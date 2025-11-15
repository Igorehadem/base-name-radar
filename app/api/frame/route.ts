import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const name = body.untrustedData.inputText?.trim()?.toLowerCase() || "";

  if (!name) {
    return NextResponse.json({
      frames: [
        {
          text: "Enter a Base name to check",
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?state=empty`,
          inputText: "yourname",
          buttons: [{ label: "Check name", action: "post" }],
        },
      ],
    });
  }

  // Запрос к нашему API
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/name/${name}`
  ).then((r) => r.json());

  const available = result.available;

  return NextResponse.json({
    frames: [
      {
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?name=${name}&status=${available ? "available" : "taken"}`,
        text: available
          ? `Name "${name}" is AVAILABLE 🎉`
          : `Name "${name}" is taken`,
        buttons: [
          { label: "Check another", action: "post" },
          {
            label: "Open in Warpcast",
            action: "link",
            target: `https://warpcast.com/~/n/${name}`,
          },
        ],
        inputText: "yourname",
      },
    ],
  });
}

export async function GET() {
  return NextResponse.json({
    frames: [
      {
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?state=start`,
        text: "Check any base name",
        inputText: "yourname",
        buttons: [{ label: "Check name", action: "post" }],
      },
    ],
  });
}
