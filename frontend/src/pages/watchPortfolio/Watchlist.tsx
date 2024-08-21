import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../UserContext';

const Watchlist = () => {

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
                <h1>You aren't watching any stocks right now.</h1>
                <h1>Head to the <Link to='/'>home page</Link> to see which stocks are the best for you!</h1>
              </>
            ) : (
              <ul>
                {signedIn.data.stocks.watching.map((ticker, index) => (
                  <li key={index}>{ ticker }</li>
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

export default Watchlist;