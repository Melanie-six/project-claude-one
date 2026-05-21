import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { quarterlyData, fxSensitivity } from '../../data/tsmc'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}：{p.value != null ? p.value.toFixed(2) : '—'}
        </p>
      ))}
    </div>
  )
}

export default function ForexSection() {
  const chartData = quarterlyData.map(q => ({
    quarter: q.quarter,
    forexGuide: q.forexGuide,
    forexActual: q.forexActual,
  }))

  return (
    <section className="analysis-section">
      <h2 className="analysis-section-title">匯率：法說指引假設 vs 實際（TWD / USD）</h2>
      <p className="analysis-section-desc">
        台積電每季法說會會給出下季匯率假設（虛線），實際匯率（實線）偏離假設時直接影響毛利率。
        數字越低代表台幣越強（升值）；每升值 1% 約壓縮毛利率 40–50 基點。
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
          <YAxis domain={[28, 34]} tick={{ fontSize: 11 }} tickFormatter={v => v.toFixed(0)} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            dataKey="forexGuide"
            name="法說指引假設"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ r: 4 }}
            connectNulls={false}
          />
          <Line
            dataKey="forexActual"
            name="當季均價（估計）"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 4 }}
            connectNulls={false}
          />
          <ReferenceLine y={32} stroke="#94a3b8" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>

      <table className="analysis-table">
        <thead>
          <tr>
            <th>季度</th>
            <th>指引假設（TWD/USD）</th>
            <th>實際均價</th>
            <th>台幣走勢</th>
            <th>對毛利率影響</th>
          </tr>
        </thead>
        <tbody>
          {quarterlyData.map(q => {
            const guide = q.forexGuide
            const actual = q.forexActual
            const diff = guide != null && actual != null ? actual - guide : null
            // TWD appreciation = actual < guide = negative diff
            const twdStrong = diff != null && diff < 0
            const twdWeak   = diff != null && diff > 0
            const pctChg    = guide != null && actual != null
              ? ((actual - guide) / guide * 100).toFixed(1)
              : null
            // ~40-50bp per 1% TWD appreciation
            const gmImpact  = pctChg != null
              ? `約 ${(parseFloat(pctChg) * -0.45).toFixed(1)}pp`
              : '—'
            return (
              <tr key={q.quarter}>
                <td>{q.quarter}</td>
                <td>{guide != null ? guide.toFixed(1) : '—'}</td>
                <td>{actual != null ? actual.toFixed(2) : '—'}</td>
                <td className={twdStrong ? 'miss' : twdWeak ? 'beat' : ''}>
                  {pctChg != null
                    ? `台幣${twdStrong ? '升值' : twdWeak ? '貶值' : '持平'} ${Math.abs(parseFloat(pctChg))}%`
                    : '—'}
                </td>
                <td className={twdStrong ? 'miss' : twdWeak ? 'beat' : ''}>
                  {pctChg != null ? gmImpact : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="analysis-note">
        ※ {fxSensitivity.rule}（{fxSensitivity.source}）
      </p>
      <p className="analysis-note">
        ※ 表中「對毛利率影響」為依匯率變動幅度與 40–50bp 規則計算的估算值，並非台積電官方公布數字。
      </p>
    </section>
  )
}
