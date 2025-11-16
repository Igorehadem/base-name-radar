import { NextResponse } from "next/server";
import { publicClient } from "@/lib/viem";
import { BASE_REGISTRAR } from "@/lib/base-names";
import { keccak256, toHex, stringToBytes } from "viem";

export async function POST(req: Request) {
  try {
    const { name, format } = await req.json();

    // --- basic payload validation ---
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid 'name' payload" },
        { status: 400 }
      );
    }

    // --- rate limit ---
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    // @ts-ignore
    global.__CHECK_NAME_RATE__ = global.__CHECK_NAME_RATE__ || new Map();

    const nowMs = Date.now();
    const last = global.__CHECK_NAME_RATE__.get(ip) || 0;

    if (nowMs - last < 700) {
      return NextResponse.json(
        { error: "Too many requests", code: "RATE_LIMIT" },
        { status: 429 }
      );
    }

    global.__CHECK_NAME_RATE__.set(ip, nowMs);

    // --- normalize input ---
    let raw = name.trim().toLowerCase().replace(".base", "");

    // --- allowed characters ---
    const valid = /^[a-z0-9-]+$/.test(raw);
    if (!valid) {
      return NextResponse.json(
        { error: "Only a-z, 0-9 and '-' are allowed", code: "INVALID_NAME_FORMAT" },
        { status: 400 }
      );
    }

    // --- minimum length (Base rule: 3+) ---
    if (raw.length < 3) {
      return NextResponse.json(
        { error: "Base names must be at least 3 characters", code: "NAME_TOO_SHORT" },
        { status: 400 }
      );
    }

    // final normalized label
    const label = raw;

    // --- compute tokenId (ENS-style keccak256(label)) ---
    const tokenId = BigInt(
      keccak256(toHex(stringToBytes(label)))
    );

    // --- read ownerOf ---
    let owner: `0x${string}` | null = null;
    try {
      owner = await publicClient.readContract({
        address: BASE_REGISTRAR.address,
        abi: BASE_REGISTRAR.abi,
        functionName: "ownerOf",
        args: [tokenId]
      });
    } catch {
      // ownerOf reverts if token does not exist → name is available
      owner = null;
    }

    // --- read expiration time ---
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

    // --- interpret status ---
    const now = Math.floor(Date.now() / 1000);

    let status: "available" | "expired" | "registered";

    if (owner === null) {
      status = "available";
    } else if (expires && Number(expires) < now) {
      status = "expired";
    } else {
      status = "registered";
    }

    // --- human hint ---
    let hint = "";
    if (status === "available") {
      hint = "Имя свободно — можно регистрировать.";
    } else if (status === "expired") {
      hint = "Имя было зарегистрировано, но срок истёк — его можно снова занять.";
    } else {
      hint = "Имя занято и зарегистрировано сейчас.";
    }

    // --- mini mode (for Mini App UI) ---
    if (format === "mini") {
      return NextResponse.json({
        name,
        status,
        available: status === "available" || status === "expired",
        hint
      });
    }

    // --- full response ---
    return NextResponse.json({
      name,
      label,
      tokenId: tokenId.toString(),
      status,
      available: status === "available" || status === "expired",
      owner,
      expires: expires ? Number(expires) : null,
      hint
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
