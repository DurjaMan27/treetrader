import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ChangeStock from '../../components/ChangePortfolioStock';
import axios from 'axios';

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
        setCurrPrice(data.currPrice)
      }
  }

  useEffect(() => {
    findCurrPrice();
  }, [])

  useEffect(() => {
    if (currPrice !== 0) {
      const finalPrice = (currPrice * ticker.numShares) - ticker.priceInvested;
      if (finalPrice > 0) {
        setGainLoss(`+$${finalPrice.toString()}`)
        setColorGainLoss('green')
      } else if (finalPrice < 0) {
        setGainLoss(`-$${Math.abs(finalPrice).toString()}`)
        setColorGainLoss('red')
      } else {
        setGainLoss('+$0.00')
        setColorGainLoss('black')
      }
    }
  }, [currPrice])

  return (
    <>
      <Link to={`/stocks/details/${ticker.ticker}`}>
        <div className="main-information">
          <h1>{ ticker.ticker }</h1>
          <h2>Number of shares: { ticker.numShares }</h2>
          <h2>Date Purchased: { new Date(ticker.datePurchased).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'}) }</h2>
          <h3>Price When Purchased: { ticker.priceInvested }</h3>
        </div>
      </Link>
      <div>
        <h1 style={{ color: colorGainLoss }}>Total Gain/Loss: {gainLoss}</h1>
        <ChangeStock ticker={ticker.ticker} currShares={ticker.numShares} currPrice={currPrice} />
      </div>
    </>
  )
}

export default SingularStock;