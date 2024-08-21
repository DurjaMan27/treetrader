import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../UserContext';

const Portfolio = () => {

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const [numWatching, setNumWatching] = useState(0);
  useEffect(() => {
    setNumWatching(signedIn.data.stocks.watching.length);
  }, [])

  return (
    <div>
      { signedIn.signedIn ? (
          <>
            { numWatching === 0 ? (
              <>
                <h1>You don't have any stocks in your portfolio right now.</h1>
                <h1>Head to the <Link to='/'>home page</Link> to see which stocks are the best for you!</h1>
              </>
            ) : (
              <ul>
                {signedIn.data.stocks.portfolio.map((ticker, index) => (
                  <li>
                    <div style={{border: '1px black solid'}}>
                      <h1>{ ticker.ticker }</h1>
                      <h2>Number of shares: { ticker.numShares }</h2>
                      <h2>Date Purchased: { ticker.datePurchased }</h2>
                      <h3>Price When Purchased: { ticker.purchasedPrice }</h3>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h1>You are not signed in currently. Please sign in to view your stock watchlist.</h1>
            <Link to='/login'>Log In Here</Link>
          </>
        )}
    </div>
  );

}

export default Portfolio;