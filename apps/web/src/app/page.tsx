import { ConnectButton } from "@/components/ConnectButton";
import { MintForm } from "@/components/MintForm";
import { Gallery } from "@/components/Gallery";
import { isNftConfigured, nftAddress } from "@/lib/config";

export default function HomePage() {
  return (
    <main>
      <header>
        <div>
          <h1 style={{ margin: "0 0 8px" }}>NFT Mint + Gallery (Sepolia)</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Learning MVP — not a marketplace. Connect MetaMask → mint → see your tokens.
          </p>
        </div>
        <ConnectButton />
      </header>

      <section>
        <h2>Contract</h2>
        {isNftConfigured() ? (
          <p>
            <code>{nftAddress}</code>{" "}
            <a
              href={`https://sepolia.etherscan.io/address/${nftAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              Etherscan
            </a>
          </p>
        ) : (
          <p>
            Contract address not set. Deploy with Foundry, then put the address in{" "}
            <code>NEXT_PUBLIC_NFT_ADDRESS</code>.
          </p>
        )}
      </section>

      <section>
        <h2>Mint</h2>
        <MintForm />
      </section>

      <section>
        <Gallery />
      </section>
    </main>
  );
}
