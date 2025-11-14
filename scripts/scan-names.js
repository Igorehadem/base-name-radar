// scripts/scan-names.js
// Simple placeholder scanner for Base Name Radar.
// For now it just reads data/radar.json (if exists) and logs stats.
// Later we'll replace it with real Warpcast-based scanner.

const fs = require("fs");
const path = require("path");

async function main() {
  const radarPath = path.join(process.cwd(), "data", "radar.json");

  let radar = [];
  if (fs.existsSync(radarPath)) {
    radar = JSON.parse(fs.readFileSync(radarPath, "utf8"));
  }

  console.log("🔭 Base Name Radar — placeholder scan");
  console.log(`Existing radar entries: ${radar.length}`);
  console.log("Nothing to scan yet — will use Warpcast API soon.");
}

main().catch((err) => {
  console.error("Scan failed:", err);
  process.exit(1);
});
