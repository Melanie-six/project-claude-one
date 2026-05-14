import { useState, useEffect, useMemo, useRef } from 'react'
import { fetchAllStocks } from './services/twseApi'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import StockCard from './components/StockCard'
import './App.css'

export default function App() {
  const [allStocks, setAllStocks] = useState([])
  const [loadState, setLoadState] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    fetchAllStocks()
      .then(data => {
        setAllStocks(data)
        setLoadState('ready')
      })
      .catch(err => {
        setErrorMsg(err.message)
        setLoadState('error')
      })
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

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">台股查詢</h1>
        <p className="app-subtitle">輸入股票代碼或公司名稱，查詢最近交易日收盤資料</p>
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

        {loadState === 'ready' && !selected && (
          <p className="status-msg hint">已載入 {allStocks.length.toLocaleString('zh-TW')} 支上市股票</p>
        )}
      </main>
    </div>
  )
}
