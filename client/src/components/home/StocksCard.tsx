import StockSingleCard from './StockSingleCard';
import './homelayout.css';

const StocksCard = ({ stocks }) => {
  return (
    <div className={stocks.length === 0 ? 'stocks-message' : 'stocks'}>
      { stocks.length === 0 ? (
        <h1>No stocks match your search.</h1>
      ) : (
        stocks.map((stock) => (
          <StockSingleCard key={stock._id} stock={stock} />
        ))
      )}
    </div>
  )
}

export default StocksCard;