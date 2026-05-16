# CLAUDE.md

## 專案概述
project-claude-one — 台股收盤價查詢工具，React 19 + Vite SPA，部署於 Vercel

## 功能
- 輸入股票代碼或公司名稱，即時過濾並列出最多 10 筆候選結果
- 點選後顯示最近交易日收盤資料（收盤價、漲跌幅、開高低、成交量、成交金額、筆數）
- 顯示資料抓取時間，支援手動重新整理

## 資料來源
- **API**：台灣證券交易所 Open API — `STOCK_DAY_ALL`（上市股票當日成交資料）
- **CORS 解法**：本機開發透過 Vite proxy（`/twse-api/*`），Vercel 部署透過 `vercel.json` rewrites

## 常用指令
```bash
npm run dev       # 啟動開發伺服器（HMR），網址 http://localhost:5173
npm run build     # 生產環境打包，輸出至 dist/
npm run preview   # 本地預覽生產包
npm run lint      # 執行 ESLint
```

## 目錄結構
```
src/
├── services/
│   └── twseApi.js          # TWSE API 呼叫（fetch STOCK_DAY_ALL）
├── components/
│   ├── SearchBar.jsx        # 搜尋輸入框
│   ├── SearchResults.jsx    # 下拉候選清單（最多 10 筆）
│   └── StockCard.jsx        # 收盤資料卡片
├── App.jsx                  # 主元件：狀態管理、搜尋邏輯、資料抓取
├── App.css                  # 所有元件樣式
└── index.css                # 全域 CSS token 與 reset
vercel.json                  # Vercel proxy rewrite（/twse-api/* → TWSE）
vite.config.js               # Vite 設定（含本機 proxy）
```

## 關鍵規則
- 入口流程：`index.html` → `src/main.jsx` → `<App />` 掛載至 `#root`（StrictMode）
- 樣式使用原生 CSS nesting 與 custom properties；全域 token 定義在 `src/index.css`
- 所有元件樣式集中於 `App.css`，不另建 component 層級 CSS 檔
- 搜尋過濾邏輯用 `useMemo` 衍生，不用 `useEffect` setState
- 初次資料載入在 `useEffect` 直接 fetch；重新整理透過 `loadStocks()` 函式（僅由使用者互動觸發）
- 不新增超出需求的抽象或 feature flag；優先修改現有檔案而非新建

## 詳細文件
- ./docs/README.md — 項目介紹與快速開始
- ./docs/ARCHITECTURE.md — 架構、目錄結構、資料流
- ./docs/DEVELOPMENT.md — 開發規範、命名規則
- ./docs/FEATURES.md — 功能列表與完成狀態
- ./docs/TESTING.md — 測試規範與指南
- ./docs/CHANGELOG.md — 更新日誌

## 回覆方式
儘量使用簡單易懂的中文問我問題或說明
如果是特殊名詞可以用英文
執行任務過程中可以使用英文
