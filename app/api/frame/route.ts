import { NextResponse } from "next/server";
import { frameResponse } from "@/frame/helpers/response";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = process.env.NEXT_PUBLIC_BASE_URL!;

export async function GET() {
  return frameResponse({
    frames: [
      {
        image: `${BASE}/api/og?state=start`,
        text: "Check any Base name",
        inputText: "yourname",
        buttons: [{ label: "Check name", action: "post" }],
      },
    ],
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = body.untrustedData?.inputText?.trim()?.toLowerCase() || "";

  if (!name) {
    return frameResponse({
      frames: [
        {
          image: `${BASE}/api/og?state=empty`,
          text: "Enter a name below",
          inputText: "yourname",
          buttons: [{ label: "Check name", action: "post" }],
        },
      ],
    });
  }

  const info = await fetch(`${BASE}/api/name/${name}`).then((r) => r.json());
  const available = info.available;

  return frameResponse({
    frames: [
      {
        image: `${BASE}/api/og?name=${name}&status=${
          available ? "available" : "taken"
        }`,
        text: available
          ? `Name "${name}" is AVAILABLE 🎉`
          : `Name "${name}" is taken`,
        inputText: "yourname",
        buttons: [
          { label: "Check again", action: "post" },
          {
            label: "Open in Warpcast",
            action: "link",
            target: `https://warpcast.com/~/n/${name}`,
          },
        ],
      },
    ],
  });
}
