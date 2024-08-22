import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../UserContext';

const Portfolio = () => {

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const [portfolio, setPortfolio] = useState([]);
  const [totalFunds, setTotalFunds] = useState(0);

  const getPortfolio = async () => {

    if (signedIn.signedIn) {
      const response = await axios.get('http://localhost:5555/users/portfolio', {
        params: {
          username: signedIn.data.username,
        }
      })
      if (response && response.data) {
        const { data } = response;
        console.log(data);
        console.log(data.portfolio);
        setPortfolio(data.portfolio);
        setTotalFunds(data.totalFunds);
      }
    }
  }

  const addFunds = async () => {
    console.log("adding funds...");
  }

  useEffect(() => {
    getPortfolio();
  }, [signedIn])

  return (
    <div>
      { signedIn.signedIn ? (
          <>
            <h1>Total Portfolio Funds: ${totalFunds}</h1>
            <button onClick={addFunds}>Add more funds.</button>
            { portfolio.length === 0 ? (
              <>
                <h1>You don't have any stocks in your portfolio right now.</h1>
                <h1>Head to the <Link to='/'>home page</Link> to see which stocks are the best for you!</h1>
              </>
            ) : (
              <>
                <ul>
                  { portfolio.map((ticker, index) => (
                    <li>
                      <div key={ticker} style={{border: '1px black solid'}}>
                        <h1>{ ticker.ticker }</h1>
                        <h2>Number of shares: { ticker.numShares }</h2>
                        <h2>Date Purchased: { ticker.datePurchased }</h2>
                        <h3>Price When Purchased: { ticker.priceInvested }</h3>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
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