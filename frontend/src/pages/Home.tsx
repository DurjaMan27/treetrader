import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      .get('http://localhost:5555/stocks')
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
    <div>
      <div className="top-movers">
        <TopMovers />
      </div>
      <div className="filter-bar">
        <input
          type="string"
          value={filterValue}
          placeholder="Filter by company name or stock ticker"
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>
      <div className="p-4">
        <div className='flex justify-center items-center gap-x-4'>
          <button
            className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
            onClick={() => setShowType('card')}
          >
            Card
          </button>
        </div>
        <div className="flex justify-between items-center">
          <h1 className='text-3xl my-8'>Stocks List</h1>
          <Link to='/stocks/create'>
            <MdOutlineAddBox className='text-sky-800 text-4xl' />
          </Link>
        </div>
        { loading ? <Spinner /> : filterValue === '' ? ( <StocksCard stocks={stocks} /> ) : ( <StocksCard stocks={filteredStocks} /> ) }
      </div>
    </div>
  )
}

export default Home;