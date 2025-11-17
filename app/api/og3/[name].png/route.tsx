import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(req, { params }) {
  const name = params["name.png"].replace(".png", "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "white",
          color: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 64,
        }}
      >
        WORKING: {name}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
