// app/api/check-name/route.ts
import { NextResponse } from "next/server";
import { publicClient } from "@/lib/viem";
import { BASE_REGISTRAR, namehashTools } from "@/lib/base-names";
import { keccak256, toHex, stringToBytes } from "viem";

export async function POST(req: Request) {
    // --- simple rate limit (in-memory) ---
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // global throttle store
  // @ts-ignore
  global.__CHECK_NAME_RATE__ = global.__CHECK_NAME_RATE__ || new Map();

  const nowMs = Date.now();
  const last = global.__CHECK_NAME_RATE__.get(ip) || 0;

  // 700 ms min interval
  if (nowMs - last < 700) {
    return NextResponse.json(
      { error: "Too many requests", code: "RATE_LIMIT" },
      { status: 429 }
    );
  }

  global.__CHECK_NAME_RATE__.set(ip, nowMs);

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid 'name' payload" },
        { status: 400 }
      );
    }
        // --- normalize ---
    let raw = name.trim().toLowerCase().replace(".base", "");

    // --- validation ---
    const valid = /^[a-z0-9-]+$/.test(raw);

    if (!valid) {
      return NextResponse.json(
        { 
          error: "Only a-z, 0-9 and '-' are allowed",
          code: "INVALID_NAME_FORMAT"
        },
        { status: 400 }
      );
    }

    if (raw.length < 3) {
      return NextResponse.json(
        { 
          error: "Base names must be at least 3 characters",
          code: "NAME_TOO_SHORT"
        },
        { status: 400 }
      );
    }

    const label = raw;

    // 1)
    const label = name.replace(".base", "").trim().toLowerCase();

    // 2)(keccak256(label))
    const tokenId = BigInt(
      keccak256(toHex(stringToBytes(label)))
    );

    // 3) ownerOf
    let owner: `0x${string}` | null = null;
    try {
      owner = await publicClient.readContract({
        address: BASE_REGISTRAR.address,
        abi: BASE_REGISTRAR.abi,
        functionName: "ownerOf",
        args: [tokenId]
      });
    } catch {
      // ownerO
      owner = null;
    }

    // 4) expires
    let expires: bigint | null = null;
    try {
      expires = await publicClient.readContract({
        address: BASE_REGISTRAR.address,
        abi: BASE_REGISTRAR.abi,
        functionName: "nameExpires",
        args: [tokenId]
      });
    } catch {
      expires = null;
    }

        // --- status logic ---
    const now = Math.floor(Date.now() / 1000);

    let status: "available" | "registered" | "expired";

    if (owner === null) {
      // токен никогда не существовал → имя свободно
      status = "available";
    } else if (expires && Number(expires) < now) {
      // токен был, но просрочен → можно регать
      status = "expired";
    } else {
      // активная регистрация
      status = "registered";
    }

    return NextResponse.json({
      name,
      label,
      tokenId: tokenId.toString(),
      status,
      available: status === "available" || status === "expired",
      owner,
      expires: expires ? Number(expires) : null
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
