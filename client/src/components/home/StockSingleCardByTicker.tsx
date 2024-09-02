import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';
import UserContext from '../context/UserContext';
import '../../pages/watchlist/watchlist.css';

interface StockPropDataStructure {
  stockTicker: {
    name: string,
    ticker: string,
    currPrice: number,
    lastPrice: number,

    industry: string,
    createdAt: Date,
    updatedAt: Date,
  }
}

interface StateVarStructure {
  name: string,
  ticker: string,
  currPrice: number,
  lastPrice: number,

  industry: string,
  createdAt: Date,
  updatedAt: Date,
}


const StockSingleCardByTicker: React.FC<StockPropDataStructure> = ({ stockTicker }) => {

  const context = useContext(UserContext)
  if (! context) {
    throw new Error('UserContext must be used within a User context provider')
  }
  const { signedIn } = context

  const [stock, setStock] = useState<StateVarStructure>({name:'', ticker:'', currPrice:-1, lastPrice:-1, industry:'', createdAt:new Date(), updatedAt: new Date()});

  useEffect(() => {
    getStockData();
  }, [])

  const getStockData = async () => {
    const response = await axios.get(`https://treetrader-backend.vercel.app/stocks/ticker/${stockTicker}`);
    if (response && response.data) {
      const { data } = response;
      console.log("here is the data")
      console.log(data);
      if (data.stock.name === 'error') {
        console.log('')
      } else {
        setStock(data.stock)
      }
    }
  }

  const [watching, setWatching] = useState(false);
  const [iconClass, setIconClass] = useState('rgb(196, 196, 196)');

  const [difference, setDifference] = useState('');

  useEffect(() => {
    if (watching) {
      setIconClass('rgb(0, 255, 0)');
    } else {
      setIconClass('rgb(196, 196, 196)');
    }
  }, [watching])

  const findDifference = () => {
    if (stock.currPrice < stock.lastPrice) {
      setDifference(`-$${(Math.abs(stock.currPrice - stock.lastPrice)).toFixed(2)}`)
    } else {
      setDifference(`+$${(Math.abs(stock.currPrice - stock.lastPrice)).toFixed(2)}`)
    }
  }

  useEffect(() => {
    checkWatchingStatus();
    findDifference();
  }, [stock])

  const checkWatchingStatus = async () => {
    if (signedIn.signedIn) {
      const response = await axios.get('https://treetrader-backend.vercel.app/users/watchlist', {
        params: {
          username: signedIn.data.username,
        }
      });
      if (response && response.data) {
        const { data } = response;
        for(let i = 0; i < data.watchlist.length; i++) {
          if (data.watchlist[i] === stock.ticker ) {
            setWatching(true);
          }
        }
      }
    }
  }

  const handleSaveOrUnsave = async () => {
    if (signedIn.signedIn ) {
      if ( watching ) {
        const dataPackage = {
          username: signedIn.data.username,
          action: 'remove',
        }

        const response = await axios.post(`https://treetrader-backend.vercel.app/users/watchlist/${stock.ticker}`, dataPackage)
        if (response && response.data) {
          setWatching(false);
        }
      } else {
        const dataPackage = {
          username: signedIn.data.username,
          action: 'add',
        }

        const response = await axios.post(`https://treetrader-backend.vercel.app/users/watchlist/${stock.ticker}`, dataPackage)
        if (response && response.data) {
          setWatching(true);
        }
      }
    }
  }

  return (
    <div
      key={stock.name}
      className={stock.currPrice < stock.lastPrice ? 'all-stocks-negative' : 'all-stocks-positive'}
    >
      <Link to={`/stocks/details/${stock.ticker}`}>
        <div className='stock-information'>
          <div className='top-line'>
            <h4 className='stock-ticker'>{stock.ticker}</h4>
            <div className={stock.currPrice < stock.lastPrice ? 'stock-difference-negative' : 'stock-difference-positive'}>
              { difference }
            </div>
          </div>
          <div className='middle-line'>
            <div className='stock-name'>
              <h2>{ stock.name }</h2>
            </div>
            <div className='stock-industry'>
              <h2>{ stock.industry }</h2>
            </div>
          </div>
          <div className='price-line'>
            <h2 className='stock-curr-price'>
              ${ stock.currPrice }
            </h2>
          </div>

        </div>
      </Link>
      <div className='save-section'>
        { signedIn.signedIn &&
          <button onClick={handleSaveOrUnsave}>
            <FaEye className={'text-2xl hover:text-black'} style={{ color: iconClass }}/>
          </button>
        }
      </div>
    </div>
  )
}

export default StockSingleCardByTicker;