import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  try {
    const name = params.name.toLowerCase();

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
    return new Response(`OG ERROR: ${err?.message}`, {
      status: 500,
    });
  }
}
