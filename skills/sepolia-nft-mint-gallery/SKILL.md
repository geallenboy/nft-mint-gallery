---
name: sepolia-nft-mint-gallery
description: >-
  Use when creating, continuing, debugging, or teaching a Sepolia testnet
  ERC-721 mint + personal gallery dapp (Next.js + wagmi/viem + Foundry),
  especially under a web3 category folder like myproject/web3/<project-name>.
  Not for mainnet, order books, royalties, or full marketplaces.
---

# Sepolia NFT Mint + Gallery (learning MVP)

## Goal

Ship or maintain a **testnet-only** vertical slice:

1. Connect wallet (MetaMask / injected; optional WalletConnect)
2. Deploy a simple ERC-721 with Foundry
3. Web UI: mint → list NFTs owned by the connected address → show tokenURI/image
4. Refresh via button and/or `Transfer` event watch
5. Document env placeholders; never commit secrets

## Layout convention

Prefer:

```text
…/web3/                    # category parent (not the app root)
  <project-name>/          # e.g. nft-mint-gallery
    apps/web/
    contracts/
    docs/
    skills/
```

Do not treat the category folder as the package root.

## Stack defaults

- Frontend: Next.js (App Router) + TypeScript + wagmi v2 + viem
- Contracts: Foundry; start with a minimal ERC-721 (or OZ once the learner is ready)
- Chain: Ethereum Sepolia only
- Wallet UI: wagmi `injected` first; RainbowKit is optional (watch for connector dependency breakages on Next build)

## Procedure

### 1. Contracts

```bash
cd <project>/contracts
forge install foundry-rs/forge-std --no-commit   # if lib missing
forge build
forge test
```

### 2. Deploy (test key only)

```bash
export SEPOLIA_RPC_URL=…
export PRIVATE_KEY=0x…   # throwaway test wallet — never mainnet, never commit
forge script script/Deploy.s.sol:Deploy --rpc-url "$SEPOLIA_RPC_URL" --broadcast -vvvv
```

Record the deployed address.

### 3. Frontend env

Copy `.env.example` → `apps/web/.env.local`:

- `NEXT_PUBLIC_SEPOLIA_RPC_URL`
- `NEXT_PUBLIC_NFT_ADDRESS`
- optional `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- optional `NEXT_PUBLIC_IPFS_GATEWAY`

### 4. Run UI

```bash
cd apps/web && npm install && npm run dev
```

Verify: Sepolia network → connect → mint → gallery shows tokenId + image.

## tokenURI / gallery rules

When resolving metadata for display:

1. If URI looks like a **direct image** (file extension, `placehold.co`, path segment `/png|jpg|…`, or `Content-Type: image/*`) → use as `image`, do **not** force `JSON.parse`
2. If JSON (declared content-type or body starts with `{`) → parse `name` / `description` / `image`
3. On fetch/CORS failure → still try using the URI as `<img src>` when it is meant to be an image
4. Support `ipfs://` via a public gateway env

## Safety hard rules

- Never commit `.env`, `.env.local`, or private keys
- Never deploy learner exercises to mainnet
- Prefer a disposable Sepolia account
- Do not expand scope into marketplace/order book unless the user explicitly asks

## Upstream learning (optional)

Before greenfield, skim and cite:

- https://github.com/umerDev/my-nft-dapp — frontend patterns
- https://github.com/RAHULDINDIGALA-32/avatar-nft-minter — monorepo + OZ mint
- Avoid starting from heavy kits (scaffold-eth-2) for a first MVP unless requested

Project-local notes: `docs/UPSTREAM.md`, `docs/学习笔记/`.

## Done when

- [ ] `forge test` passes
- [ ] Contract deployed on Sepolia (or clearly blocked on missing RPC/key/ETH)
- [ ] Frontend connects on Sepolia and mints
- [ ] Gallery shows owned tokens with a visible image for placeholder URIs
- [ ] README / env example updated; no secrets in git
