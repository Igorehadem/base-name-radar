export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import data from "./data.json" assert { type: "json" };

export async function GET() {
  return NextResponse.json({
    raw: data,
    type: typeof data,
    isArray: Array.isArray(data),
  });
}
