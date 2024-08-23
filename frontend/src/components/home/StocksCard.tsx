import StockSingleCard from './StockSingleCard';
import './home.css';

const StocksCard = ({ stocks }) => {
  return (
    <div className='stocks'>
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