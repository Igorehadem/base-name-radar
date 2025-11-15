import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Тип записи в радаре
type RadarItem = {
  name: string;
  timestamp: number;
};

export async function GET() {
  try {
    const radarPath = path.join(process.cwd(), "data", "radar.json");

    let radar: RadarItem[] = [];

    if (fs.existsSync(radarPath)) {
      const raw = fs.readFileSync(radarPath, "utf8");
      radar = JSON.parse(raw) as RadarItem[];
    }

    // временный placeholder (потом уберём)
    radar.push({
      name: "placeholder",
      timestamp: Date.now(),
    });

    fs.writeFileSync(radarPath, JSON.stringify(radar, null, 2));

    return NextResponse.json({ ok: true, updated: radar.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
