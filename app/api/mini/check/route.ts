import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }

    const base = new URL(req.url).origin;

    const apiRes = await fetch(`${base}/api/name/${name}`, {
      cache: "no-store",
    });

    const data = await apiRes.json();

    const ens = data.ens?.available ? "free" : data.ens?.error ? "error" : "taken";
    const fname =
      data.fname?.available ? "free" : data.fname?.error ? "error" : "taken";

    return NextResponse.json({
      name,
      ens,
      fname,
      actions: [
        {
          label: "Check another",
          action: "input_text",
          input: {
            placeholder: "enter name",
            name: "name",
          },
        },
        {
          label: "Open /mini",
          action: "open_url",
          url: `${base}/mini`,
        },
      ],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
