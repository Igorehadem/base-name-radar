// app/api/check-name/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid 'name' payload" },
        { status: 400 }
      );
    }

    // placeholder — позже заменим на real onchain check
    return NextResponse.json({
      name,
      available: null,
      owner: null,
      expires: null,
      status: "pending-onchain-check"
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
