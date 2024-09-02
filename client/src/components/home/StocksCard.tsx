import StockSingleCard from './StockSingleCard';
import './homelayout.css';

interface StockListDataStructure {
  stocks: StockSingleDataStructure[],
}

interface StockSingleDataStructure {
  name: string,
  ticker: string,
  currPrice: number,
  lastPrice: number,
  industry: string,
  createdAt: Date,
  updatedAt: Date,
}

const StocksCard: React.FC<StockListDataStructure> = ({ stocks }) => {
  return (
    <div className={stocks.length === 0 ? 'stocks-message' : 'stocks'}>
      { stocks.length === 0 ? (
        <h1>No stocks match your search.</h1>
      ) : (
        stocks.map((stock) => (
          <StockSingleCard key={stock.name} stock={stock} />
        ))
      )}
    </div>
  )
}

export default StocksCard;