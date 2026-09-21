import { sepolia } from "viem/chains";
import type { Address } from "viem";

export const chain = sepolia;

export const nftAddress = (process.env.NEXT_PUBLIC_NFT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as Address;

export const sepoliaRpc =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
  "https://ethereum-sepolia-rpc.publicnode.com";

export const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const ipfsGateway =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/";

export function isNftConfigured() {
  return (
    !!nftAddress &&
    nftAddress !== "0x0000000000000000000000000000000000000000"
  );
}

export function resolveMediaUrl(uri: string): string {
  if (!uri) return "https://placehold.co/400x400/1a1a2e/eee?text=NFT";
  if (uri.startsWith("ipfs://")) {
    return `${ipfsGateway.replace(/\/$/, "")}/${uri.slice("ipfs://".length)}`;
  }
  return uri;
}
