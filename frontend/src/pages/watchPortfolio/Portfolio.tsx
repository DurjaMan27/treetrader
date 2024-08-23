import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import UserContext from '../UserContext';
import SingularStock from '../SingularPortfolioStock';

const Portfolio = () => {

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const [portfolio, setPortfolio] = useState([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [addFunds, setAddFunds] = useState(0);
  const [toggleFunds, setToggleFunds] = useState(false);

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

  const toggleFundsHandler = () => {
    if (toggleFunds) {
      setToggleFunds(false);
    } else {
      setToggleFunds(true);
    }
  }

  const addFundsHandler = async (e) => {
    e.preventDefault();
    console.log("here is what we are");
    console.log(addFunds);
    console.log(typeof(addFunds))
    if (signedIn.signedIn) {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const dataPackage = {
        username: signedIn.data.username,
        addingFunds: addFunds,
      }

      const response = await axios.post('http://localhost:5555/users/addFunds', dataPackage, config);
      if (response && response.data) {
        const data = response.data;
        setTotalFunds(data.totalFunds);
        setToggleFunds(false);
        setAddFunds(0);
      }
    }

  }

  useEffect(() => {
    getPortfolio();
  }, [signedIn])

  return (
    <div>
      { signedIn.signedIn ? (
          <>
            <h1>Total Portfolio Funds: ${totalFunds.toFixed(2)}</h1>
            <button onClick={toggleFundsHandler}>Add more funds.</button>
            { toggleFunds ? (
              <Form onSubmit={addFundsHandler}>
                <Form.Group controlId='formBasicNumber'>
                  <Form.Label>Starting Portfolio Investment</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={ addFunds }
                    placeholder="Enter starting portfolio investment"
                    onChange={(e) => setAddFunds(parseInt(e.target.value))}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Add Funds
                </Button>
              </Form>
            ) : (
              <div></div>
            )}
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
                        <SingularStock ticker={ticker} />
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