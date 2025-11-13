import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "radar.json");
    const content = await readFile(filePath, "utf8");
    const json = JSON.parse(content);

    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: "radar.json not found or unreadable" },
      { status: 500 }
    );
  }
}
