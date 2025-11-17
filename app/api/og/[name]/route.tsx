import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  const fontData = await fetch(
    new URL("/fonts/Inter-Regular.ttf", new URL(req.url).origin)
  ).then((res) => res.arrayBuffer());

  const name = params.name.toLowerCase();

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
          fontFamily: "Inter",
          color: "white",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 20 }}>{name}</div>

        <div style={{ fontSize: 40, marginBottom: 10 }}>
          ENS: {ensStatus}
        </div>

        <div style={{ fontSize: 40 }}>
          FName: {fnameStatus}
        </div>
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
