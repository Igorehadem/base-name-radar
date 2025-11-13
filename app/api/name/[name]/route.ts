import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Base uses standard ENS registry: 0x000...018
const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

export async function GET(
  _req: Request,
  context: { params: { name: string } }
) {
  const name = context.params.name.trim().toLowerCase();

  if (!name) {
    return NextResponse.json(
      { error: "No name provided" },
      { status: 400 }
    );
  }

  try {
    const client = createPublicClient({
      chain: base,
      transport: http(process.env.RPC_BASE),
    });

    // Convert name → labelhash
    const label = name.split(".")[0];
    const labelhash = await client.camelCase.hash(name);

    // Call ENS registry — owner(address,name)
    const owner = await client.readContract({
      address: ENS_REGISTRY as `0x${string}`,
      abi: [
        {
          name: "owner",
          type: "function",
          constant: true,
          inputs: [{ name: "node", type: "bytes32" }],
          outputs: [{ name: "owner", type: "address" }],
        },
      ],
      functionName: "owner",
      args: [labelhash],
    });

    const available = owner === "0x0000000000000000000000000000000000000000";

    return NextResponse.json({
      name,
      owner,
      available,
      chain: "base",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Resolver failed", details: err.message },
      { status: 500 }
    );
  }
}
