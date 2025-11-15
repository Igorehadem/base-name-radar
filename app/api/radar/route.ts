export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

type RadarItem = {
  name: string;
  timestamp: string | number;
};

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "radar.json");
    const content = await readFile(filePath, "utf8");
    const raw = JSON.parse(content) as RadarItem[] | unknown;

    const items = Array.isArray(raw) ? raw : [];

    const normalized = items
      .filter((item) => item && typeof (item as any).name === "string")
      .map((item: any) => {
        const ts =
          typeof item.timestamp === "number"
            ? new Date(item.timestamp).toISOString()
            : item.timestamp;

        return {
          name: item.name,
          timestamp: ts,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    return NextResponse.json(normalized);
  } catch (err) {
    return NextResponse.json(
      { error: "radar.json not found or unreadable" },
      { status: 500 }
    );
  }
}
