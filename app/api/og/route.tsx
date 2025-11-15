import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name") || "";
  const status = searchParams.get("status") || "start";
  const state = searchParams.get("state") || null;

  // Colors
  const green = "#4ade80";
  const red = "#ef4444";
  const gray = "#9ca3af";

  let title = "Base Name Radar";
  let subtitle = "Check Base Names Instantly";

  if (state === "empty") {
    title = "Enter a Base Name";
    subtitle = "Then tap Check →";
  } else if (status === "available") {
    title = `${name}`;
    subtitle = "is AVAILABLE 🎉";
  } else if (status === "taken") {
    title = `${name}`;
    subtitle = "is already taken";
  }

  const color =
    status === "available" ? green : status === "taken" ? red : gray;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "white",
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color,
            marginBottom: 20,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 40,
            opacity: 0.8,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
