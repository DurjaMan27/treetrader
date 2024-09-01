import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../components/context/UserContext';
import StockSingleCardByTicker from '../../components/home/StockSingleCardByTicker';
import Spinner from '../../components/Spinner';
import './watchlist.css'

const Watchlist = () => {

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const [watching, setWatching] = useState([]);
  const [filteredWatching, setFilteredWatching] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWatchlist = async () => {
    if (signedIn.signedIn) {
      setLoading(true);
      const response = await axios.get('http://localhost:5555/users/watchlist', {
        params: {
          username: signedIn.data.username,
        }
      })
      if (response && response.data) {
        const { data } = response;
        setWatching(data.watchlist);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    getWatchlist();
  }, [signedIn])

  const [filterValue, setFilterValue] = useState('');
  useEffect(() => {
    if (filterValue === "") {
      setFilteredWatching([]);
    } else {
      const lowercasedFilter = filterValue.toLowerCase();
      const filteredData = watching.filter((stock) =>
          stock.name.toLowerCase().includes(lowercasedFilter) ||
          stock.ticker.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredWatching(filteredData);
    }
  }, [filterValue])

  return (
    <div className="all-stocks-section">
      <div className="top-level">
        <div className="title">
          <h1 className='title-text'>All Watchlist Stocks</h1>
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
      { signedIn.signedIn ? (
          <div className={watching.length === 0 ? 'stocks-message' : 'stocks-grid'}>
            { watching.length === 0 ? (
              loading ? (
                <Spinner />
              ) : (
                <>
                  <h1>You aren't watching any stocks right now.</h1>
                  <h1>Head to the <Link to='/'>home page</Link> to see which stocks are the best for you!</h1>
                </>
              )
            ) : (
              <>
                {watching.map((ticker, index) => (
                  <StockSingleCardByTicker key={ticker} stockTicker={ticker}/>
                ))}
              </>

            )}
          </div>
        ) : (
          <>
            <h1>You are not signed in currently. Please sign in to view your stock watchlist.</h1>
            <Link to='/login'>Log In Here</Link>
          </>
        )}
    </div>
  </div>
  );
}

export default Watchlist;