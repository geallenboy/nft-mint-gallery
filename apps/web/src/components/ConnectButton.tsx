"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (isConnected && address) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {chainId !== sepolia.id && (
          <button type="button" onClick={() => switchChain({ chainId: sepolia.id })}>
            Switch to Sepolia
          </button>
        )}
        <code title={address}>
          {address.slice(0, 6)}…{address.slice(-4)}
        </code>
        <button type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {connectors.map((c) => (
        <button
          key={c.uid}
          type="button"
          disabled={isPending}
          onClick={() => connect({ connector: c, chainId: sepolia.id })}
        >
          {c.name}
        </button>
      ))}
      {error && <span style={{ color: "#f66" }}>{error.message}</span>}
    </div>
  );
}
