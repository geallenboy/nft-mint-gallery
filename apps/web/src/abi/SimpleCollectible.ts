/**
 * SimpleCollectible ABI (OpenZeppelin version)
 * Now using ERC721 + ERC721URIStorage + ERC721Enumerable from OpenZeppelin.
 * Maintains backward compatibility with the original hand-rolled version.
 */
export const simpleCollectibleAbi = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Core functions (same as original SimpleCollectible)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "uri", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "tokensOfOwner",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "maxId", type: "uint256" },
    ],
    outputs: [{ type: "uint256[]" }],
  },
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ERC721Enumerable functions (new in OZ version)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenByIndex",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenOfOwnerByIndex",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ERC721 transfer & approval (standard OZ implementation)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "transferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "safeTransferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getApproved",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "setApprovalForAll",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "isApprovedForAll",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "supportsInterface",
    stateMutability: "view",
    inputs: [{ name: "interfaceId", type: "bytes4" }],
    outputs: [{ type: "bool" }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Events
  // ─────────────────────────────────────────────────────────────────────────────
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "approved", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
  {
    type: "event",
    name: "ApprovalForAll",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "operator", type: "address", indexed: true },
      { name: "approved", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Minted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "tokenURI", type: "string", indexed: false },
    ],
  },
] as const;
