import StockSingleCard from './StockSingleCard';

const StocksCard = ({ stocks }) => {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      { stocks.map((stock) => (
        <StockSingleCard key={stock._id} stock={stock} />
      ))}
    </div>
  )
}

export default StocksCard;