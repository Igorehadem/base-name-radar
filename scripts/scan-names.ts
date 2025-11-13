// Real ENS-based name scanner for Base
// Detects when a name changes from "taken" → "free"
// and updates data/radar.json accordingly.

import fs from "fs";
import path from "path";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

// Names to monitor — later can be replaced by dictionary or generator
const monitoredNames = [
  "alpha",
  "beta",
  "solarpunk",
  "xyz",
  "orbit",
  "builder",
  "chain",
  "matrix",
];

interface RadarItem {
  name: string;
  freedAt: string;
}

async function getOwner(name: string, client: any) {
  try {
    const label = name.trim().toLowerCase();
    const labelhash = await client.camelCase.hash(label);

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

    return owner;
  } catch {
    return null;
  }
}

async function main() {
  const client = createPublicClient({
    chain: base,
    transport: http(process.env.RPC_BASE),
  });

  const radarPath = path.join(process.cwd(), "data", "radar.json");

  let radar: RadarItem[] = [];
  if (fs.existsSync(radarPath)) {
    radar = JSON.parse(fs.readFileSync(radarPath, "utf8"));
  }

  console.log("Starting scan...");

  for (const name of monitoredNames) {
    const owner = await getOwner(name, client);
    const isFree = owner === "0x0000000000000000000000000000000000000000";

    if (isFree) {
      const alreadyListed = radar.some((item) => item.name === name);
      if (!alreadyListed) {
        radar.unshift({
          name,
          freedAt: new Date().toISOString(),
        });

        console.log(`✔ Name freed: ${name}`);
      }
    } else {
      console.log(`✘ Taken: ${name}`);
    }
  }

  fs.writeFileSync(radarPath, JSON.stringify(radar, null, 2), "utf8");

  console.log("Scan complete.");
}

main();
