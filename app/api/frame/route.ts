import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    frames: [
      {
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
      }
    ]
  });
}

/**
 * POST — обрабатываем ввод имени
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = body?.untrustedData?.inputText?.trim().toLowerCase();

  if (!name) {
    return NextResponse.json({
      version: "vNext",
      image: "https://igoreha.online/api/og?state=error",
      text: "Please enter a valid name",
      buttons: [
        {
          label: "Try again",
          action: "post",
        },
      ],
      inputText: "yourname",
    });
  }

  // Формируем кнопку "Open in Warpcast"
  const warpcastUrl = `https://warpcast.com/~/n/${name}`;

  return NextResponse.json({
    version: "vNext",
    image: `https://igoreha.online/api/og?name=${name}`,
    text: `Checking: ${name}`,
    buttons: [
      {
        label: "Open in Warpcast",
        action: "link",
        target: warpcastUrl,
      },
      {
        label: "Try another",
        action: "post",
      },
    ],
    inputText: "yourname",
  });
}
