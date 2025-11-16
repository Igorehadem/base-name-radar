// app/api/check-name/route.ts
import { NextResponse } from "next/server";
import { publicClient } from "@/lib/viem";
import { BASE_REGISTRAR, namehashTools } from "@/lib/base-names";
import { keccak256, toHex, stringToBytes } from "viem";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid 'name' payload" },
        { status: 400 }
      );
    }

    // 1) выделяем чистый label (до точки)
    const label = name.replace(".base", "").trim().toLowerCase();

    // 2) считаем tokenId по ENS-алгоритму (keccak256(label))
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
      // ownerOf кидает ошибку, если токен не существует → имя свободно
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

    const available = owner === null;

    return NextResponse.json({
      name,
      label,
      tokenId: tokenId.toString(),
      available,
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
