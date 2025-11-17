import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  const name = params.name.toLowerCase();

  // Load fallback font
  const fontData = await fetch(
    new URL("/fonts/Inter-Regular.ttf", new URL(req.url).origin)
  ).then(res => res.arrayBuffer());

  // Call API to fetch ENS + FName results
  const origin = new URL(req.url).origin;
  const res = await fetch(`${origin}/api/name/${name}`, { cache: "no-store" });
  const data = await res.json();

  const ens = data.ens;
  const fname = data.fname;

  const ensStatus = ens.error ? "error" : ens.available ? "free" : "taken";
  const fnameStatus = fname.error ? "error" : fname.available ? "free" : "taken";

  const color = "#ffffff";
  const bg = "#0f172a";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          background: bg,
          color,
          fontFamily: "Inter",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, marginBottom: 30 }}>
          {name}
        </div>

        <div style={{ fontSize: 42, marginBottom: 12 }}>ENS: {ensStatus}</div>
        <div style={{ fontSize: 42 }}>FName: {fnameStatus}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
