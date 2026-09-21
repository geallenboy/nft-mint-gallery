// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {SimpleCollectible} from "../src/SimpleCollectible.sol";

contract Deploy is Script {
    function run() external returns (SimpleCollectible nft) {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);
        nft = new SimpleCollectible("AI Short Drama Collectible", "ASDC");
        vm.stopBroadcast();
        console2.log("SimpleCollectible (OZ) deployed at:", address(nft));
    }
}
