import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  try {
    const fontData = await fetch(
      new URL("/fonts/Inter-Regular.ttf", new URL(req.url).origin)
    ).then((res) => {
      if (!res.ok) throw new Error("Font not found");
      return res.arrayBuffer();
    });

    const name = params.name?.toLowerCase() || "unknown";

    const origin = new URL(req.url).origin;
    const apiRes = await fetch(`${origin}/api/name/${name}`, {
      cache: "no-store",
    });

    if (!apiRes.ok) {
      throw new Error("Name API failed: " + apiRes.status);
    }

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
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            fontFamily: "Inter",
          }}
        >
          <div style={{ fontSize: 72, marginBottom: 20 }}>{name}</div>
          <div style={{ fontSize: 40 }}>ENS: {ensStatus}</div>
          <div style={{ fontSize: 40 }}>FName: {fnameStatus}</div>
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
  } catch (err) {
    // Важно: возвращаем ошибку как текст PNG
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "white",
            color: "black",
            fontSize: 32,
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
          }}
        >
          ERROR: {(err as Error).message}
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
