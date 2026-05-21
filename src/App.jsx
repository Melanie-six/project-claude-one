import { useState, useEffect, useMemo, useRef } from 'react'
import { fetchAllStocks } from './services/twseApi'
import { fetchTpexStocks } from './services/tpexApi'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import StockCard from './components/StockCard'
import './App.css'

export default function App() {
  const [allStocks, setAllStocks] = useState([])
  const [loadState, setLoadState] = useState('loading') // 'loading' | 'ready' | 'partial' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [partialMsg, setPartialMsg] = useState('')
  const [fetchedAt, setFetchedAt] = useState(null)
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const wrapperRef = useRef(null)

  function applyResults([twse, tpex]) {
    const combined = [
      ...(twse.status === 'fulfilled' ? twse.value : []),
      ...(tpex.status === 'fulfilled' ? tpex.value : []),
    ]
    setAllStocks(combined)
    setFetchedAt(new Date())
    if (twse.status === 'rejected' && tpex.status === 'rejected') {
      setLoadState('error')
      setErrorMsg('上市與上櫃資料均無法取得')
    } else if (twse.status === 'rejected') {
      setLoadState('partial')
      setPartialMsg('上市資料載入失敗，目前僅顯示上櫃資料')
    } else if (tpex.status === 'rejected') {
      setLoadState('partial')
      setPartialMsg('上櫃資料載入失敗，目前僅顯示上市資料')
    } else {
      setLoadState('ready')
      setPartialMsg('')
    }
  }

  function loadStocks() {
    setLoadState('loading')
    Promise.allSettled([fetchAllStocks(), fetchTpexStocks()]).then(applyResults)
  }

  useEffect(() => {
    Promise.allSettled([fetchAllStocks(), fetchTpexStocks()]).then(applyResults)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allStocks
      .filter(s => s.Code.startsWith(q) || s.Name.toLowerCase().includes(q))
      .slice(0, 10)
  }, [query, allStocks])

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleQueryChange(val) {
    setQuery(val)
    setDropdownOpen(val.trim().length > 0)
  }

  function handleSelect(stock) {
    setSelected(stock)
    setQuery('')
    setDropdownOpen(false)
  }

  const showDropdown = dropdownOpen && results.length > 0

  const twseCount = allStocks.filter(s => s.market === 'TWSE').length
  const tpexCount = allStocks.filter(s => s.market === 'TPEX').length

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">台股查詢</h1>
        <p className="app-subtitle">輸入股票代碼或公司名稱，查詢最近交易日收盤資料</p>
        <div className="data-status">
          <span className="fetched-at">
            {fetchedAt
              ? `資料抓取時間：${fetchedAt.toLocaleString('zh-TW', { hour12: false })}`
              : loadState === 'loading' ? '資料載入中...' : ''}
          </span>
          {loadState === 'partial' && (
            <span className="partial-warning">{partialMsg}</span>
          )}
          <button
            className="refresh-btn"
            onClick={loadStocks}
            disabled={loadState === 'loading'}
          >
            {loadState === 'loading' ? '更新中...' : '重新整理資料'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="search-wrapper" ref={wrapperRef}>
          <SearchBar
            value={query}
            onChange={handleQueryChange}
            disabled={loadState === 'loading'}
            placeholder={loadState === 'loading' ? '資料載入中...' : '輸入代碼或名稱，如：2330 或 台積電'}
          />
          {showDropdown && <SearchResults results={results} onSelect={handleSelect} />}
        </div>

        {loadState === 'error' && (
          <div className="status-msg error">{errorMsg}</div>
        )}

        {selected && <StockCard stock={selected} onClose={() => setSelected(null)} />}

        {(loadState === 'ready' || loadState === 'partial') && !selected && (
          <p className="status-msg hint">
            已載入上市 {twseCount.toLocaleString('zh-TW')} 支、上櫃 {tpexCount.toLocaleString('zh-TW')} 支
          </p>
        )}
      </main>
    </div>
  )
}
