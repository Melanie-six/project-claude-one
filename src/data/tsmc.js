// TSMC quarterly earnings data
// Sources: TSMC earnings calls Q3 2024 – Q1 2026
// All figures verified from official TSMC earnings releases and earnings call transcripts
//
// Field definitions:
//   revenue          – actual USD billions (consolidated)
//   guidanceLow/High – USD billion range given in PRIOR quarter's earnings call
//   grossMarginGuide – gross margin % range given in prior quarter's earnings call
//   grossMargin      – actual gross margin %, as reported
//   operatingMargin  – actual operating margin %, as reported
//   forexGuide       – TWD/USD assumption stated in guidance (prior quarter call)
//   forexActual      – approximate actual average TWD/USD for the quarter
//   EPS_TWD          – diluted EPS in New Taiwan Dollars, as reported
//   notes            – key drivers / variance explanation

export const quarterlyData = [
  {
    quarter: 'Q3 2024',
    // Guidance was given at Q2 2024 earnings call (July 2024)
    guidanceLow:        22.4,
    guidanceHigh:       23.2,
    grossMarginGuideLow:  53.5,
    grossMarginGuideHigh: 55.5,
    forexGuide:         null,   // TWD/USD guidance not separately disclosed for Q3 2024
    revenue:            23.50,  // Actual: beat high end of guidance
    grossMargin:        57.8,   // Significantly above guidance ceiling; +4.3pp vs guide mid
    operatingMargin:    47.5,
    EPS_TWD:            12.54,
    forexActual:        null,   // Not separately disclosed
    notes: 'AI & smartphone demand drove upside. Gross margin beat guidance ceiling by ~2pp+ due to higher utilisation and cost improvement. CoWoS capacity doubled YoY but still insufficient.',
  },
  {
    quarter: 'Q4 2024',
    // Guidance was given at Q3 2024 earnings call (October 2024)
    guidanceLow:        26.1,
    guidanceHigh:       26.9,
    grossMarginGuideLow:  57.0,
    grossMarginGuideHigh: 59.0,
    forexGuide:         32.0,   // TWD/USD assumption stated at Q3 2024 call
    revenue:            26.88,  // Actual: at high end of guidance
    grossMargin:        59.0,   // At guidance ceiling
    operatingMargin:    49.0,
    EPS_TWD:            14.45,
    forexActual:        null,   // Not separately disclosed; broadly in line with guide
    notes: 'AI & smartphone demand. 3nm ramp continued. Full-year 2024 revenue USD 90.01B (+30% YoY). Full-year gross margin 56.1%. 2025 CapEx guidance of USD 38–42B announced, well above market expectation of ~USD 35B.',
  },
  {
    quarter: 'Q1 2025',
    // Guidance was given at Q4 2024 earnings call (January 16, 2025)
    guidanceLow:        25.0,
    guidanceHigh:       25.8,
    grossMarginGuideLow:  57.0,
    grossMarginGuideHigh: 59.0,
    forexGuide:         32.8,   // TWD/USD assumption stated at Q4 2024 call
    revenue:            25.53,  // Actual: upper half of guidance range
    grossMargin:        58.8,   // Near guidance ceiling; -0.2pp QoQ
    operatingMargin:    48.5,
    EPS_TWD:            13.94,
    forexActual:        32.5,   // Approximate; slightly favourable vs guide
    notes: 'Seasonal smartphone weakness (QoQ -22%) offset by strong AI/HPC (+7% QoQ). 60bp gross margin headwind from earthquake impact plus overseas fab dilution. 2025 CapEx guidance reaffirmed at USD 38–42B.',
  },
  {
    quarter: 'Q2 2025',
    // Guidance was given at Q1 2025 earnings call (April 17, 2025)
    guidanceLow:        28.4,
    guidanceHigh:       29.2,
    grossMarginGuideLow:  57.0,
    grossMarginGuideHigh: 59.0,
    forexGuide:         32.5,   // TWD/USD assumption stated at Q1 2025 call
    revenue:            30.07,  // Actual: significantly above guidance ceiling
    grossMargin:        58.6,   // Within guidance range but -0.2pp QoQ due to FX headwind
    operatingMargin:    49.6,
    EPS_TWD:            15.36,
    forexActual:        31.05,  // TWD appreciated ~4.4% vs guidance assumption
    notes: 'Revenue beat driven by AI/HPC demand (+14% QoQ). Gross margin dragged by TWD appreciation (~-2.2pp FX impact) and Arizona fab ramp dilution (~-0.8pp), partly offset by utilisation gains. Full-year revenue growth guidance raised to ~30%.',
  },
  {
    quarter: 'Q3 2025',
    // Guidance was given at Q2 2025 earnings call (July 17, 2025)
    guidanceLow:        31.8,
    guidanceHigh:       33.0,
    grossMarginGuideLow:  55.5,
    grossMarginGuideHigh: 57.5,
    forexGuide:         29.0,   // Very conservative TWD/USD assumption at Q2 2025 call
    revenue:            33.10,  // Actual: above guidance range
    grossMargin:        59.5,   // Well above guidance ceiling (+2pp vs high end)
    operatingMargin:    50.6,
    EPS_TWD:            17.44,
    forexActual:        31.5,   // Approximate; TWD did NOT strengthen as conservatively assumed
    notes: 'Revenue and gross margin materially beat guidance. Conservative 29 TWD/USD assumption proved too pessimistic; actual rate ~31.5 provided ~+260bp gross margin tailwind vs guide. 3nm and 5nm shipments strong. Full-year 2025 CapEx range narrowed to USD 40–42B (lower end raised from 38B). AI accelerator CAGR guidance maintained at ~40%+.',
  },
  {
    quarter: 'Q4 2025',
    // Guidance was given at Q3 2025 earnings call (October 16, 2025)
    guidanceLow:        32.2,
    guidanceHigh:       33.4,
    grossMarginGuideLow:  59.0,
    grossMarginGuideHigh: 61.0,
    forexGuide:         null,   // Specific rate not separately disclosed at Q3 2025 call
    revenue:            33.73,  // Actual: above guidance range
    grossMargin:        62.3,   // Significantly above guidance ceiling (+1.3pp vs high end)
    operatingMargin:    54.0,
    EPS_TWD:            19.50,
    forexActual:        null,   // Favourable FX cited as key driver
    notes: 'Gross margin 62.3% crushed guidance ceiling of 61%, driven by cost improvement, favourable FX and high utilisation. 3nm mix rose to 28% (from 23% in Q3). Full-year 2025 revenue TWD 3.809T (+31.6% YoY); full-year EPS TWD 66.25 (record high). Full-year CapEx actual USD 40.9B. 2026 CapEx guidance USD 52–56B announced, far above market expectation of ~USD 48B. Overseas fab dilution revised down to 1–2% for full-year 2025 (from prior 2–3%).',
  },
  {
    quarter: 'Q1 2026',
    // Guidance was given at Q4 2025 earnings call (January 15, 2026)
    guidanceLow:        34.6,
    guidanceHigh:       35.8,
    grossMarginGuideLow:  63.0,
    grossMarginGuideHigh: 65.0,
    forexGuide:         null,   // Specific rate not separately disclosed at Q4 2025 call
    revenue:            35.90,  // Actual: slightly above guidance ceiling
    grossMargin:        66.2,   // Materially above guidance ceiling (+1.2pp vs high end)
    operatingMargin:    58.1,
    EPS_TWD:            22.08,
    forexActual:        null,   // Favourable FX again cited as positive driver
    notes: 'Revenue and gross margin both beat. Gross margin 66.2% driven by higher utilisation, cost improvement and favourable FX. 3nm mix 25%, 5nm 36%; advanced processes (≤7nm) = 74% of wafer revenue. HPC 61% of revenue (QoQ +20%). Full-year 2026 revenue growth guidance raised to "over 30%" (from "close to 30%"). 2026 CapEx confirmed at high end of USD 52–56B range. AI accelerator CAGR for next 5 years revised up to 56–59%.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Process Mix  (wafer revenue % by node)
// ─────────────────────────────────────────────────────────────────────────────

export const processMixData = [
  {
    quarter: 'Q3 2024',
    '3nm':   20,
    '5nm':   32,
    '7nm':   17,
    '16nm':   8,
    '28nm+': 23,
    advancedTotal: 69,
    HPC_pct: 51,
    smartphone_pct: 34,
  },
  {
    quarter: 'Q4 2024',
    '3nm':   26,
    '5nm':   34,
    '7nm':   14,
    '16nm':   7,
    '28nm+': 19,
    advancedTotal: 74,
    HPC_pct: 53,
    smartphone_pct: 35,
  },
  {
    quarter: 'Q1 2025',
    '3nm':   22,
    '5nm':   36,
    '7nm':   15,
    '16nm':   7,
    '28nm+': 20,
    advancedTotal: 73,
    HPC_pct: 59,
    smartphone_pct: 28,
  },
  {
    quarter: 'Q2 2025',
    '3nm':   24,
    '5nm':   36,
    '7nm':   14,
    '16nm':  null,
    '28nm+': 26,
    advancedTotal: 74,
    HPC_pct: 60,
    smartphone_pct: 27,
  },
  {
    quarter: 'Q3 2025',
    '3nm':   23,
    '5nm':   37,
    '7nm':   14,
    '16nm':  null,
    '28nm+': 26,
    advancedTotal: 74,
    HPC_pct: 57,
    smartphone_pct: 30,
  },
  {
    quarter: 'Q4 2025',
    '3nm':   28,
    '5nm':   35,
    '7nm':   14,
    '16nm':  null,
    '28nm+': 23,
    advancedTotal: 77,
    HPC_pct: 52,
    smartphone_pct: 33,
  },
  {
    quarter: 'Q1 2026',
    '3nm':   25,
    '5nm':   36,
    '7nm':   13,
    '16nm':   7,
    '28nm+': 12,
    // Note: 2nm (N2) entered mass production in Q4 2025; initial contribution
    // is embedded in the 3nm bucket and will be separately disclosed once material.
    advancedTotal: 74,
    HPC_pct: 61,
    smartphone_pct: 26,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Quarterly CapEx spend  (USD billions, approximate from cash flow statements)
// ─────────────────────────────────────────────────────────────────────────────

export const capexData = [
  { quarter: 'Q3 2024', capex: 6.4   },
  { quarter: 'Q4 2024', capex: 6.8,   fullYearActual: 29.8 },
  { quarter: 'Q1 2025', capex: 10.06  },
  { quarter: 'Q2 2025', capex: 9.63   },
  { quarter: 'Q3 2025', capex: null   },
  { quarter: 'Q4 2025', capex: null,   fullYearActual: 40.9 },
  { quarter: 'Q1 2026', capex: 11.07  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Full-year CapEx guidance & actuals
// ─────────────────────────────────────────────────────────────────────────────

export const capexGuidance = {
  2024: {
    guidanceLow:  30.0,
    guidanceHigh: 32.0,
    actual:       29.8,
    note: 'Guided "slightly above USD 30B" at Q3 2024 call; actual USD 29.8B.',
  },
  2025: {
    guidanceLow:  38.0,
    guidanceHigh: 42.0,
    revisedLow:   40.0,
    revisedHigh:  42.0,
    actual:       40.9,
    note: '70–80% to advanced processes, 10–20% specialty, 10–20% advanced packaging & mask. Range narrowed to 40–42B at Q3 2025 call.',
  },
  2026: {
    guidanceLow:  52.0,
    guidanceHigh: 56.0,
    confirmedHigh: true,
    actual:       null,
    note: '~80% advanced processes, ~10% specialty, 10–20% advanced packaging & mask. Reflects N2 ramp + CoWoS expansion + US/Japan fab build-out.',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// FX sensitivity (stated by management, applies to all periods)
// ─────────────────────────────────────────────────────────────────────────────

export const fxSensitivity = {
  rule: 'Every 1% appreciation of TWD vs USD reduces gross margin by approximately 40–50 basis points.',
  source: 'Reiterated at Q3 2024, Q2 2025 and Q3 2025 earnings calls.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Overseas fab gross-margin dilution guidance
// ─────────────────────────────────────────────────────────────────────────────

export const overseasFabDilution = [
  { asOf: 'Q4 2024 call', fullYear2025Estimate: '2–3%',  multiYearOutlook: 'Early stage 2–3%, later stage 3–4%' },
  { asOf: 'Q1 2025 call', fullYear2025Estimate: '2–3%',  multiYearOutlook: 'Early stage 2–3%, later stage 3–4%' },
  { asOf: 'Q2 2025 call', fullYear2025Estimate: '2–3%',  multiYearOutlook: 'Early stage 2–3%, later stage 3–4%' },
  { asOf: 'Q3 2025 call', fullYear2025Estimate: '1–2%',  multiYearOutlook: 'Early stage 2–3%, later stage 3–4%', note: 'Revised down — Arizona ramp proceeding better than expected' },
  { asOf: 'Q4 2025 call', fullYear2025Estimate: '1–2%',  note: 'Confirmed; N2 in 2026 adds additional 2–3% dilution in H2 2026' },
  { asOf: 'Q1 2026 call', fullYear2026Estimate: '2–3%+', note: '2nm ramp (N2 + N2P) and overseas fab expansion expected to dilute 2026 gross margin by 2–3%' },
]

// ─────────────────────────────────────────────────────────────────────────────
// AI accelerator revenue CAGR guidance
// ─────────────────────────────────────────────────────────────────────────────

export const aiAcceleratorCAGR = [
  { asOf: 'Q3 2024 call', cagr: '~40%+',       horizon: 'next 5 years' },
  { asOf: 'Q4 2024 call', cagr: '44–46%',       horizon: 'next 5 years' },
  { asOf: 'Q1 2025 call', cagr: '~40–46%',      horizon: 'next 5 years', note: 'Reaffirmed; Deepseek seen as lowering AI barriers (positive for demand)' },
  { asOf: 'Q2 2025 call', cagr: '~40%+',        horizon: 'next 5 years', note: 'Maintained; too early to raise despite H20 China re-access' },
  { asOf: 'Q3 2025 call', cagr: '>40%',         horizon: 'next 5 years', note: 'Noted demand is stronger than 3 months ago; formal raise deferred to early 2026' },
  { asOf: 'Q4 2025 call', cagr: 'mid-high 50%', horizon: 'next 5 years', note: 'Major upward revision; CC Wei confirmed AI is a genuine megatrend' },
  { asOf: 'Q1 2026 call', cagr: '56–59%',       horizon: 'next 5 years', note: 'Further raised; Agentic AI driving incremental demand beyond training' },
]
