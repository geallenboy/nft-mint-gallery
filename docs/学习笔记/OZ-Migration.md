# SimpleCollectible: 自包含 vs OpenZeppelin 对比

本文档记录从手写最小 ERC-721 迁移到 OpenZeppelin 实现的对比与学习笔记。

## 1. 迁移动机

原版 `SimpleCollectible` 是完全自包含的 ERC-721 实现，目的是让初学者先理解接口细节。
在掌握基础后，使用 OpenZeppelin 可以：

- **减少安全风险**：OZ 合约经过广泛审计
- **标准合规**：确保完全符合 ERC-721 规范
- **扩展性**：轻松添加 Enumerable、Burnable 等扩展
- **对照学习**：与 `avatar-nft-minter` 等项目使用相同的 OZ 模式

## 2. 继承结构对比

### 原版（自包含）
```
SimpleCollectible
└── 手写所有 ERC-721 逻辑
    ├── _ownerOf mapping
    ├── _balanceOf mapping
    ├── _tokenApprovals mapping
    ├── _operatorApprovals mapping
    └── _tokenURIs mapping
```

### 新版（OpenZeppelin）
```
SimpleCollectible
├── ERC721 (核心 ERC-721)
├── ERC721URIStorage (tokenURI 存储)
└── ERC721Enumerable (枚举功能)
```

## 3. 函数对照表

| 功能 | 原版实现 | OZ 版本 |
|------|----------|---------|
| `mint(to, uri)` | 手写：`_nextId++`, mapping 赋值 | `_safeMint()` + `_setTokenURI()` |
| `tokenURI(tokenId)` | 直接读 `_tokenURIs` mapping | 继承自 `ERC721URIStorage` |
| `tokensOfOwner(owner, maxId)` | O(n) 循环扫描 `_ownerOf` | 使用 `ERC721Enumerable.tokenOfOwnerByIndex()` |
| `totalSupply()` | `_nextId - 1` | 继承自 `ERC721Enumerable` |
| `transferFrom` | 手写权限检查与状态更新 | 继承自 `ERC721`，有 `_update` hook |
| `supportsInterface` | 硬编码 interface IDs | 继承自多个父合约，自动合并 |

## 4. 关键实现细节

### 4.1 mint 函数

**原版**：
```solidity
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
```

**OZ 版本**：
```solidity
function mint(address to, string calldata uri) external returns (uint256 tokenId) {
    require(to != address(0), "Invalid recipient");
    tokenId = _nextId++;
    _safeMint(to, tokenId);      // OZ 内部处理所有状态更新
    _setTokenURI(tokenId, uri);  // 使用 ERC721URIStorage 的存储
    emit Minted(to, tokenId, uri);
}
```

### 4.2 tokensOfOwner 枚举

**原版**（O(n) 扫描）：
```solidity
function tokensOfOwner(address owner, uint256 maxId) external view returns (uint256[] memory) {
    uint256 bal = _balanceOf[owner];
    uint256[] memory ids = new uint256[](bal);
    uint256 filled = 0;
    uint256 last = maxId == 0 ? (_nextId - 1) : maxId;
    for (uint256 id = 1; id <= last && filled < bal; id++) {
        if (_ownerOf[id] == owner) {
            ids[filled++] = id;
        }
    }
    return ids;
}
```

**OZ 版本**（使用 ERC721Enumerable）：
```solidity
function tokensOfOwner(address owner, uint256 maxId) external view returns (uint256[] memory ids) {
    maxId; // 忽略，保持 API 兼容
    uint256 bal = balanceOf(owner);
    ids = new uint256[](bal);
    for (uint256 i = 0; i < bal; i++) {
        ids[i] = tokenOfOwnerByIndex(owner, i);  // O(1) 查询
    }
}
```

**为什么选择 ERC721Enumerable？**

- 保持 `tokensOfOwner(address, uint256)` API 与前端兼容
- `tokenOfOwnerByIndex` 是 O(1) 操作，比原版 O(n) 扫描更高效
- 额外提供 `tokenByIndex` 全局枚举能力
- 权衡：每次 transfer 有额外 gas 开销（维护索引），但对学习项目体量可接受

## 5. 必要的 Override 函数

由于多重继承，需要解决 diamond 继承冲突：

```solidity
// tokenURI: ERC721 vs ERC721URIStorage
function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
}

// supportsInterface: ERC721 vs ERC721URIStorage vs ERC721Enumerable
function supportsInterface(bytes4 interfaceId)
    public view override(ERC721, ERC721URIStorage, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
}

// _update: ERC721 vs ERC721Enumerable (transfer hook)
function _update(address to, uint256 tokenId, address auth)
    internal override(ERC721, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
}

// _increaseBalance: ERC721 vs ERC721Enumerable
function _increaseBalance(address account, uint128 value)
    internal override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, value);
}
```

## 6. 与 avatar-nft-minter 的对照

| 项目 | avatar-nft-minter | 本项目（OZ 版本） |
|------|-------------------|-------------------|
| 框架 | Hardhat | Foundry |
| OZ 版本 | @openzeppelin/contracts (npm) | openzeppelin-contracts (forge install) |
| 基础合约 | ERC721URIStorage | ERC721 + ERC721URIStorage + ERC721Enumerable |
| mint 方式 | `safeMint` (Ownable 限制) | `mint` (公开，学习用) |
| 枚举 | 无 | 有 `tokensOfOwner` + `tokenOfOwnerByIndex` |

## 7. 前端兼容性

迁移后前端**无需修改**调用方式：
- `mint(to, uri)` 签名不变
- `tokensOfOwner(owner, 0n)` 调用方式不变
- `tokenURI(tokenId)` 调用方式不变
- `Transfer` 和 `Minted` 事件保持一致

**新增可用函数**（可选使用）：
- `totalSupply()` - 获取总铸造数量
- `tokenByIndex(index)` - 按全局索引获取 tokenId
- `tokenOfOwnerByIndex(owner, index)` - 按所有者索引获取 tokenId

## 8. 部署注意

- **需要重新部署**：合约代码变更，必须部署新合约
- **更新环境变量**：部署后更新 `NEXT_PUBLIC_NFT_ADDRESS`
- **旧合约保留**：Sepolia 上的旧合约可作为历史参照

## 9. 学习总结

1. **先手写再用库**：理解了 ERC-721 的每个 mapping 和事件后，才能更好地使用 OZ
2. **多重继承**：Solidity 的 C3 线性化和 `super` 关键字在多继承中的行为
3. **Gas 权衡**：Enumerable 增加 transfer gas，但简化枚举逻辑
4. **API 兼容**：可以在 OZ 基础上包装自定义函数保持旧接口

---

*最后更新：2026-09-21*
