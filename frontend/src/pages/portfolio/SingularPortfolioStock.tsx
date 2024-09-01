import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ChangeStock from './ChangePortfolioStock';
import axios from 'axios';
import './portfolio.css';

interface StockProps {
  ticker: {
    ticker: string,
    numShares: number,
    datePurchased: Date,
    priceInvested: number,
  }
}

const SingularStock:  React.FC<StockProps> = ({ ticker }) => {

  const [currPrice, setCurrPrice] = useState(0);
  const [gainLoss, setGainLoss] = useState("");
  const [colorGainLoss, setColorGainLoss] = useState('black')


  const findCurrPrice = async () => {
    const response = await axios.get(`http://localhost:5555/stocks/ticker/${ticker.ticker}`);
      if (response && response.data) {
        const { data } = response;
        setCurrPrice(data.stock.currPrice)
      }
  }

  useEffect(() => {
    findCurrPrice();
  }, [])

  useEffect(() => {
    if (currPrice !== 0) {
      const finalPrice = (currPrice * ticker.numShares) - ticker.priceInvested;
      if (finalPrice < 0) {
        setGainLoss(`-$${Math.abs(finalPrice).toFixed(2).toString()}`)
        setColorGainLoss('red')
      } else {
        setGainLoss(`+$${finalPrice.toFixed(2).toString()}`)
        setColorGainLoss('green')
      }
    }
  }, [currPrice])

  return (
    <div className='singular-portfolio-stock'>
      <Link to={`/stocks/details/${ticker.ticker}`}>
        <div className="main-information">
          <div className='left-section'>
            <h1 className='portfolio-ticker-name'>{ ticker.ticker }</h1>
            <h2 className='date-purchased'>(Purchased { new Date(ticker.datePurchased).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) })</h2>
          </div>
          <div className='right-section'>
            <h3 className='portfolio-num-shares'># of shares: { ticker.numShares }</h3>
            <h3>Total Investment: ${ ticker.priceInvested.toFixed(2) }</h3>
            <div className={colorGainLoss === 'red' ? 'gain-loss-negative' : 'gain-loss-positive'}>
              <h1 style={{ color: colorGainLoss }}>Total Gain/Loss: {gainLoss}</h1>
            </div>
          </div>
        </div>
      </Link>
      <div className='buy-or-sell-buttons-section'>
        <ChangeStock ticker={ticker.ticker} currShares={ticker.numShares} currPrice={currPrice} />
      </div>
    </div>
  )
}

export default SingularStock;