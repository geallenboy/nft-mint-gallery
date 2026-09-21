#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/contracts"
if [ ! -d lib/forge-std/src ]; then
  forge install foundry-rs/forge-std --no-commit
fi
forge build
forge test -vv
