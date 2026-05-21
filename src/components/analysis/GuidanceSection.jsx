import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { quarterlyData } from '../../data/tsmc'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}：{p.value != null ? p.value : '—'}
        </p>
      ))}
    </div>
  )
}

export default function GuidanceSection() {
  const chartData = quarterlyData.map(q => ({
    quarter: q.quarter,
    actual: q.revenue,
    guidanceMid: q.guidanceLow != null
      ? +((q.guidanceLow + q.guidanceHigh) / 2).toFixed(1)
      : null,
    grossMargin: q.grossMargin,
    gmGuideMid: q.grossMarginGuideLow != null
      ? +((q.grossMarginGuideLow + q.grossMarginGuideHigh) / 2).toFixed(1)
      : null,
  }))

  return (
    <section className="analysis-section">
      <h2 className="analysis-section-title">營收展望 vs 實際（USD billions）</h2>
      <p className="analysis-section-desc">
        每季法說會公布的下季營收指引（中值）與實際公布數字的比較。柱狀為實際營收，折線為指引中值；右軸追蹤毛利率實際值與指引中值。
      </p>
      <ResponsiveContainer width="100%" height={290}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
          <YAxis
            yAxisId="rev"
            domain={[20, 40]}
            tick={{ fontSize: 11 }}
            tickFormatter={v => `$${v}B`}
          />
          <YAxis
            yAxisId="gm"
            orientation="right"
            domain={[50, 70]}
            tick={{ fontSize: 11 }}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="rev" dataKey="actual" name="實際營收 $B" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          <Line yAxisId="rev" dataKey="guidanceMid" name="指引中值 $B" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />
          <Line yAxisId="gm" dataKey="grossMargin" name="實際毛利率%" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />
          <Line yAxisId="gm" dataKey="gmGuideMid" name="毛利率指引中值%" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 3" dot={false} connectNulls={false} />
        </ComposedChart>
      </ResponsiveContainer>

      <table className="analysis-table">
        <thead>
          <tr>
            <th>季度</th>
            <th>營收指引（$B）</th>
            <th>實際營收（$B）</th>
            <th>超出指引</th>
            <th>毛利率指引</th>
            <th>實際毛利率</th>
            <th>EPS（TWD）</th>
          </tr>
        </thead>
        <tbody>
          {quarterlyData.map(q => {
            const mid = q.guidanceLow != null ? (q.guidanceLow + q.guidanceHigh) / 2 : null
            const diff = q.revenue != null && mid != null
              ? (q.revenue - mid).toFixed(2)
              : null
            const diffNum = diff != null ? parseFloat(diff) : null
            const gmGuide = q.grossMarginGuideLow != null
              ? `${q.grossMarginGuideLow}–${q.grossMarginGuideHigh}%`
              : '—'
            return (
              <tr key={q.quarter}>
                <td>{q.quarter}</td>
                <td>{q.guidanceLow != null ? `$${q.guidanceLow}–$${q.guidanceHigh}` : '—'}</td>
                <td>{q.revenue != null ? `$${q.revenue.toFixed(2)}` : '—'}</td>
                <td className={diffNum > 0 ? 'beat' : diffNum < 0 ? 'miss' : ''}>
                  {diff != null ? `${diffNum > 0 ? '+' : ''}$${diff}` : '—'}
                </td>
                <td>{gmGuide}</td>
                <td>{q.grossMargin != null ? `${q.grossMargin}%` : '—'}</td>
                <td>{q.EPS_TWD != null ? q.EPS_TWD.toFixed(2) : '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
