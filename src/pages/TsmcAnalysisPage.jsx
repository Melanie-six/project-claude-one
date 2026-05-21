import GuidanceSection from '../components/analysis/GuidanceSection'
import ForexSection from '../components/analysis/ForexSection'
import ProcessMixSection from '../components/analysis/ProcessMixSection'
import CapExSection from '../components/analysis/CapExSection'

export default function TsmcAnalysisPage() {
  return (
    <div className="analysis-page">
      <header className="analysis-header">
        <div className="analysis-header-inner">
          <div>
            <h1 className="analysis-title">台積電（TSMC）個股分析</h1>
            <p className="analysis-subtitle">
              整合法說會財報指引與實際數字，追蹤 2024–2026 年關鍵營運指標
            </p>
          </div>
          <div className="analysis-meta">
            <span className="analysis-code">2330 / TSM</span>
            <span className="analysis-tag">上市</span>
          </div>
        </div>
      </header>

      <div className="analysis-body">
        <GuidanceSection />
        <ForexSection />
        <ProcessMixSection />
        <CapExSection />

        <p className="analysis-disclaimer">
          ※ 本頁資料整理自台積電公開法說會簡報與財報，僅供個人研究參考，不構成投資建議。
          標示「待補充」之欄位為知識截止日後的資料，請自行查閱最新官方公告。
        </p>
      </div>
    </div>
  )
}
