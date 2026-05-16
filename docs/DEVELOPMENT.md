# 開發規範

## 命名規則

### 檔案命名

| 類型 | 規則 | 範例 |
|------|------|------|
| React 元件 | PascalCase `.jsx` | `StockCard.jsx` |
| Service / 工具模組 | camelCase `.js` | `twseApi.js` |
| CSS 檔案 | 與對應的 jsx 同名 | `App.css` |
| 文件 | 全大寫 `.md` | `ARCHITECTURE.md` |
| 計畫檔案 | `YYYY-MM-DD-<feature-name>.md` | `2026-05-15-add-tpex-support.md` |

### 程式碼命名

| 類型 | 規則 | 範例 |
|------|------|------|
| React 元件 | PascalCase | `SearchResults` |
| 函式 | camelCase，動詞開頭 | `handleSelect`, `loadStocks` |
| state 變數 | camelCase，名詞 | `allStocks`, `loadState`, `fetchedAt` |
| CSS class | kebab-case | `.search-bar`, `.result-item` |
| CSS 變數 | `--` 前綴，kebab-case | `--text-heading`, `--border-focus` |
| 格式化函式（StockCard 內） | `fmt` 前綴 | `fmtPrice`, `fmtVolume` |

---

## 關鍵開發規範

### 1. 不在 useEffect 內同步呼叫 setState

ESLint 規則 `react-hooks/set-state-in-effect` 會報錯。

**錯誤寫法**：
```javascript
useEffect(() => {
  setLoadState('loading')   // ❌ 同步 setState
  fetchData().then(...)
}, [])
```

**正確寫法**：初始值設為 `'loading'`，useEffect 內只做 fetch：
```javascript
const [loadState, setLoadState] = useState('loading')  // 初始值

useEffect(() => {
  fetchData()                // ✅ 非同步，setState 在 .then() 裡
    .then(data => setLoadState('ready'))
    .catch(err => setLoadState('error'))
}, [])
```

如需在使用者互動觸發 re-fetch（如 refresh 按鈕），才另外寫一個函式（`loadStocks()`），在函式內可以正常 setState。

### 2. 搜尋過濾使用 useMemo，不用 useEffect

`results` 是從 `query` + `allStocks` 衍生出來的值，用 `useMemo` 計算，不需要額外的 state：

```javascript
// ✅ 正確
const results = useMemo(() => {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return allStocks.filter(s => s.Code.startsWith(q) || s.Name.toLowerCase().includes(q)).slice(0, 10)
}, [query, allStocks])

// ❌ 錯誤（觸發 set-state-in-effect 規則）
useEffect(() => {
  setResults(allStocks.filter(...))
}, [query, allStocks])
```

### 3. 樣式集中在 App.css

不建立 `SearchBar.css`、`StockCard.css` 等 per-component 樣式檔。所有元件的 CSS class 都放在 `App.css`。設計 token（顏色、間距變數）定義在 `index.css` 的 `:root`。

### 4. 不修改 selected 物件做二次 fetch

點選搜尋結果後，`selected` 直接使用 `allStocks` 陣列裡的物件參考，不再打 API。如需即時最新資料，提示使用者點「重新整理資料」。

---

## 新增 API 資料來源的步驟

以新增上櫃（TPEX）為例：

1. **確認 API 欄位**：直接打 TPEX API URL，確認實際回傳的 JSON 欄位名稱
2. **建立 service 檔**：`src/services/tpexApi.js`，包含 fetch 函式與 normalize 函式（將 TPEX 欄位對應到統一格式）
3. **新增 proxy**：
   - `vite.config.js`：在 `server.proxy` 加新路由
   - `vercel.json`：在 `rewrites` 陣列**最前面**插入新規則（Vercel 從上到下匹配）
4. **更新 App.jsx**：改用 `Promise.allSettled` 合併兩個 API 結果，加入 `partial` 狀態處理（其中一個失敗仍可使用另一個）
5. **更新 UI**：在搜尋結果與卡片加上 market badge（上市/上櫃）
6. **執行 `npm run lint`** 確認無錯誤

---

## 新增元件的步驟

1. 在 `src/components/` 建立 `ComponentName.jsx`
2. 只接受 props，不管理自己的 fetch 邏輯（fetch 在 App.jsx）
3. 在 `App.css` 尾端新增該元件的樣式
4. 在 `App.jsx` import 並使用
5. 執行 `npm run lint`

---

## 環境變數

目前**無需**任何環境變數。TWSE API 不需要 API key。

若未來需要環境變數：

| 規則 | 說明 |
|------|------|
| Vite 要求前綴 `VITE_` | 才能在瀏覽器端用 `import.meta.env.VITE_XXX` 讀取 |
| 開發用 `.env.local`（不加入 git） | 加入 `.gitignore` |
| 範例檔 `.env.example`（加入 git） | 只放 key 名稱，不放實際值 |

---

## 計畫歸檔流程

### 1. 計畫檔案命名格式

```
YYYY-MM-DD-<feature-name>.md
```

範例：`2026-05-15-add-tpex-support.md`

### 2. 計畫文件結構

```markdown
# YYYY-MM-DD <Feature Name>

## User Story
身為 <角色>，我希望 <功能>，以便 <目的>。

## Spec
- 行為描述 1
- 行為描述 2

## Tasks
- [ ] 建立 src/services/tpexApi.js
- [ ] 修改 vite.config.js 新增 proxy
- [ ] 修改 App.jsx 使用 Promise.allSettled
- [ ] 新增 market badge UI
```

### 3. 功能完成後

1. 將計畫檔案從 `docs/plans/` 移至 `docs/plans/archive/`
2. 更新 `docs/FEATURES.md`（新增功能條目、標記完成狀態）
3. 更新 `docs/CHANGELOG.md`（記錄版本與變更摘要）
4. 更新 `CLAUDE.md` 如架構有重大變化
