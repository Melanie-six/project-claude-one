# CLAUDE.md

## 專案概述
project-claude-one — React 19 + Vite SPA，使用 Oxc 編譯 JSX，ESLint flat config

## 常用指令
```bash
npm run dev       # 啟動開發伺服器（HMR），網址 http://localhost:5173
npm run build     # 生產環境打包，輸出至 dist/
npm run preview   # 本地預覽生產包
npm run lint      # 執行 ESLint
```

## 關鍵規則
- 入口流程：`index.html` → `src/main.jsx` → `<App />` 掛載至 `#root`（StrictMode）
- 樣式使用原生 CSS nesting 與 custom properties；全域 token 定義在 `src/index.css`，支援 `prefers-color-scheme` 深色模式
- Component 樣式檔與元件放在同一目錄（如 `App.css` 與 `App.jsx`）
- 功能開發使用 `docs/plans/` 記錄計畫；完成後移至 `docs/plans/archive/`
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
