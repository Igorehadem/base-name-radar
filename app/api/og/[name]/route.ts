import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const name = params.name.toLowerCase();

  const url = new URL(req.url);
  const apiRes = await fetch(`${url.origin}/api/name/${name}`, {
    cache: "no-store",
  });
  const data = await apiRes.json();

  const ens = data.ens;
  const fname = data.fname;

  const ensStatus = ens.error ? "error" : ens.available ? "free" : "taken";
  const fnameStatus = fname.error ? "error" : fname.available ? "free" : "taken";

  const bg = "#0f172a";
  const text = "#f8fafc";

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          background: bg,
          color: text,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 20 }}>
          {name}
        </div>

        <div style={{ fontSize: 32, opacity: 0.9, marginBottom: 12 }}>
          ENS: {ensStatus}
        </div>

        <div style={{ fontSize: 32, opacity: 0.9 }}>
          FName: {fnameStatus}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
