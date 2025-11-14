import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: { name: string } }
) {
  const name = context.params.name.trim().toLowerCase();

  if (!name) {
    return NextResponse.json({ error: "No name provided" }, { status: 400 });
  }

  const url = `https://client.warpcast.com/v2/user-by-username?username=${name}`;

  try {
    const res = await fetch(url);

    // Имя не существует → свободно
    if (res.status === 404) {
      return NextResponse.json({
        name,
        available: true,
        owner: null,
        service: "warpcast-public-api"
      });
    }

    // Существующий пользователь → имя занято
    const json = await res.json();

    return NextResponse.json({
      name,
      available: false,
      owner: json.result.user.fid,
      username: json.result.user.username,
      pfp: json.result.user.pfp_url,
      service: "warpcast-public-api"
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Warpcast API error", details: err.message },
      { status: 500 }
    );
  }
}
