// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SimpleCollectible
/// @notice Minimal ERC-721 for Sepolia learning: mint + tokenURI, no marketplace.
/// @dev Intentionally self-contained (no OpenZeppelin) so `forge build` works after
///      installing only forge-std. Replace with OZ later when you practice upgrades.
contract SimpleCollectible {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);

    string public name;
    string public symbol;

    uint256 private _nextId = 1;
    mapping(uint256 => address) private _ownerOf;
    mapping(address => uint256) private _balanceOf;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => string) private _tokenURIs;

    error NotOwnerNorApproved();
    error InvalidRecipient();
    error NotMinted();
    error AlreadyMinted();

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
    }

    function balanceOf(address owner) external view returns (uint256) {
        require(owner != address(0), "zero");
        return _balanceOf[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _ownerOf[tokenId];
        if (owner == address(0)) revert NotMinted();
        return owner;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        if (_ownerOf[tokenId] == address(0)) revert NotMinted();
        return _tokenURIs[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return _nextId - 1;
    }

    function approve(address spender, uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        if (msg.sender != owner && !_operatorApprovals[owner][msg.sender]) {
            revert NotOwnerNorApproved();
        }
        _tokenApprovals[tokenId] = spender;
        emit Approval(owner, spender, tokenId);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        if (_ownerOf[tokenId] == address(0)) revert NotMinted();
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        if (to == address(0)) revert InvalidRecipient();
        address owner = ownerOf(tokenId);
        require(owner == from, "wrong from");
        if (
            msg.sender != from && msg.sender != _tokenApprovals[tokenId]
                && !_operatorApprovals[from][msg.sender]
        ) {
            revert NotOwnerNorApproved();
        }
        delete _tokenApprovals[tokenId];
        _balanceOf[from] -= 1;
        _balanceOf[to] += 1;
        _ownerOf[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata) external {
        transferFrom(from, to, tokenId);
    }

    /// @notice Public mint for learning. Anyone can mint; URI can be ipfs:// or https://.
    function mint(address to, string calldata uri) external returns (uint256 tokenId) {
        if (to == address(0)) revert InvalidRecipient();
        tokenId = _nextId++;
        if (_ownerOf[tokenId] != address(0)) revert AlreadyMinted();
        _ownerOf[tokenId] = to;
        _balanceOf[to] += 1;
        _tokenURIs[tokenId] = uri;
        emit Transfer(address(0), to, tokenId);
        emit Minted(to, tokenId, uri);
    }

    /// @notice Enumerate owned token ids (O(n) — fine for learning / small collections).
    function tokensOfOwner(address owner, uint256 maxId) external view returns (uint256[] memory) {
        uint256 bal = _balanceOf[owner];
        uint256[] memory ids = new uint256[](bal);
        if (bal == 0) return ids;
        uint256 filled = 0;
        uint256 last = maxId == 0 ? (_nextId - 1) : maxId;
        for (uint256 id = 1; id <= last && filled < bal; id++) {
            if (_ownerOf[id] == owner) {
                ids[filled++] = id;
            }
        }
        return ids;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x80ac58cd // ERC721
            || interfaceId == 0x5b5e139f // ERC721Metadata
            || interfaceId == 0x01ffc9a7; // ERC165
    }
}
