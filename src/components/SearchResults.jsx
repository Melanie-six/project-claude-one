export default function SearchResults({ results, onSelect }) {
  return (
    <ul className="search-results" role="listbox">
      {results.map(stock => (
        <li
          key={stock.Code}
          className="result-item"
          onClick={() => onSelect(stock)}
          role="option"
        >
          <span className="result-code">{stock.Code}</span>
          <span className="result-name">{stock.Name}</span>
          <span className={`market-badge market-${stock.market?.toLowerCase()}`}>
            {stock.market === 'TWSE' ? '上市' : '上櫃'}
          </span>
          <span className="result-price">{stock.ClosingPrice}</span>
        </li>
      ))}
    </ul>
  )
}
