import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { processMixData } from '../../data/tsmc'

const COLORS = {
  '3nm':   '#3b82f6',
  '5nm':   '#10b981',
  '7nm':   '#f59e0b',
  '16nm':  '#a78bfa',
  '28nm+': '#94a3b8',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}：{p.value != null && p.value > 0 ? `${p.value}%` : '—'}
        </p>
      ))}
    </div>
  )
}

// Replace null with 0 for stacked bar rendering; null would break the stack
function toChartRow(q) {
  return {
    quarter:  q.quarter,
    '3nm':    q['3nm']   ?? 0,
    '5nm':    q['5nm']   ?? 0,
    '7nm':    q['7nm']   ?? 0,
    '16nm':   q['16nm']  ?? 0,
    '28nm+':  q['28nm+'] ?? 0,
  }
}

export default function ProcessMixSection() {
  const chartData = processMixData.map(toChartRow)

  return (
    <section className="analysis-section">
      <h2 className="analysis-section-title">先進製程收入佔比</h2>
      <p className="analysis-section-desc">
        各季晶圓收入中各製程節點的貢獻比例。3nm + 5nm + 7nm 合計為先進製程（≤7nm）佔比。
        HPC 應用佔比同步呈現，反映 AI/高效能運算需求驅動製程升級。
      </p>
      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="3nm"   name="3nm"   stackId="a" fill={COLORS['3nm']}   />
          <Bar dataKey="5nm"   name="5nm"   stackId="a" fill={COLORS['5nm']}   />
          <Bar dataKey="7nm"   name="7nm"   stackId="a" fill={COLORS['7nm']}   />
          <Bar dataKey="16nm"  name="16nm"  stackId="a" fill={COLORS['16nm']}  />
          <Bar dataKey="28nm+" name="28nm+" stackId="a" fill={COLORS['28nm+']} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <table className="analysis-table">
        <thead>
          <tr>
            <th>季度</th>
            <th>3nm</th>
            <th>5nm</th>
            <th>7nm</th>
            <th>16nm</th>
            <th>28nm+</th>
            <th>≤7nm 合計</th>
            <th>HPC%</th>
            <th>手機%</th>
          </tr>
        </thead>
        <tbody>
          {processMixData.map(q => (
            <tr key={q.quarter}>
              <td>{q.quarter}</td>
              <td>{q['3nm']   != null ? `${q['3nm']}%`   : '—'}</td>
              <td>{q['5nm']   != null ? `${q['5nm']}%`   : '—'}</td>
              <td>{q['7nm']   != null ? `${q['7nm']}%`   : '—'}</td>
              <td>{q['16nm']  != null ? `${q['16nm']}%`  : '—'}</td>
              <td>{q['28nm+'] != null ? `${q['28nm+']}%` : '—'}</td>
              <td className="beat">{q.advancedTotal != null ? `${q.advancedTotal}%` : '—'}</td>
              <td>{q.HPC_pct       != null ? `${q.HPC_pct}%`       : '—'}</td>
              <td>{q.smartphone_pct != null ? `${q.smartphone_pct}%` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="analysis-note">
        ※ Q2–Q4 2025 的 16nm 欄位未於法說會單獨揭露，數值已併入 28nm+ 欄。
        Q1 2026 起 2nm（N2）已量產，初期貢獻暫計入 3nm bucket，待比重重大後將單獨揭露。
      </p>
    </section>
  )
}
