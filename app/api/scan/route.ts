import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // always run fresh on server

export async function GET() {
  try {
    const radarPath = path.join(process.cwd(), "data", "radar.json");

    let radar = [];
    if (fs.existsSync(radarPath)) {
      radar = JSON.parse(fs.readFileSync(radarPath, "utf8"));
    }

    // TODO: replace with real Warpcast scanner soon
    radar.push({
      name: "placeholder",
      timestamp: Date.now(),
    });

    fs.writeFileSync(radarPath, JSON.stringify(radar, null, 2));

    return NextResponse.json({ ok: true, updated: radar.length });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
