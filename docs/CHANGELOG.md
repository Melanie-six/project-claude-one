# Changelog

## [0.2.0] — 2026-05-15

### Added
- 資料抓取時間戳記：顯示最近一次成功 fetch 的時間（`zh-TW` 24 小時制格式）
- 「重新整理資料」按鈕：手動觸發重新呼叫 TWSE API，更新 `allStocks` 與時間戳記
- 載入中狀態下按鈕顯示「更新中...」並 disabled，防止重複點擊

### Changed
- `App.jsx`：新增 `fetchedAt` state 與 `loadStocks()` 函式
- `App.css`：新增 `.data-status`、`.fetched-at`、`.refresh-btn` 樣式

---

## [0.1.0] — 2026-05-14

### Added
- 初始版本：台股上市股票查詢工具
- 整合 TWSE Open API（`STOCK_DAY_ALL`），頁面載入時一次抓取所有上市股票資料
- 搜尋框：支援股票代碼（前綴匹配）與公司名稱（模糊匹配）
- 搜尋下拉清單：最多顯示 10 筆符合結果，點選後展開詳細卡片
- 收盤資料卡片：收盤價、漲跌幅（%）、開盤、最高、最低、成交量（張）、成交金額、成交筆數
- CORS 解決方案：開發環境 Vite proxy，Vercel 部署 rewrites
- 部署至 Vercel，GitHub push 自動觸發重新部署
