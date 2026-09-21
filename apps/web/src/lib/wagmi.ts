"use client";

/**
 * Templates (my-nft-dapp / avatar-nft-minter) use RainbowKit + getDefaultConfig.
 * We keep the same Wagmi/Viem stack with `injected` only for a reliable Next 15
 * build (RainbowKit currently pulls broken @x402 / Base Account optional deps).
 * See docs/UPSTREAM.md — next learning step is to add RainbowKit once deps settle.
 */
import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "@wagmi/connectors";
import { sepoliaRpc, walletConnectProjectId } from "./config";

const connectors = [
  injected({ shimDisconnect: true }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(sepoliaRpc),
  },
  ssr: true,
});
