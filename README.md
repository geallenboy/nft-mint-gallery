# Web3 NFT Gallery MVP（Sepolia）
> 本仓库位于分类目录 `myproject/web3/` 下的项目名 **`nft-mint-gallery`**（`web3` 本身不是项目根）。


> **对照学习**：先搜 GitHub 模板再裁剪。详见 [`docs/UPSTREAM.md`](docs/UPSTREAM.md)。  
> 前端模式参考 [umerDev/my-nft-dapp](https://github.com/umerDev/my-nft-dapp)；目录形态参考 [avatar-nft-minter](https://github.com/RAHULDINDIGALA-32/avatar-nft-minter)；合约用 Foundry 自建最小 ERC-721（便于先懂接口再换 OZ）。

测试网「**NFT 铸造 + 个人橱窗**」学习脚手架，为后续 NFT Web 交易所技能打底。  
**不是**完整交易所：无订单簿、无版税引擎、无多链、不上主网。

## 栈与原因

| 层 | 选型 | 原因 |
|----|------|------|
| 前端 | Next.js 15 + TypeScript + wagmi v2 + viem + wagmi injected（RainbowKit 见 UPSTREAM 下一步） | 对齐主流 NFT mint 模板（my-nft-dapp / avatar-nft-minter）；类型安全 |
| 合约 | Foundry（`SimpleCollectible` 自包含 ERC-721） | 编译/测试快；先不引 OpenZeppelin，降低首次 `forge install` 摩擦；学会后再换成 OZ |
| 链 | Ethereum Sepolia | 水龙头多、工具全、与多数教程一致 |

## 目录

```
web3/
├── apps/web/          # Next.js 前端（连接钱包 / 铸造 / 橱窗 / Transfer 监听）
├── contracts/         # Foundry：SimpleCollectible + Deploy + tests
├── .env.example       # 环境变量模板（无密钥）
└── README.md
```

## 你需要准备

1. **Node.js 20+**
2. **Foundry**（`curl -L https://foundry.paradigm.xyz | bash && foundryup`）
3. **MetaMask**（网络加 Sepolia）
4. **Sepolia ETH**（水龙头，任选）：
   - https://sepoliafaucet.com
   - https://www.alchemy.com/faucets/ethereum-sepolia
5. （推荐）**Alchemy / Infura / public RPC** URL  
6. （可选）[WalletConnect Cloud](https://cloud.walletconnect.com) Project ID（没有也能用浏览器注入的 MetaMask）

## 快速开始（5 步）

```bash
cd /Users/gegarron/workspace/myproject/web3/nft-mint-gallery

# 1) 合约依赖 + 编译 + 单测
cd contracts
forge install foundry-rs/forge-std --no-commit
forge build
forge test
cd ..

# 2) 部署到 Sepolia（用一次性测试私钥，切勿用主网钱包）
export SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"   # 或你的 Alchemy URL
export PRIVATE_KEY="0x..."                                            # 测试号私钥
cd contracts
forge script script/Deploy.s.sol:Deploy --rpc-url "$SEPOLIA_RPC_URL" --broadcast -vvvv
# 记下日志里的合约地址
cd ..

# 3) 前端 env
cp .env.example apps/web/.env.local
# 编辑 apps/web/.env.local：
#   NEXT_PUBLIC_SEPOLIA_RPC_URL=...
#   NEXT_PUBLIC_NFT_ADDRESS=0x部署得到的地址
#   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...   # 可选

# 4) 装前端依赖并启动
cd apps/web
npm install
npm run dev
# 打开 http://localhost:3000

# 5) MetaMask 切到 Sepolia → Connect → Mint → 橱窗应出现 NFT
```

合约地址占位：未配置时前端会提示设置 `NEXT_PUBLIC_NFT_ADDRESS`。

## 学到的点（刻意设计）

- **ERC-721 最小面**：`mint` / `ownerOf` / `tokenURI` / `Transfer`；另提供 `tokensOfOwner` 方便橱窗（O(n)，仅适合学习体量）。
- **tokenURI**：可用 `https://placehold.co/...` 占位图，或 `ipfs://...`（前端用 `NEXT_PUBLIC_IPFS_GATEWAY` 解析）。
- **钱包**：wagmi `injected`（MetaMask）+ 可选 WalletConnect；强制感知 Sepolia。
- **刷新**：手动 Refresh + `useWatchContractEvent(Transfer)` 自动刷新持仓。
- **安全**：`.env` / `.env.local` 已 gitignore；**不要提交私钥**；只用测试网扔弃钱包。

## 验证清单

- [ ] `forge build` / `forge test` 通过
- [ ] Sepolia 上 `Deploy` 广播成功，Etherscan 可见合约
- [ ] 前端能连 MetaMask（Sepolia）
- [ ] Mint 后橱窗出现 tokenId + 图片/URI
- [ ] 另开标签转账（或二次 mint）后监听/刷新更新列表

## 明确未做（留给交易所技能）

订单簿、挂单/吃单、版税、多链桥、索引器（The Graph）、账户抽象、主网发布。

## License

MIT（学习用途）。合约与前端代码为 gegarron 练习脚手架。
