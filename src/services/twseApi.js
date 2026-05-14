const BASE = '/twse-api'

export async function fetchAllStocks() {
  const res = await fetch(`${BASE}/exchangeReport/STOCK_DAY_ALL`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('目前無交易資料，可能為非交易日')
  return data
}
