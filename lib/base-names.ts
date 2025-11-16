// lib/base-names.ts

// Core registrar (Base Names)
export const BASE_REGISTRAR = {
  address: "0x6f7a1fF817f241b70d4066E4F6652A52DcA5A27c" as const,
  abi: [
    {
      "type": "function",
      "name": "ownerOf",
      "inputs": [{ "name": "tokenId", "type": "uint256" }],
      "outputs": [{ "type": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "nameExpires",
      "inputs": [{ "name": "id", "type": "uint256" }],
      "outputs": [{ "type": "uint256" }],
      "stateMutability": "view"
    }
  ]
};

// Utility: labelhash → tokenId
export const namehashTools = {
  labelhash(label: string) {
    // keccak256(buffer) used by ENS/BNS
    const { keccak256, toUtf8Bytes } = require("viem/utils");
    return keccak256(toUtf8Bytes(label));
  }
};
