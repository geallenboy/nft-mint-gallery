"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { simpleCollectibleAbi } from "@/abi/SimpleCollectible";
import { isNftConfigured, nftAddress } from "@/lib/config";

const DEFAULT_URI =
  "https://placehold.co/600x600/0f3460/e94560/png?text=ASDC+%231";

export function MintForm({ onMinted }: { onMinted?: () => void }) {
  const { address, isConnected } = useAccount();
  const [uri, setUri] = useState(DEFAULT_URI);
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  if (!isNftConfigured()) {
    return (
      <p style={{ color: "#fc6" }}>
        Set <code>NEXT_PUBLIC_NFT_ADDRESS</code> in <code>apps/web/.env.local</code> after
        deploying the contract.
      </p>
    );
  }

  if (!isConnected || !address) {
    return <p>Connect a wallet first.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span>tokenURI (https:// or ipfs://…)</span>
        <input
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          style={{ padding: 8, fontFamily: "monospace" }}
        />
      </label>
      <button
        type="button"
        disabled={isPending || confirming || !uri}
        onClick={() => {
          reset();
          writeContract(
            {
              address: nftAddress,
              abi: simpleCollectibleAbi,
              functionName: "mint",
              args: [address, uri],
            },
            { onSuccess: () => onMinted?.() },
          );
        }}
      >
        {isPending ? "Confirm in wallet…" : confirming ? "Minting…" : "Mint NFT"}
      </button>
      {hash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          View tx
        </a>
      )}
      {isSuccess && <p style={{ color: "#6f6" }}>Mint confirmed.</p>}
      {error && <p style={{ color: "#f66" }}>{error.message}</p>}
    </div>
  );
}
