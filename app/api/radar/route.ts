export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import data from "./data.json" assert { type: "json" };

export async function GET() {
  const normalized = data
    .filter((item) => item && item.name)
    .map((item) => ({
      name: item.name,
      timestamp:
        typeof item.timestamp === "number"
          ? new Date(item.timestamp).toISOString()
          : item.timestamp,
    }))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return NextResponse.json(normalized);
}
