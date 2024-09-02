import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css';

import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

import StocksCard from '../components/home/StocksCard';
import StocksTable from '../components/home/StocksTable';
import TopMovers from './homepage/TopMovers';

const Home = () => {

  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('card');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://treetrader.vercel.app/stocks')
      .then((response) => {
        setStocks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
    })
  }, [])

  useEffect(() => {
    if (filterValue === "") {
      setFilteredStocks([]);
    } else {
      const lowercasedFilter = filterValue.toLowerCase();
      const filteredData = stocks.filter((stock) =>
          stock.name.toLowerCase().includes(lowercasedFilter) ||
          stock.ticker.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredStocks(filteredData);
    }
  }, [filterValue])

  return (
    <div className="home-body-section">
      <div className="top-movers">
        <TopMovers />
      </div>
      <div className="all-stocks-section">
        <div className="top-level">
          <div className="title">
            <h1 className='title-text'>Stocks Database</h1>
          </div>
          <div className="filter-bar">
            <input
              type="string"
              value={filterValue}
              placeholder="Filter by company name or stock ticker"
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
        <div className='all-stocks-grid'>
          { loading ? <Spinner /> : filterValue === '' ? ( <StocksCard stocks={stocks} /> ) : ( <StocksCard stocks={filteredStocks} /> ) }
        </div>
      </div>
    </div>
  )
}

export default Home;