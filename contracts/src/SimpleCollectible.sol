// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/// @title SimpleCollectible (OpenZeppelin version)
/// @notice ERC-721 for Sepolia learning: public mint + tokenURI, gallery-friendly enumeration.
/// @dev Now using OpenZeppelin ERC721 + ERC721URIStorage + ERC721Enumerable.
///      Keeps the same external interface as the hand-rolled version for frontend compatibility.
///      See docs/学习笔记/OZ-Migration.md for comparison with the original self-contained version.
contract SimpleCollectible is ERC721, ERC721URIStorage, ERC721Enumerable {
    /// @notice Emitted after each successful mint (kept for frontend event listening compatibility).
    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);

    uint256 private _nextId = 1;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    /// @notice Public mint for learning. Anyone can mint; URI can be ipfs:// or https://.
    /// @param to Recipient address (cannot be zero).
    /// @param uri Token metadata URI (ERC-721 Metadata JSON or direct image URL).
    /// @return tokenId The newly minted token ID.
    function mint(address to, string calldata uri) external returns (uint256 tokenId) {
        require(to != address(0), "Invalid recipient");
        tokenId = _nextId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit Minted(to, tokenId, uri);
    }

    /// @notice Enumerate owned token IDs (gallery-compatible helper).
    /// @dev Uses ERC721Enumerable under the hood. The `maxId` parameter is kept for
    ///      API compatibility but ignored — ERC721Enumerable tracks ownership precisely.
    /// @param owner Address to query.
    /// @param maxId Ignored (kept for backward compatibility with frontend).
    /// @return ids Array of token IDs owned by `owner`.
    function tokensOfOwner(address owner, uint256 maxId) external view returns (uint256[] memory ids) {
        maxId; // silence unused variable warning
        uint256 bal = balanceOf(owner);
        ids = new uint256[](bal);
        for (uint256 i = 0; i < bal; i++) {
            ids[i] = tokenOfOwnerByIndex(owner, i);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Required overrides for multiple inheritance (ERC721, ERC721URIStorage, ERC721Enumerable)
    // ────────────────────────────────────────────────────────────────────────────

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}
