function toNum(val) {
  return parseFloat(val)
}

function fmtPrice(val) {
  const n = toNum(val)
  return isNaN(n) ? (val || '--') : n.toFixed(2)
}

function fmtVolume(val) {
  // TradeVolume 單位為股，除以 1000 轉換為張
  const n = parseInt(val, 10)
  if (isNaN(n)) return '--'
  return (n / 1000).toLocaleString('zh-TW', { maximumFractionDigits: 0 })
}

function fmtValue(val) {
  // TradeValue 單位為元，轉換為億元
  const n = parseInt(val, 10)
  if (isNaN(n)) return '--'
  const yi = n / 100000000
  return yi >= 1
    ? yi.toLocaleString('zh-TW', { maximumFractionDigits: 2 }) + ' 億'
    : (n / 10000).toLocaleString('zh-TW', { maximumFractionDigits: 0 }) + ' 萬'
}

function fmtCount(val) {
  const n = parseInt(val, 10)
  if (isNaN(n)) return '--'
  return n.toLocaleString('zh-TW')
}

export default function StockCard({ stock, onClose }) {
  const changeNum = toNum(stock.Change)
  const closingNum = toNum(stock.ClosingPrice)
  const isUp = !isNaN(changeNum) && changeNum > 0
  const isDown = !isNaN(changeNum) && changeNum < 0
  const changeClass = isUp ? 'up' : isDown ? 'down' : 'flat'

  const prevClose = !isNaN(changeNum) && !isNaN(closingNum) ? closingNum - changeNum : null
  const pct = prevClose && prevClose !== 0
    ? ((changeNum / prevClose) * 100).toFixed(2)
    : null

  const changeLabel = isNaN(changeNum)
    ? (stock.Change || '--')
    : `${isUp ? '+' : ''}${fmtPrice(stock.Change)}${pct ? ` (${isUp ? '+' : ''}${pct}%)` : ''}`

  return (
    <div className="stock-card">
      <div className="card-header">
        <div className="card-title">
          <span className="stock-code">{stock.Code}</span>
          <span className="stock-name">{stock.Name}</span>
          <span className={`market-badge market-${stock.market?.toLowerCase()}`}>
            {stock.market === 'TWSE' ? '上市' : '上櫃'}
          </span>
        </div>
        <button className="card-close" onClick={onClose} aria-label="關閉">✕</button>
      </div>

      <div className="price-section">
        <span className={`closing-price ${changeClass}`}>{fmtPrice(stock.ClosingPrice)}</span>
        <span className={`change-badge ${changeClass}`}>{changeLabel}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">開盤價</span>
          <span className="stat-value">{fmtPrice(stock.OpeningPrice)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最高價</span>
          <span className="stat-value up">{fmtPrice(stock.HighestPrice)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最低價</span>
          <span className="stat-value down">{fmtPrice(stock.LowestPrice)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">成交量</span>
          <span className="stat-value">{fmtVolume(stock.TradeVolume)} 張</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">成交金額</span>
          <span className="stat-value">{fmtValue(stock.TradeValue)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">成交筆數</span>
          <span className="stat-value">{fmtCount(stock.Transaction)}</span>
        </div>
      </div>

      <p className="card-note">
        資料來源：{stock.market === 'TPEX' ? '櫃買中心（OTC）' : '台灣證券交易所'}｜最近交易日收盤資料
      </p>
    </div>
  )
}
