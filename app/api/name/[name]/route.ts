import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: { name: string } }
) {
  const name = context.params.name.trim().toLowerCase();

  if (!name) {
    return NextResponse.json({ error: "No name provided" }, { status: 400 });
  }

  const url = `https://api.neynar.com/v2/farcaster/user?username=${name}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-api-key": process.env.NEYNAR_API_KEY!,
      },
    });

    if (res.status === 404) {
      return NextResponse.json({
        name,
        available: true,
        service: "neynar-farcaster-base-names",
      });
    }

    const json = await res.json();

    return NextResponse.json({
      name,
      available: false,
      owner: json.result.user.fid,
      service: "neynar-farcaster-base-names",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Resolver failed", details: err.message },
      { status: 500 }
    );
  }
}
