# 上游调研与对照学习

本项目**不是**闭门从零发明钱包/铸造协议，而是先搜 GitHub 可复用模板，再按「学习 MVP」裁剪落地。

## 1. 搜到并评估的仓库

| 仓库 | 结论 | 一句话 |
|------|------|--------|
| [umerDev/my-nft-dapp](https://github.com/umerDev/my-nft-dapp) | **主参考（前端）** | Next 15 + wagmi/viem + RainbowKit + Sepolia mint + `/nfts` gallery，功能面最贴 MVP |
| [RAHULDINDIGALA-32/avatar-nft-minter](https://github.com/RAHULDINDIGALA-32/avatar-nft-minter) | **结构参考（monorepo）** | MIT；同仓 `contracts/` + `app/`；Hardhat + OZ `safeMint`；完整但偏主题化/Pinata |
| [scaffold-eth/scaffold-eth-2](https://github.com/scaffold-eth/scaffold-eth-2) | 不选作首仓 | 社区标准（2k+⭐），但体积大、概念多，不适合「第一个」练手目标过重 |
| [anumukul/NFTForge](https://github.com/anumukul/NFTForge) | 不选 | 白名单/荷兰拍/质押/版税，超出「铸造+橱窗」 |
| [abutun/generic-nft-mint](https://github.com/abutun/generic-nft-mint) | 不选 | 只接已有合约的前端壳，缺本仓可部署合约学习路径 |
| [casaisdev/TimeShift-NFT-Frontend](https://github.com/casaisdev/TimeShift-NFT-Frontend) | 不选 | Vite/React，非 Next；合约分离 |

## 2. 最终复用了什么

- **前端模式**（对照 `my-nft-dapp`）：
  - RainbowKit + WagmiProvider + React Query 三层 Provider
  - 客户端 `mint`（钱包签名，后端不碰私钥）
  - `ipfs://` → HTTP gateway 解析
  - 个人/集合橱窗读 `tokenURI` + 元数据
- **目录模式**（对照 `avatar-nft-minter`）：
  - 同仓 `contracts/` + `apps/web/`（前端/合约可对照学）
  - 合约侧「mint(to, uri)」心智与 OZ `safeMint` 同类
- **未整仓 fork 的原因**：
  - `my-nft-dapp` 无 SPDX 许可声明、强依赖 Pinata 密钥、合约在另一仓
  - `avatar-nft-minter` 用 Hardhat（我们偏好 Foundry）、主题/资产过重
  - `scaffold-eth-2` 过重

## 3. 相对参考项目，我们改了什么（对照清单）

| 点 | 参考项目 | 本仓库 |
|----|----------|--------|
| 合约工具 | Hardhat 或外置仓 | **Foundry**（`forge build/test/script`） |
| ERC-721 实现 | OpenZeppelin | **自包含最小实现**（先懂接口，再换 OZ） |
| 钱包 UI | RainbowKit | **同样 RainbowKit**（已对齐模板） |
| 链 | Sepolia（有的还挂 mainnet） | **仅 Sepolia** |
| 存储 | Pinata 上传 | **占位图 / 自备 URI**（降低密钥门槛；IPFS gateway 仍支持） |
| 橱窗 | 全量 `tokenCounter` 扫描 | **`tokensOfOwner` + Transfer 监听**（个人橱窗更贴「交易所持仓」） |
| 范围 | 有的含质押/拍卖 | **刻意不做**：订单簿/版税/多链/主网 |

建议学习顺序：先跑通本仓 → 对照打开 `my-nft-dapp` 的 `providers` / gallery → 再读 `avatar-nft-minter` 的 OZ 合约，尝试把本仓换成 OZ。


## 4. RainbowKit 说明（诚实记录）

参考仓普遍用 RainbowKit。本仓曾接入 `@rainbow-me/rainbowkit`，但当前依赖树会经 wagmi connectors 拉入 Base Account / `@x402/*`，导致 `next build` 失败。  
因此 MVP **先保留 wagmi `injected` + 可选 WalletConnect**（可连 MetaMask），把 RainbowKit 标为下一步对照练习（打开 `my-nft-dapp` 的 `providers.tsx` / `config/rainbowkit.ts` 即可）。
