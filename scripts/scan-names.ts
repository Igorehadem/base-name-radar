// Simple placeholder scanner.
// Later this will be upgraded to real ENS/BNS "taken vs free" checks.

import fs from "fs";
import path from "path";

interface RadarItem {
  name: string;
  freedAt: string;
}

async function main() {
  // names to monitor (later will expand with dictionary)
  const monitoredNames = ["alpha", "beta", "testname", "xyz", "solarpunk"];

  const radarPath = path.join(process.cwd(), "data", "radar.json");

  let radar: RadarItem[] = [];
  if (fs.existsSync(radarPath)) {
    radar = JSON.parse(fs.readFileSync(radarPath, "utf8"));
  }

  // CURRENT: placeholder logic — we simulate that "xyz" became free.
  // LATER: real ENS/BNS check: name is free if resolver.owner == zero address.
  const freedName = "xyz";

  const alreadyInRadar = radar.some((r) => r.name === freedName);

  if (!alreadyInRadar) {
    radar.unshift({
      name: freedName,
      freedAt: new Date().toISOString(),
    });

    fs.writeFileSync(radarPath, JSON.stringify(radar, null, 2), "utf8");

    console.log(`Added new freed name: ${freedName}`);
  } else {
    console.log("No new freed names detected");
  }
}

main();
