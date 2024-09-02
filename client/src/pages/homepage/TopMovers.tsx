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
    const response = await axios.get(`http://treetrader.vercel.app/stocks/setofTickers`, {
      params: {
        tickers: staples
      }
    });
    if (response && response.data) {
      setStapleStocks(response.data.list)
      let changes = [];
      for(let i = 0; i < 8; i++) {
        const difference = (response.data.list[i].currPrice - response.data.list[i].lastPrice).toFixed(2);
        if (Number(difference) < 0) {
          changes.push(`-$${Math.abs(Number(difference)).toFixed(2)}`)
        } else {
          changes.push(`+$${Math.abs(Number(difference)).toFixed(2)}`)
        }
      }
      setStapleChanges(changes);
    }
  }

  useEffect(() => {
    findStaples();
  }, [])

  return (
    <>
      <div className="staples">
        <h2 className='big-branch-title'>The Big Branches</h2>
        { stapleStocks.length === 0 ? (
          <div className="message">
            <h1>Loading your stocks for you!</h1>
          </div>
        ) : (
          stapleStocks.map((staple, index) => (
            <Link to={`stocks/details/${staple.ticker}`}>
              <div className={staple.currPrice < staple.lastPrice ? 'mover-singular-stock-red' : 'mover-singular-stock-green'}>
                <h1 className="ticker-name">{ staple.ticker }</h1>
                <div className='price-values'>
                  <h1 className="price-difference" style={{ color: staple.currPrice < staple.lastPrice ? 'red' : 'green' }}>{ stapleChanges[index] }</h1>
                  <h2 className="current-price-moving">${ staple.currPrice.toFixed(2) }</h2>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}

export default TopMovers;