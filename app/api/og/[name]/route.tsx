/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// Принудительно указываем тип ответа
export const contentType = "image/png";

export async function GET(req, { params }) {
  try {
    const name = params.name?.toLowerCase() || "unknown";

    const origin = new URL(req.url).origin;
    const res = await fetch(`${origin}/api/name/${name}`, { cache: "no-store" });
    const data = await res.json();

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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#0f172a",
            color: "white",
            padding: "60px",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700, marginBottom: 20 }}>
            {name}
          </div>

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
      }
    );
  } catch (err) {
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
