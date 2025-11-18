import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  try {
    const name = params.name.toLowerCase();
    const origin = new URL(req.url).origin;

    // Fetch ENS+FName with full protection
    let ensStatus = "error";
    let fnameStatus = "error";

    try {
      const apiRes = await fetch(`${origin}/api/name/${name}`, {
        cache: "no-store",
      });

      const data = await apiRes.json();

      const ens = data.ens;
      const fname = data.fname;

      ensStatus = ens?.error ? "error" : ens?.available ? "free" : "taken";
      fnameStatus = fname?.error ? "error" : fname?.available ? "free" : "taken";
    } catch (e) {
      ensStatus = "error";
      fnameStatus = "error";
    }

    // Minimal JSX (no fonts, no risky styles)
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#111827",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 64,
          }}
        >
          <div style={{ marginBottom: 20 }}>OG5</div>
          <div>Name: {name}</div>
          <div>ENS: {ensStatus}</div>
          <div>FName: {fnameStatus}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "cache-control": "no-store",
        },
      }
    );
  } catch (err) {
    return new Response(
      `OG ERROR: ${err?.message ?? "unknown error"}`,
      { status: 500 }
    );
  }
}
