// lib/viem.ts
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Public RPC — без ключей, идеально для публичного мини-приложения
export const publicClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org")
});
