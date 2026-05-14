export default function SearchBar({ value, onChange, disabled, placeholder }) {
  return (
    <div className="search-bar">
      <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
      </svg>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="清除">✕</button>
      )}
    </div>
  )
}
