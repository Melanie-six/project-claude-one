# 架構文件

## 目錄結構

```
project-claude-one/
├── index.html                  # HTML 入口，掛載 #root，載入 src/main.jsx
├── vite.config.js              # Vite 設定：React plugin + dev proxy
├── vercel.json                 # Vercel 生產環境 rewrites（CORS proxy）
├── eslint.config.js            # ESLint flat config
├── package.json
├── src/
│   ├── main.jsx                # React 進入點，StrictMode + createRoot
│   ├── App.jsx                 # 根元件：所有狀態、fetch 邏輯、搜尋過濾
│   ├── App.css                 # 所有元件的 CSS（集中管理，不分散）
│   ├── index.css               # 全域 CSS：reset、design token、字型
│   ├── services/
│   │   └── twseApi.js          # TWSE API 呼叫與回傳驗證
│   ├── components/
│   │   ├── SearchBar.jsx       # 搜尋輸入框（受控元件）
│   │   ├── SearchResults.jsx   # 下拉候選清單
│   │   └── StockCard.jsx       # 收盤資料卡片（含格式化函式）
│   └── assets/                 # 靜態資源（目前為 Vite 範本殘留，未使用）
├── public/                     # 不經過 Vite 處理的靜態資源（favicon 等）
└── docs/                       # 開發文件
    └── plans/
        └── archive/            # 已完成的開發計畫
```

---

## 啟動流程

```
index.html
  └─ <script type="module" src="/src/main.jsx">
       └─ createRoot(document.getElementById('root'))
            └─ <StrictMode>
                 └─ <App />
                      ├─ mount 時：useEffect → fetchAllStocks() → setAllStocks
                      ├─ query 變化：useMemo → results（過濾後最多 10 筆）
                      └─ 使用者點選：setSelected → 顯示 StockCard
```

**StrictMode 的影響**：在開發模式下，React 會刻意執行 effect 兩次（mount → unmount → remount），因此 `fetchAllStocks()` 在開發時會被呼叫兩次。這是正常行為，生產環境只執行一次。

---

## 元件資料流

```
App（狀態中心）
│
├─ props → SearchBar
│    value={query}
│    onChange={handleQueryChange}   // 同步更新 query + dropdownOpen
│    disabled={loadState==='loading'}
│
├─ props → SearchResults（僅在 showDropdown 時渲染）
│    results={results}              // useMemo 計算，來自 allStocks + query
│    onSelect={handleSelect}        // 設定 selected，清空 query，關閉下拉
│
└─ props → StockCard（僅在 selected 非 null 時渲染）
     stock={selected}              // 完整的 stock 物件，直接來自 allStocks
     onClose={() => setSelected(null)}
```

**selected 物件不做 re-fetch**：點選後直接用 `allStocks` 裡的資料物件，不再打 API。好處是速度快且無需 loading 狀態；代價是資料為頁面載入時的快照，不會即時更新。

---

## App.jsx 狀態機

```
loadState: 'loading' → 'ready'
                     → 'error'

'loading'：初始值，或點「重新整理」後
  - SearchBar disabled
  - 按鈕顯示「更新中...」
  - fetched-at 顯示「資料載入中...」

'ready'：fetch 成功
  - SearchBar 可用
  - 顯示 fetched-at 時間戳記
  - 顯示「已載入 N 支上市股票」提示

'error'：fetch 失敗（網路錯誤、非交易日 API 空回傳）
  - SearchBar disabled
  - 顯示 errorMsg
```

**重要**：`loadStocks()` 函式（refresh 按鈕觸發）與 `useEffect` 內的邏輯幾乎相同，但分開寫。原因：ESLint 規則 `react-hooks/set-state-in-effect` 禁止在 effect body 內同步呼叫 setState，而 `loadStocks()` 第一行是 `setLoadState('loading')`（同步）。`useEffect` 內改為直接 fetch（初始值已是 'loading'，不需再 set）。

---

## TWSE API 規格

### Endpoint

```
GET https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL
```

每個交易日更新一次（收盤後約 30–60 分鐘）。非交易日回傳空陣列 `[]`。

### 回傳欄位

