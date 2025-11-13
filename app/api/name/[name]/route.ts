import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { namehash, labelhash } from "viem/ens";

const ENS_REGISTRY = "0x48dfb8b33a3c2fe2a12eefefc02cb9a22d10d5c1";

export async function GET(
  _req: Request,
  context: { params: { name: string } }
) {
  const raw = context.params.name.trim().toLowerCase();

  if (!raw) {
    return NextResponse.json({ error: "No name provided" }, { status: 400 });
  }

  // ENS supports hierarchical names (e.g., abc.eth)
  // For Base Names, we assume simple labels (e.g., "alpha")
  const label = raw;
  const node = namehash(label);
  const labelHash = labelhash(label);

  try {
    const client = createPublicClient({
      chain: base,
      transport: http(process.env.RPC_BASE),
    });

    // Call ENS Registry owner(node)
    const owner = await client.readContract({
      address: ENS_REGISTRY,
      abi: [
        {
          name: "owner",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "node", type: "bytes32" }],
          outputs: [{ name: "owner", type: "address" }],
        },
      ],
      functionName: "owner",
      args: [node], // node = namehash(label)
    });

    const available =
      owner.toLowerCase() ===
      "0x0000000000000000000000000000000000000000";

    return NextResponse.json({
      name: raw,
      node,
      labelHash,
      available,
      owner,
      chain: "base",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Resolver failed", details: err.message },
      { status: 500 }
    );
  }
}
