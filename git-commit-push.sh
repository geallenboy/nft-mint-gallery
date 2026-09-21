#!/usr/bin/env bash
set -euo pipefail
cd /Users/gegarron/workspace/myproject/web3/nft-mint-gallery

echo "== remote =="
git remote -v
# ensure correct remote name
git remote set-url origin git@github.com:geallenboy/nft-mint-gallery.git

echo "== status (before) =="
git status -sb

git add -A
# never commit secrets
git reset HEAD -- .env .env.local apps/web/.env.local apps/web/.env 2>/dev/null || true
# unstage if somehow added
git rm --cached -f .env .env.local apps/web/.env.local apps/web/.env 2>/dev/null || true

if [ -z "$(git status --porcelain)" ]; then
  echo "Working tree clean — pushing existing commits only."
else
  git status -sb
  git commit -m "$(cat <<'MSG'
feat: Sepolia NFT mint + gallery learning MVP

Next.js/wagmi frontend, Foundry SimpleCollectible, docs and project skill.
Gallery tokenURI handles placehold-style image URLs.
MSG
)"
fi

git push -u origin HEAD
echo "== done =="
git log -1 --oneline
git status -sb
git remote get-url origin
