import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import UserContext from '../../components/context/UserContext';
import { Oval } from 'react-loader-spinner';
import axios from 'axios';

interface Ticker {
  ticker: string,
  currShares: number,
  currPrice: number,
  functionRefresh: Function,
}

const ChangeStock: React.FC<Ticker> = ({ ticker, currShares, functionRefresh }) => {

  const [currPrice, setCurrPrice] = useState(0);
  const [buyMore, setBuyMore] = useState(false);
  const [sellMore, setSellMore] = useState(false);
  const [totalFunds, setTotalFunds] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numShares, setNumShares] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTotalPrice(numShares * currPrice);
  }, [numShares, currPrice])

  const findCurrPrice = async () => {
    const response = await axios.get(`https://treetrader-backend.vercel.app/stocks/ticker/${ticker}`);
      if (response && response.data) {
        const { data } = response;
        setCurrPrice(data.stock.currPrice)
      }
  }

  useEffect(() => {
    findCurrPrice();
  }, [])

  const context = useContext(UserContext)
  if (! context) {
    throw new Error('UserContext must be used within a User context provider')
  }
  const { signedIn } = context

  const findFunds = async () => {
    if(signedIn.signedIn) {
      const response = await axios.get(`https://treetrader-backend.vercel.app/users/user/${signedIn.data.username}`);
      if (response && response.data) {
        const { data } = response;
        setTotalFunds(data.totalFunds)
      }
    }
  }

  useEffect(() => {
    findFunds();
  }, [])

  const closeButtons = () => {
    setNumShares(1);
    setSellMore(false);
    setBuyMore(false);
  }

  const handleSellButton = () => {
    setNumShares(1);
    setSellMore(true);
    setBuyMore(false);
  }

  const handleBuyButton = () => {
    setNumShares(1);
    setSellMore(false);
    setBuyMore(true);
  }

  const handleSellSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e)
    if (numShares > currShares) {
      setMessage("Cannot sell more shares than you have currently");
    } else {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const dataPackage = {
        username: signedIn.data.username,
        ticker: ticker,
        numShares: numShares,
        totalPrice: totalPrice,
        action: "sell",
      }

      const response = await axios.post('https://treetrader-backend.vercel.app/users/portfolio', dataPackage, config)
      if (response && response.data) {
        setLoading(false);
      }
      setBuyMore(false);
      setSellMore(false);
    }
    navigate('/portfolio');
    functionRefresh();
  }

  const handleBuySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if(totalPrice > totalFunds) {
      setMessage('You do not have enough funds to complete this purchase.');
      setLoading(false);
    } else {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const dataPackage = {
        username: signedIn.data.username,
        ticker: ticker,
        numShares: numShares,
        totalPrice: totalPrice,
        action: "buy",
      }

      const response = await axios.post('https://treetrader-backend.vercel.app/users/portfolio', dataPackage, config)
      if (response && response.data) {
        setLoading(false);
      }
      setBuyMore(false);
      setSellMore(false);
    }
    navigate('/portfolio');
    functionRefresh();
  }

  return (
    <div className='form-container-overall'>
      { buyMore || sellMore ? (
        sellMore ? (
          <div className='sell-shares-form-container'>
            <Form onSubmit={handleSellSubmit}>
              <h1>{ message }</h1>
              <Form.Group controlId="formBasicNumber">
                <Form.Label>Shares to Sell</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={currShares}
                  value={numShares}
                  placeholder="Number of shares to sell"
                  onChange={(e) => setNumShares(parseInt(e.target.value))}
                />
                </Form.Group>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Amount Gained</Form.Label>
                <Form.Control
                  type="number"
                  value={totalPrice}
                  readOnly
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Sell Shares
                <Oval visible={loading} height="80" width="80" color="#4fa94d"/>
              </Button>
            </Form>
            <button onClick={closeButtons}>Close</button>
          </div>
        ) : (
          <div className='buy-shares-form-container'>
            <Form onSubmit={handleBuySubmit}>
              <h1>{ message }</h1>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Shares to Purchase</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={numShares}
                  placeholder="Number of shares to purchase"
                  onChange={(e) => setNumShares(parseInt(e.target.value))}
                />
                </Form.Group>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Total Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  value={ totalPrice }
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Funds Available ($)</Form.Label>
                <Form.Control
                  type="number"
                  value={ totalFunds.toFixed(2) }
                  readOnly
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Buy Shares
                <Oval visible={loading} height="80" width="80" color="#4fa94d"/>
              </Button>
            </Form>
            <button onClick={closeButtons}>Close</button>
          </div>
        )
      ) : (
        <div className='buy-or-sell-buttons'>
          <button onClick={handleSellButton} style={{ border: '1px black solid' }}>Sell Shares</button>
          <button onClick={handleBuyButton} style={{ border: '1px black solid' }}>Buy Shares</button>
        </div>
      )}
    </div>
  )
}

export default ChangeStock;