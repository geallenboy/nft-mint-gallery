// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {SimpleCollectible} from "../src/SimpleCollectible.sol";

contract SimpleCollectibleTest is Test {
    SimpleCollectible nft;
    address alice = address(0xA11CE);

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

    function testTokensOfOwner() public {
        nft.mint(alice, "ipfs://a");
        nft.mint(alice, "ipfs://b");
        uint256[] memory ids = nft.tokensOfOwner(alice, 0);
        assertEq(ids.length, 2);
        assertEq(ids[0], 1);
        assertEq(ids[1], 2);
    }
}
