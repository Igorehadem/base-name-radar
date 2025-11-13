import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Open Name Service Registry on Base
const ONS_REGISTRY = "0x5f8f39cae195d2bea3dc6480740d5eecba9a7f51";

const ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "name", "type": "string" }],
    "name": "available",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export async function GET(
  _req: Request,
  context: { params: { name: string } }
) {
  const raw = context.params.name.trim().toLowerCase();

  if (!raw) {
    return NextResponse.json({ error: "No name provided" }, { status: 400 });
  }

  try {
    const client = createPublicClient({
      chain: base,
      transport: http(process.env.RPC_BASE),
    });

    const available = await client.readContract({
      address: ONS_REGISTRY,
      abi: ABI,
      functionName: "available",
      args: [raw],
    });

    return NextResponse.json({
      name: raw,
      available,
      chain: "base",
      registry: ONS_REGISTRY
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Resolver failed", details: err.message },
      { status: 500 }
    );
  }
}
