# 功能清單

## 功能狀態總覽

| 功能 | 狀態 | 說明 |
|------|------|------|
| 上市股票資料載入 | ✅ 完成 | fetch TWSE STOCK_DAY_ALL |
| 股票搜尋（代碼） | ✅ 完成 | 前綴匹配 |
| 股票搜尋（名稱） | ✅ 完成 | 模糊匹配 |
| 搜尋結果下拉清單 | ✅ 完成 | 最多 10 筆 |
| 收盤資料卡片 | ✅ 完成 | 6 項統計數值 |
| 資料抓取時間戳記 | ✅ 完成 | zh-TW 格式 |
| 手動重新整理 | ✅ 完成 | 按鈕觸發 re-fetch |
| 上櫃（TPEX）支援 | 🔲 規劃中 | 見 docs/plans/ |

---

## F1 — 股票資料載入

### 行為描述

頁面首次渲染後，`App` 元件透過 `useEffect`（空依賴陣列，只執行一次）呼叫 `fetchAllStocks()`，向 `/twse-api/exchangeReport/STOCK_DAY_ALL` 發出 GET 請求。

載入期間（`loadState === 'loading'`）：
- 搜尋框顯示 placeholder「資料載入中...」並設為 disabled
- 重新整理按鈕顯示「更新中...」並設為 disabled

**成功**（回傳非空陣列）：
- `allStocks` 儲存完整資料陣列（通常約 900–1100 支股票）
- `fetchedAt` 設定為當下的 `new Date()`
- `loadState` 切換為 `'ready'`
- 頁面底部顯示「已載入 N 支上市股票」

**失敗情境**：

| 情境 | API 行為 | app 行為 |
|------|---------|---------|
| 網路中斷 | `fetch()` 拋出 TypeError | `loadState → 'error'`，顯示錯誤訊息 |
| 非交易日 | 回傳空陣列 `[]` | throw `'目前無交易資料，可能為非交易日'` |
| HTTP 非 200 | `res.ok === false` | throw `'HTTP {狀態碼}'` |

---

## F2 — 股票搜尋

### 行為描述

搜尋框（`SearchBar`）為受控元件，使用者每次輸入都觸發 `handleQueryChange(val)`：

1. 更新 `query` state
2. 若 `val.trim()` 非空，設 `dropdownOpen = true`；否則 `false`

`results` 由 `useMemo` 從 `query` 和 `allStocks` 衍生，**不是 state**：

```
query + allStocks → useMemo → results（最多 10 筆）
```

### 搜尋邏輯

```javascript
s.Code.startsWith(q) || s.Name.toLowerCase().includes(q)
```

| 輸入 | 匹配規則 | 範例 |
|------|---------|------|
| 數字開頭 | Code 前綴匹配 | `"23"` → 2330, 2317, 2303... |
| 中文 | Name 模糊匹配 | `"台積"` → 台積電 |
| 英文字母 | Name 模糊匹配（不分大小寫） | `"tsmc"` → 若 Name 含此字串 |
| 空字串 | 無結果 | 下拉清單不顯示 |

**結果數量上限 10 筆**：`.slice(0, 10)` 截斷，避免下拉清單過長。排序為 TWSE API 原始順序（按代碼排序）。

### 下拉清單關閉條件

| 觸發 | 結果 |
|------|------|
| 點選清單中的項目 | 關閉，`selected` 設為該股票 |
| 點選搜尋框外任意區域 | 關閉（`document.addEventListener('mousedown', ...)` + `wrapperRef`） |
| 清空搜尋框（點 ✕ 或手動刪除） | 關閉（`dropdownOpen` 由 `handleQueryChange` 管理） |

---

## F3 — 搜尋結果清單

### 行為描述

`SearchResults` 元件在 `showDropdown === true`（`dropdownOpen && results.length > 0`）時渲染。

每個結果項目顯示三欄：

| 欄位 | CSS class | 對應 API 欄位 |
|------|-----------|-------------|
| 股票代碼 | `.result-code`（藍色粗體） | `Code` |
| 公司名稱 | `.result-name`（佔剩餘空間） | `Name` |
| 收盤價 | `.result-price`（右側灰色） | `ClosingPrice` |

點擊任一項目呼叫 `onSelect(stock)`，傳入整個 stock 物件（含所有 API 欄位）。

---

## F4 — 收盤資料卡片

### 行為描述

`StockCard` 在 `selected` 非 null 時渲染，接收完整 stock 物件。

**卡片結構**：

```
┌─────────────────────────────┐
│ 2330  台積電          [✕]   │  ← card-header
│                             │
│ 900.00        +5.00 (+0.56%)│  ← price-section（漲跌顏色）
├─────────────────────────────┤
│ 開盤價  最高價  最低價       │
│ 895.00  903.00  892.00      │  ← stats-grid 第一列
│                             │
│ 成交量  成交金額  成交筆數   │
│ 35,678張  321.46億  45,678  │  ← stats-grid 第二列
├─────────────────────────────┤
│ 資料來源：台灣證券交易所｜...│  ← card-note
└─────────────────────────────┘
```

### 漲跌顏色邏輯

台股慣例（與西方相反）：

| 條件 | CSS class | 顏色 |
|------|-----------|------|
| `Change > 0` | `.up` | 紅色 `#dc2626` |
| `Change < 0` | `.down` | 綠色 `#16a34a` |
| `Change === 0` 或 NaN | `.flat` | 灰色 `#64748b` |

`.up` / `.down` / `.flat` class 同時套用在 `.closing-price` 和 `.change-badge`。

### 漲跌百分比

API 不直接提供，由元件推導：

```
prevClose = ClosingPrice - Change
pct = (Change / prevClose) × 100
```

若 `Change` 或 `ClosingPrice` 無法解析為數字（值為 `"--"` 等），百分比不顯示。

### 關閉行為

點擊右上角 ✕ 按鈕呼叫 `onClose()`，`App` 將 `selected` 設回 `null`，卡片消失。搜尋框回到可輸入狀態。

---

## F5 — 資料抓取時間戳記

### 行為描述

`fetchedAt` state 在每次成功 fetch 後設為 `new Date()`（包含初次載入與手動重新整理）。

顯示格式：`資料抓取時間：2026/5/15 上午9:30:45`，使用 `Date.toLocaleString('zh-TW', { hour12: false })` 渲染為 24 小時制。

**載入中**時顯示「資料載入中...」（`loadState === 'loading' && fetchedAt === null`）。

**重新整理期間**：因 `loadState` 回到 `'loading'`，`fetchedAt` 的顯示文字會切換為「資料載入中...」，完成後顯示新時間。

---

## F6 — 手動重新整理

### 行為描述

「重新整理資料」按鈕觸發 `loadStocks()` 函式，流程與初始載入相同：

1. `setLoadState('loading')` — 立即禁用搜尋框與按鈕
2. `fetchAllStocks()` — 重新呼叫 API
3. 成功 → `setAllStocks(data)`、`setFetchedAt(new Date())`、`setLoadState('ready')`
4. 失敗 → `setErrorMsg(err.message)`、`setLoadState('error')`

**重新整理不會清除 `selected`**：若使用者已選取一支股票，刷新後卡片仍顯示舊資料（因為 `selected` 指向的是舊 `allStocks` 裡的物件參考，不是 `allStocks` 新陣列中的物件）。這是已知行為，後續可考慮在 `setAllStocks` 後同步更新 `selected`。

按鈕的 disabled 條件：`loadState === 'loading'`，此時文字改為「更新中...」。
