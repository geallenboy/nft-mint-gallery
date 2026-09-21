"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWatchContractEvent } from "wagmi";
import { simpleCollectibleAbi } from "@/abi/SimpleCollectible";
import {
  isNftConfigured,
  nftAddress,
  resolveMediaUrl,
} from "@/lib/config";

type Item = {
  tokenId: bigint;
  tokenURI: string;
  image?: string;
  name?: string;
  description?: string;
};

/** Heuristic: URI that is almost certainly a raw image, not ERC-721 metadata JSON. */
function looksLikeDirectImageUrl(url: string): boolean {
  if (/\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?|#|$)/i.test(url)) return true;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    // placehold.co uses paths like /600x600/.../png?text=...
    if (host === "placehold.co" || host.endsWith(".placehold.co")) return true;
    if (host === "via.placeholder.com" || host === "picsum.photos") return true;
    if (/\/(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(u.pathname)) return true;
  } catch {
    /* ignore */
  }
  return false;
}

async function loadMetadata(tokenURI: string): Promise<Partial<Item>> {
  const url = resolveMediaUrl(tokenURI);

  if (looksLikeDirectImageUrl(url)) {
    return { image: url };
  }

  try {
    const res = await fetch(url);
    if (!res.ok) return { image: url };

    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    if (contentType.startsWith("image/")) {
      return { image: url };
    }

    // Prefer JSON only when declared, or when body clearly starts with `{`
    const text = await res.text();
    const trimmed = text.trim();
    const maybeJson =
      contentType.includes("application/json") ||
      contentType.includes("+json") ||
      trimmed.startsWith("{");

    if (!maybeJson) {
      // Unknown non-JSON payload — treat URI itself as media if it looks visual, else show URI as image src (browser may still render)
      return { image: url };
    }

    try {
      const json = JSON.parse(trimmed) as {
        name?: string;
        description?: string;
        image?: string;
      };
      return {
        name: json.name,
        description: json.description,
        image: json.image ? resolveMediaUrl(json.image) : url,
      };
    } catch {
      return { image: url };
    }
  } catch {
    // Network / CORS: still try rendering the URI as <img> (placehold often works as img src)
    return { image: url };
  }
}

export function Gallery() {
  const { address, isConnected } = useAccount();
  const client = usePublicClient();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!client || !address || !isNftConfigured()) return;
    setLoading(true);
    setError(null);
    try {
      const ids = (await client.readContract({
        address: nftAddress,
        abi: simpleCollectibleAbi,
        functionName: "tokensOfOwner",
        args: [address, 0n],
      })) as readonly bigint[];

      const next: Item[] = [];
      for (const tokenId of ids) {
        const tokenURI = (await client.readContract({
          address: nftAddress,
          abi: simpleCollectibleAbi,
          functionName: "tokenURI",
          args: [tokenId],
        })) as string;
        const meta = await loadMetadata(tokenURI);
        next.push({ tokenId, tokenURI, ...meta });
      }
      setItems(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [address, client]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useWatchContractEvent({
    address: isNftConfigured() ? nftAddress : undefined,
    abi: simpleCollectibleAbi,
    eventName: "Transfer",
    onLogs: () => {
      void refresh();
    },
    enabled: isConnected && isNftConfigured(),
  });

  if (!isConnected) return <p>Connect to see your gallery.</p>;
  if (!isNftConfigured()) return null;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>My gallery</h2>
        <button type="button" onClick={() => void refresh()} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      {error && <p style={{ color: "#f66" }}>{error}</p>}
      {!loading && items.length === 0 && <p>No NFTs yet — mint one above.</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((it) => (
          <article
            key={it.tokenId.toString()}
            style={{
              border: "1px solid #333",
              borderRadius: 12,
              overflow: "hidden",
              background: "#111",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.image || resolveMediaUrl(it.tokenURI)}
              alt={it.name || `Token #${it.tokenId}`}
              style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }}
            />
            <div style={{ padding: 12, fontSize: 14 }}>
              <strong>#{it.tokenId.toString()}</strong>
              {it.name && <div>{it.name}</div>}
              <code style={{ fontSize: 11, wordBreak: "break-all" }}>
                {it.tokenURI}
              </code>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
