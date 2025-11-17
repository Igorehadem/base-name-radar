import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req: Request, ctx: { params: { name: string } }) {
  const name = ctx.params.name?.toLowerCase() || "unknown";

  const origin = new URL(req.url).origin;
  const apiRes = await fetch(`${origin}/api/name/${name}`, { cache: "no-store" });
  const data = await apiRes.json();

  const ens = data.ens;
  const fname = data.fname;

  const ensStatus = ens?.error ? "error" : ens?.available ? "free" : "taken";
  const fnameStatus = fname?.error ? "error" : fname?.available ? "free" : "taken";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, marginBottom: 24 }}>
          {name}
        </div>

        <div style={{ fontSize: 42, marginBottom: 12 }}>
          ENS: {ensStatus}
        </div>

        <div style={{ fontSize: 42 }}>
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
