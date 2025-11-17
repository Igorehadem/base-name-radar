import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "white",
          color: "black",
          fontSize: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        OK: {params.name}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
