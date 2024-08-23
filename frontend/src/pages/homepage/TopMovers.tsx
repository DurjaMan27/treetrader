import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../components/context/UserContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './topmovers.css';

interface Stock {
  name: string,
  ticker: string,
  industry: string,
  currPrice: number,
  lastPrice: number
}

const TopMovers = () => {

  const staples = ["AMZN", "GOOGL", "NVDA", "AAPL", "MSFT", "TSLA", "NDAQ", "SPGI"];
  const [stapleStocks, setStapleStocks] = useState<Stock[]>([]);
  const [stapleChanges, setStapleChanges] = useState<string[]>([]);

  const findStaples = async () => {
    const response = await axios.get(`http://localhost:5555/stocks/setofTickers`, {
      params: {
        tickers: staples
      }
    });
    if (response && response.data) {
      console.log("dataaa");
      // console.log(response.list);
      setStapleStocks(response.data.list)
      let changes = [];
      for(let i = 0; i < 8; i++) {
        console.log(response.data.list[i].currPrice.toFixed(2));
        const difference = (response.data.list[i].currPrice - response.data.list[i].lastPrice).toFixed(2);
        console.log(typeof(difference));
        if (Number(difference) < 0) {
          changes.push(`-$${Math.abs(Number(difference))}`)
        } else {
          changes.push(`+$${Math.abs(Number(difference))}`)
        }
      }
      console.log("CHANGESSSS");
      console.log(changes);
      setStapleChanges(changes);
    }
  }

  useEffect(() => {
    findStaples();
  }, [])

  return (
    <>
      <div className="staples">
        <h1>The Big Branches</h1>
        { stapleStocks.length === 0 ? (
          <div className="message">
            <h1>Loading your stocks for you!</h1>
          </div>
        ) : (
          stapleStocks.map((staple, index) => (
            <div className={staple.currPrice < staple.lastPrice ? 'mover-singular-stock-red' : 'mover-singular-stock-green'}>
              <Link to={`stocks/details/${staple.ticker}`}>
                <h1 className="ticker-name">{ staple.ticker }</h1>
                <h1 className="price-difference" style={{ color: staple.currPrice < staple.lastPrice ? 'red' : 'green' }}>{ stapleChanges[index] }</h1>
                <h1>${ staple.currPrice }</h1>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default TopMovers;