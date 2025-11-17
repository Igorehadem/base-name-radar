import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  let name = params.name;

  // Если URL /api/og3/test.png → name = "test.png"
  if (name.endsWith(".png")) {
    name = name.replace(".png", "");
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "white",
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
        }}
      >
        OG3 WORKING: {name}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
