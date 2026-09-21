// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {SimpleCollectible} from "../src/SimpleCollectible.sol";

contract SimpleCollectibleTest is Test {
    SimpleCollectible nft;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function setUp() public {
        nft = new SimpleCollectible("Test", "TST");
    }

    function testMint() public {
        uint256 id = nft.mint(alice, "ipfs://QmExample/1.json");
        assertEq(id, 1);
        assertEq(nft.ownerOf(1), alice);
        assertEq(nft.balanceOf(alice), 1);
        assertEq(nft.tokenURI(1), "ipfs://QmExample/1.json");
    }

    function testMintEmitsEvents() public {
        vm.expectEmit(true, true, true, true);
        emit Transfer(address(0), alice, 1);
        vm.expectEmit(true, true, false, true);
        emit Minted(alice, 1, "ipfs://QmExample/1.json");
        nft.mint(alice, "ipfs://QmExample/1.json");
    }

    function testTokensOfOwner() public {
        nft.mint(alice, "ipfs://a");
        nft.mint(alice, "ipfs://b");
        uint256[] memory ids = nft.tokensOfOwner(alice, 0);
        assertEq(ids.length, 2);
        assertEq(ids[0], 1);
        assertEq(ids[1], 2);
    }

    function testTotalSupply() public {
        assertEq(nft.totalSupply(), 0);
        nft.mint(alice, "ipfs://a");
        assertEq(nft.totalSupply(), 1);
        nft.mint(bob, "ipfs://b");
        assertEq(nft.totalSupply(), 2);
    }

    function testTransfer() public {
        nft.mint(alice, "ipfs://a");
        vm.prank(alice);
        nft.transferFrom(alice, bob, 1);
        assertEq(nft.ownerOf(1), bob);
        assertEq(nft.balanceOf(alice), 0);
        assertEq(nft.balanceOf(bob), 1);
    }

    function testTokensOfOwnerAfterTransfer() public {
        nft.mint(alice, "ipfs://a");
        nft.mint(alice, "ipfs://b");
        vm.prank(alice);
        nft.transferFrom(alice, bob, 1);
        
        uint256[] memory aliceIds = nft.tokensOfOwner(alice, 0);
        assertEq(aliceIds.length, 1);
        assertEq(aliceIds[0], 2);
        
        uint256[] memory bobIds = nft.tokensOfOwner(bob, 0);
        assertEq(bobIds.length, 1);
        assertEq(bobIds[0], 1);
    }

    function testSupportsInterface() public view {
        assertTrue(nft.supportsInterface(0x80ac58cd)); // ERC721
        assertTrue(nft.supportsInterface(0x5b5e139f)); // ERC721Metadata
        assertTrue(nft.supportsInterface(0x01ffc9a7)); // ERC165
        assertTrue(nft.supportsInterface(0x780e9d63)); // ERC721Enumerable
    }

    function testMintToZeroReverts() public {
        vm.expectRevert();
        nft.mint(address(0), "ipfs://a");
    }

    function testNameAndSymbol() public view {
        assertEq(nft.name(), "Test");
        assertEq(nft.symbol(), "TST");
    }
}
