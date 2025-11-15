export const runtime = "edge";
export const dynamic = "force-dynamic";

function rawJson(obj: any) {
  const json = JSON.stringify(obj);

  return new Response(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(json.length),
      "Cache-Control": "no-store, no-cache, max-age=0",
    }
  });
}

export async function GET() {
  return rawJson({
    version: "vNext",
    image: "https://igoreha.online/api/og?state=start",
    inputText: "yourname",
    buttons: [
      { label: "Check name", action: "post" }
    ]
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const input = body?.untrustedData?.inputText || "";
  const name = input.trim().toLowerCase();

  return rawJson({
    version: "vNext",
    image: `https://igoreha.online/api/og?state=result&name=${name}`,
    buttons: [
      {
        label: "Open in Radar",
        action: "link",
        target: `https://igoreha.online/check?name=${name}`
      },
      { label: "Check another", action: "post" }
    ]
  });
}
