# 台股查詢工具

輸入股票代碼或公司名稱，查詢台灣證券交易所（TWSE）上市股票的最近交易日收盤資料。

## 技術棧

| 層面 | 技術 |
|------|------|
| UI 框架 | React 19（含 StrictMode） |
| 建置工具 | Vite 8（Oxc 編譯器處理 JSX） |
| 樣式 | 原生 CSS nesting + custom properties（無 CSS-in-JS） |
| Lint | ESLint 10 flat config，含 react-hooks / react-refresh 插件 |
| 資料來源 | 台灣證券交易所 Open API（免費、無需 API key） |
| 部署 | Vercel（靜態 + rewrites proxy） |
| 版本控制 | Git + GitHub |

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（含 HMR 與 TWSE API proxy）
npm run dev
# → http://localhost:5173

# 生產打包
npm run build

# 預覽生產包
npm run preview

# Lint 檢查
npm run lint
```

## 常用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器，自動代理 TWSE API（解決 CORS） |
| `npm run build` | 輸出至 `dist/`，可直接部署 |
| `npm run preview` | 本地預覽 `dist/` 的生產包 |
| `npm run lint` | 執行 ESLint，零警告為通過標準 |

## 文件索引

| 文件 | 說明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 目錄結構、啟動流程、元件資料流、API 欄位、CSS 設計系統 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 開發規範、命名規則、新增功能步驟、計畫歸檔流程 |
| [FEATURES.md](./FEATURES.md) | 每個功能的行為描述、狀態機、邊界條件 |
| [TESTING.md](./TESTING.md) | 目前測試狀態、測試框架設定方式、撰寫指南 |
| [CHANGELOG.md](./CHANGELOG.md) | 版本更新日誌 |

## 注意事項

- 資料僅涵蓋**上市（TWSE）**股票，不含上櫃（TPEX）
- 台股交易時間：週一至週五 09:00–13:30（台灣時間）
- TWSE API 通常在收盤後 30–60 分鐘更新當日收盤資料
- 非交易日（假日、週末）API 回傳空陣列，app 顯示錯誤訊息
- app 在頁面載入時抓取一次資料；如需更新，點「重新整理資料」按鈕
