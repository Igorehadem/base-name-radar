import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  let raw = params.name;
  if (raw.endsWith(".png")) raw = raw.slice(0, -4);

  const name = raw.toLowerCase();

  const origin = new URL(req.url).origin;

  // Load font
  const fontData = await fetch(
    new URL("/fonts/Inter-Regular.ttf", origin)
  ).then(res => res.arrayBuffer());

  // Fetch ENS + FName info
  const apiRes = await fetch(`${origin}/api/name/${name}`, {
    cache: "no-store",
  });
  const data = await apiRes.json();

  const ens = data.ens;
  const fname = data.fname;

  const ensStatus = ens.error ? "error" : ens.available ? "free" : "taken";
  const fnameStatus = fname.error ? "error" : fname.available ? "free" : "taken";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0f172a",
          color: "white",
          fontFamily: "Inter",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 60,
        }}
      >
        {/* NAME */}
        <div
          style={{
            fontSize: 78,
            fontWeight: 700,
            marginBottom: 40,
            letterSpacing: "-1px",
          }}
        >
          {name}
        </div>

        {/* ENS */}
        <div
          style={{
            fontSize: 46,
            marginBottom: 20,
            opacity: 0.9,
          }}
        >
          ENS: {ensStatus}
        </div>

        {/* FNAME */}
        <div
          style={{
            fontSize: 46,
            opacity: 0.9,
          }}
        >
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
