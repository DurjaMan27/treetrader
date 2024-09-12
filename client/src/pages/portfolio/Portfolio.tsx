import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import UserContext from '../../components/context/UserContext';
import SingularStock from './SingularPortfolioStock';
import './portfolio.css';

const Portfolio = () => {
  const context = useContext(UserContext)
  if (! context) {
    throw new Error('UserContext must be used within a User context provider')
  }
  const { signedIn } = context

  const [portfolio, setPortfolio] = useState([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [addFunds, setAddFunds] = useState(0);
  const [toggleFunds, setToggleFunds] = useState(false);

  const getPortfolio = async () => {

    if (signedIn.signedIn) {
      const response = await axios.get('https://treetrader-backend.vercel.app/users/portfolio', {
        withCredentials: true,
        params: {
          username: signedIn.data.username,
        }
      })
      if (response && response.data) {
        const { data } = response;
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

  const addFundsHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signedIn.signedIn) {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      };

      const dataPackage = {
        username: signedIn.data.username,
        addingFunds: addFunds,
      }

      const response = await axios.post('https://treetrader-backend.vercel.app/users/addFunds', dataPackage, config);
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
    <div className='portfolio-wrapper'>
      { signedIn.signedIn ? (
          <div className='portfolio-content'>
            <div className='portfolio-funds'>
              <div className='portfolio-funds-title'>
                <h1>Total Portfolio Funds:</h1>
                <h2>${totalFunds.toFixed(2)}</h2>
              </div>
              { toggleFunds ? (
                <div className='input-section'>
                  <div className='form'>
                    <Form onSubmit={addFundsHandler}>
                      <Form.Group controlId='formBasicNumber'>
                        <Form.Label>Add More Funds</Form.Label>
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

                      <Row className="hide-message">
                        <Col className='forgot-password'>
                          <button onClick={toggleFundsHandler}>Hide</button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              ) : (
                <div className='show-add-funds'><button onClick={toggleFundsHandler}>Add more funds</button></div>
              )}
            </div>
            { portfolio.length === 0 ? (
              <div className='no-stocks-message'>
                <h1>You don't have any stocks in your portfolio right now.</h1>
                <h1>Head to the <Link to='/'>home page</Link> to see which stocks are the best for you!</h1>
              </div>
            ) : (
              <div className='portfolio-stocks-list'>
                <ul>
                  { portfolio.map((ticker) => (
                    <li>
                      <div key={ticker} style={{border: '1px black solid'}}>
                        <SingularStock ticker={ticker} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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