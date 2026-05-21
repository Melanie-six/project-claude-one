import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { capexData, capexGuidance } from '../../data/tsmc'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}：{p.value != null ? `$${p.value}B` : '—'}
        </p>
      ))}
    </div>
  )
}

const g2025 = capexGuidance[2025]
const g2026 = capexGuidance[2026]

export default function CapExSection() {
  return (
    <section className="analysis-section">
      <h2 className="analysis-section-title">資本支出（CapEx，USD billions）</h2>
      <p className="analysis-section-desc">
        台積電持續加大先進製程與海外廠投資。2024 全年實際 CapEx ${capexGuidance[2024].actual}B，
        2025 全年初始指引 ${g2025.guidanceLow}–${g2025.guidanceHigh}B（Q3 2025 後調整為 ${g2025.revisedLow}–${g2025.revisedHigh}B），
        實際 ${g2025.actual}B。2026 指引大幅上調至 ${g2026.guidanceLow}–${g2026.guidanceHigh}B。
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={capexData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}B`} domain={[0, 14]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="capex" name="季度 CapEx" fill="#6366f1" radius={[3, 3, 0, 0]} />
          <ReferenceLine
            y={10}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: '2025指引均值/季', fontSize: 10, fill: '#f59e0b', position: 'insideTopRight' }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <table className="analysis-table">
        <thead>
          <tr>
            <th>季度</th>
            <th>季度 CapEx</th>
            <th>備注</th>
          </tr>
        </thead>
        <tbody>
          {capexData.map(q => (
            <tr key={q.quarter}>
              <td>{q.quarter}</td>
              <td>{q.capex != null ? `$${q.capex}B` : '—'}</td>
              <td>{q.fullYearActual ? `全年實際 $${q.fullYearActual}B` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="analysis-table" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>年度</th>
            <th>初始指引</th>
            <th>修正後指引</th>
            <th>實際全年</th>
            <th>備注</th>
          </tr>
        </thead>
        <tbody>
          {[2024, 2025, 2026].map(yr => {
            const g = capexGuidance[yr]
            return (
              <tr key={yr}>
                <td>{yr}</td>
                <td>{`$${g.guidanceLow}–$${g.guidanceHigh}B`}</td>
                <td>{g.revisedLow != null ? `$${g.revisedLow}–$${g.revisedHigh}B` : '—'}</td>
                <td className={g.actual != null ? 'beat' : ''}>{g.actual != null ? `$${g.actual}B` : '進行中'}</td>
                <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{g.note}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
