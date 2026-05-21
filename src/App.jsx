import { Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TsmcAnalysisPage from './pages/TsmcAnalysisPage'
import './App.css'

export default function App() {
  return (
    <>
      <nav className="site-nav">
        <div className="site-nav-inner">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            台股查詢
          </NavLink>
          <NavLink to="/analysis/tsmc" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            台積電分析
          </NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis/tsmc" element={<TsmcAnalysisPage />} />
      </Routes>
    </>
  )
}