| 欄位 | 型別 | 說明 | 範例 |
|------|------|------|------|
| `Code` | string | 股票代碼 | `"2330"` |
| `Name` | string | 公司簡稱 | `"台積電"` |
| `TradeVolume` | string | 成交股數（單位：股） | `"35678000"` |
| `TradeValue` | string | 成交金額（單位：元） | `"32145678900"` |
| `OpeningPrice` | string | 開盤價 | `"895.00"` |
| `HighestPrice` | string | 最高價 | `"903.00"` |
| `LowestPrice` | string | 最低價 | `"892.00"` |
| `ClosingPrice` | string | 收盤價 | `"900.00"` |
| `Change` | string | 漲跌價差 | `"5.00"` 或 `"-3.00"` 或 `"--"` |
| `Transaction` | string | 成交筆數 | `"45678"` |

**所有數字欄位都是字串**，StockCard 使用 `parseFloat` / `parseInt` 轉換。

**Change 特殊值**：
- `"0.00"` — 平盤
- `"--"` — 未成交或特殊情況（`fmtPrice` 會直接顯示 `"--"`）
- 正數字串 — 上漲（台股慣例：紅色）
- 負數字串（含 `-` 符號）— 下跌（台股慣例：綠色）

### StockCard 數值格式化邏輯

| 函式 | 輸入 | 輸出 | 邏輯 |
|------|------|------|------|
| `fmtPrice(val)` | `"900.00"` | `"900.00"` | `parseFloat().toFixed(2)`；NaN 回傳原值或 `--` |
| `fmtVolume(val)` | `"35678000"` | `"35,678 張"` | `parseInt / 1000`（股→張），千位符 |
| `fmtValue(val)` | `"32145678900"` | `"321.46 億"` | ≥1億顯示億；<1億顯示萬 |
| `fmtCount(val)` | `"45678"` | `"45,678"` | 千位分隔符 |

**漲跌百分比推導**：API 不直接提供 `%`，由 StockCard 計算：
```
prevClose = ClosingPrice - Change
pct = (Change / prevClose) * 100
```
若 `prevClose === 0` 或任一值為 NaN，則不顯示百分比。

---

## CORS 解決方案

TWSE API 沒有 `Access-Control-Allow-Origin` header，瀏覽器會封鎖直接請求。

### 開發環境（Vite proxy）

`vite.config.js` 設定 proxy，瀏覽器打 `localhost:517X/twse-api/*`，Vite dev server 轉發至 TWSE：

```
Browser → GET /twse-api/exchangeReport/STOCK_DAY_ALL
  Vite proxy → GET https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL
```

`changeOrigin: true` 修改 request 的 `Origin` header，避免 TWSE 拒絕。

### 生產環境（Vercel rewrites）

`vercel.json` 的 `rewrites` 讓 Vercel CDN 邊緣節點轉發請求，效果與 Vite proxy 相同：

```
Browser → GET https://your-app.vercel.app/twse-api/...
  Vercel edge → GET https://openapi.twse.com.tw/v1/...
```

**兩個環境都使用相同的 URL prefix `/twse-api`**，`twseApi.js` 不需判斷環境。

---

## CSS 設計系統

所有設計 token 定義在 `src/index.css` 的 `:root`：

| 變數 | 值 | 用途 |
|------|----|------|
| `--text` | `#334155` | 一般正文 |
| `--text-secondary` | `#64748b` | 次要文字、label |
| `--text-heading` | `#0f172a` | 標題、重要數值 |
| `--bg` | `#f1f5f9` | 頁面背景 |
| `--card-bg` | `#ffffff` | 卡片背景 |
| `--border` | `#e2e8f0` | 邊框 |
| `--border-focus` | `#3b82f6` | focus ring 顏色 |
| `--accent` | `#1e40af` | 強調色（代碼、按鈕） |
| `--up` | `#dc2626` | 股價上漲（台股：紅） |
| `--down` | `#16a34a` | 股價下跌（台股：綠） |
| `--flat` | `#64748b` | 平盤 |
| `--shadow` | `0 1px 3px ...` | 輕陰影（搜尋框） |
| `--shadow-md` | `0 4px 6px ...` | 中等陰影（卡片） |
| `--radius` | `12px` | 圓角（主要） |
| `--radius-sm` | `8px` | 圓角（小元件） |

**台股色彩慣例**：漲用紅（`--up`）、跌用綠（`--down`），與西方習慣相反。

**CSS 集中原則**：所有元件的 class 樣式都在 `App.css`，不建立 per-component 的 `SearchBar.css` 等檔案。理由：app 規模小，集中管理方便追蹤 token 使用。
