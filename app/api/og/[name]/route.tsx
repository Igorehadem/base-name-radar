import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req, { params }) {
  const name = params.name.toLowerCase();

  const url = new URL(req.url);
  const apiRes = await fetch(`${url.origin}/api/name/${name}`, {
    cache: "no-store",
  });
  const data = await apiRes.json();

  const ensStatus = data.ens?.error
    ? "error"
    : data.ens?.available
    ? "free"
    : "taken";

  const fnameStatus = data.fname?.error
    ? "error"
    : data.fname?.available
    ? "free"
    : "taken";

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          background: "#0f172a",
          color: "#f8fafc",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 24 }}>
          {name}
        </div>

        <div style={{ fontSize: 40, opacity: 0.9, marginBottom: 12 }}>
          ENS: {ensStatus}
        </div>

        <div style={{ fontSize: 40, opacity: 0.9 }}>
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
