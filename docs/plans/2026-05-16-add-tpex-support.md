# 2026-05-16 新增上櫃（TPEX）股票資料

## User Story

身為使用者，我希望能搜尋上櫃公司的股票，以便查詢上市和上櫃股票的最近交易日收盤資料。

---

## Spec

- 搜尋結果同時涵蓋上市（TWSE）與上櫃（TPEX）股票
- 每筆搜尋結果需標示「上市」或「上櫃」badge，讓使用者一眼分辨
- 收盤資料卡片同樣顯示市場來源（台灣證券交易所 / 櫃買中心）
- 若其中一個 API 失敗，另一個市場的資料仍可正常使用（不全部失敗）
- 資料載入顯示「已載入上市 X 支、上櫃 Y 支」
- 若部分 API 失敗，顯示橘色警告文字說明哪個市場無法取得

### TPEX API

- Endpoint：`GET https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes`
- 需透過 proxy 解決 CORS（同 TWSE 的處理方式）
- 已驗證實際回傳欄位（2026-05-17）

| TPEX 欄位 | 統一欄位 | 備注 |
|-----------|---------|------|
| `SecuritiesCompanyCode` | `Code` | |
| `CompanyName` | `Name` | |
| `Close` | `ClosingPrice` | |
| `Open` | `OpeningPrice` | |
| `High` | `HighestPrice` | |
| `Low` | `LowestPrice` | |
| `TradingShares` | `TradeVolume` | 單位為股，與 TWSE 相同，不需轉換 |
| `TransactionAmount` | `TradeValue` | 單位為元，與 TWSE 相同 |
| `TransactionNumber` | `Transaction` | |
| `Change` | `Change` | 含尾端空白，需 `.trim()` |
| （新增）| `market: 'TPEX'` | |

TWSE 每筆資料也需加上 `market: 'TWSE'`。

---

## Tasks

### Proxy 設定
- [ ] `vite.config.js`：新增 `/tpex-api` proxy → `https://www.tpex.org.tw/openapi/v1`
- [ ] `vercel.json`：在 rewrites 最前面插入 TPEX 規則（Vercel 從上到下匹配）

### API 層
- [ ] 瀏覽器確認 TPEX API 實際欄位名稱，修正下方 normalize 對應表（如有出入）
- [ ] 新增 `src/services/tpexApi.js`：fetch + normalize 函式（欄位對應 + `market: 'TPEX'`）
- [ ] 修改 `src/services/twseApi.js`：return 前加 `.map(s => ({ ...s, market: 'TWSE' }))`

### App 邏輯
- [ ] `src/App.jsx`：新增 `partialMsg` state，`loadState` 增加 `'partial'` 值
- [ ] `src/App.jsx`：`loadStocks()` 與 `useEffect` 改用 `Promise.allSettled` 合併兩個 API
- [ ] `src/App.jsx`：status hint 顯示「上市 X 支、上櫃 Y 支」
- [ ] `src/App.jsx`：`partial` 狀態時顯示橘色 `partialMsg` 警告

### UI 元件
- [ ] `src/components/SearchResults.jsx`：每個結果項目加 market badge（上市/上櫃）
- [ ] `src/components/StockCard.jsx`：card-title 加 market badge
- [ ] `src/components/StockCard.jsx`：card-note 資料來源依 `stock.market` 動態顯示
- [ ] `src/App.css`：新增 `.market-badge`、`.market-twse`、`.market-tpex`、`.partial-warning` 樣式

### 驗證
- [ ] `npm run lint` 零錯誤
- [ ] 搜尋「2330」→ 台積電出現，藍色「上市」標籤
- [ ] 搜尋上櫃代碼（如「6488」環球晶）→ 出現，綠色「上櫃」標籤
- [ ] 點選上市/上櫃各一支，StockCard 顯示正確資料來源
- [ ] status hint 正確顯示兩市場股票數量
- [ ] 手動讓 TPEX proxy URL 打錯，確認 partial 警告出現但上市資料仍可搜尋
