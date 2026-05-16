# 測試規範與指南

## 目前狀態

**目前專案無任何測試檔案，也未安裝測試框架。**

`package.json` 的 `scripts` 無 `test` 指令。Vite 預設不包含測試工具。

---

## 建議的測試框架設定

若要新增測試，建議使用 **Vitest + @testing-library/react**，與 Vite 生態無縫整合：

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

在 `vite.config.js` 加入：

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
  // ...現有 proxy 設定
})
```

建立 `src/test/setup.js`：

```javascript
import '@testing-library/jest-dom'
```

在 `package.json` 加入：

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

---

## 測試策略

### 優先測試的項目

依照影響層面排序：

**高優先：**

1. **`twseApi.js` — fetchAllStocks()**
   - 成功路徑：回傳非空陣列時 resolve
   - `res.ok === false` 時 throw Error（含 HTTP 狀態碼）
   - 回傳空陣列時 throw `'目前無交易資料，可能為非交易日'`

2. **`StockCard.jsx` — 格式化函式**
   - `fmtPrice('900.00')` → `'900.00'`
   - `fmtPrice('--')` → `'--'`
   - `fmtPrice(undefined)` → `'--'`
   - `fmtVolume('35678000')` → `'35,678'`（除以 1000）
   - `fmtValue('32145678900')` → `'321.46 億'`
   - `fmtValue('500000000')` → `'5.00 億'`（邊界：剛好 1 億）
   - `fmtValue('9999999')` → `'999 萬'`（<1 億）
   - `fmtCount('45678')` → `'45,678'`

3. **搜尋過濾邏輯（`useMemo` 在 App.jsx）**
   - `"2330"` 對 Code `"2330"` → 匹配
   - `"23"` 對 Code `"2330"` → 匹配（startsWith）
   - `"台積"` 對 Name `"台積電"` → 匹配（includes）
   - 空字串 → 回傳空陣列
   - 結果超過 10 筆時截斷為 10 筆

**中優先：**

4. **StockCard 漲跌顏色**
   - `Change > 0` → `.up` class
   - `Change < 0` → `.down` class
   - `Change === '0.00'` → `.flat` class
   - `Change === '--'` → `.flat` class（NaN 判斷）

5. **SearchBar 互動**
   - 輸入觸發 `onChange`
   - 點擊清除按鈕呼叫 `onChange('')`
   - `disabled` 時輸入框不可輸入

---

## 撰寫新測試的步驟

### Service 函式測試範例（fetchAllStocks）

```javascript
// src/test/twseApi.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchAllStocks } from '../services/twseApi'

describe('fetchAllStocks', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('成功時回傳股票陣列', async () => {
    const mockData = [{ Code: '2330', Name: '台積電', ClosingPrice: '900.00' }]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })
    const result = await fetchAllStocks()
    expect(result).toEqual(mockData)
  })

  it('HTTP 錯誤時拋出含狀態碼的 Error', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 })
    await expect(fetchAllStocks()).rejects.toThrow('HTTP 503')
  })

  it('回傳空陣列時拋出非交易日提示', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    await expect(fetchAllStocks()).rejects.toThrow('目前無交易資料')
  })
})
```

### 元件測試範例（StockCard）

```javascript
// src/test/StockCard.test.jsx
import { render, screen } from '@testing-library/react'
import StockCard from '../components/StockCard'

const mockStock = {
  Code: '2330',
  Name: '台積電',
  ClosingPrice: '900.00',
  Change: '5.00',
  OpeningPrice: '895.00',
  HighestPrice: '903.00',
  LowestPrice: '892.00',
  TradeVolume: '35678000',
  TradeValue: '32145678900',
  Transaction: '45678',
}

it('顯示股票代碼與名稱', () => {
  render(<StockCard stock={mockStock} onClose={() => {}} />)
  expect(screen.getByText('2330')).toBeInTheDocument()
  expect(screen.getByText('台積電')).toBeInTheDocument()
})

it('Change > 0 時套用 up class', () => {
  const { container } = render(<StockCard stock={mockStock} onClose={() => {}} />)
  expect(container.querySelector('.closing-price')).toHaveClass('up')
})
```

---

## 常見陷阱

| 陷阱 | 說明 | 解法 |
|------|------|------|
| StrictMode 雙重執行 | React StrictMode 在開發時 effect 執行兩次，fetch mock 可能被呼叫兩次 | 用 `vi.clearAllMocks()` 在 `beforeEach` 重置 |
| `fetch` 不是全域 | Vitest jsdom 環境不一定有 `fetch` | `global.fetch = vi.fn(...)` 或安裝 `whatwg-fetch` |
| 非同步測試未等待 | 遺漏 `await` 或 `waitFor` | 搭配 `@testing-library/user-event` 的非同步 API |
