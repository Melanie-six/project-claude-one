const BASE = '/tpex-api'

function normalize(item) {
  return {
    Code: item.SecuritiesCompanyCode ?? '',
    Name: item.CompanyName ?? '',
    ClosingPrice: item.Close ?? '--',
    OpeningPrice: item.Open ?? '--',
    HighestPrice: item.High ?? '--',
    LowestPrice: item.Low ?? '--',
    TradeVolume: item.TradingShares ?? '--',
    TradeValue: item.TransactionAmount ?? '--',
    Transaction: item.TransactionNumber ?? '--',
    Change: (item.Change ?? '--').trim(),
    market: 'TPEX',
  }
}

export async function fetchTpexStocks() {
  const res = await fetch(`${BASE}/tpex_mainboard_daily_close_quotes`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('目前無上櫃交易資料，可能為非交易日')
  return data
    .filter(item => item.SecuritiesCompanyCode && item.CompanyName)
    .map(normalize)
}
