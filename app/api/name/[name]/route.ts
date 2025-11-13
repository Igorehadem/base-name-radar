import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: { name: string } }
) {
  const { name } = context.params;

  // placeholder response — real ENS/BNS logic will be added later
  return NextResponse.json({
    name,
    ok: true,
    message: "API is working. Resolver will be added soon."
  });
}
