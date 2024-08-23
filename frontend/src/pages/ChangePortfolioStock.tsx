import React, { useState, useEffect, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import UserContext from './UserContext';
import { Oval } from 'react-loader-spinner';
import axios from 'axios';

interface Ticker {
  ticker: string,
  currShares: number,
  currPrice: number,
}

const ChangeStock: React.FC<Ticker> = ({ ticker, currShares }) => {

  const [currPrice, setCurrPrice] = useState(0);
  const [buyMore, setBuyMore] = useState(false);
  const [sellMore, setSellMore] = useState(false);
  const [totalFunds, setTotalFunds] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numShares, setNumShares] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTotalPrice(numShares * currPrice);
  }, [numShares, currPrice])

  const findCurrPrice = async () => {
    const response = await axios.get(`http://localhost:5555/stocks/ticker/${ticker}`);
      if (response && response.data) {
        const { data } = response;
        setCurrPrice(data.stock.currPrice)
      }
  }

  useEffect(() => {
    findCurrPrice();
  }, [])

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const findFunds = async () => {
    if(signedIn.signedIn) {
      const response = await axios.get(`http://localhost:5555/users/user/${signedIn.data.username}`);
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

  const handleSellSubmit = async () => {
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

      const response = await axios.post('http://localhost:5555/users/portfolio', dataPackage, config)
      if (response && response.data) {
        const { data } = response;
        setLoading(false);
      }
      setBuyMore(false);
      setSellMore(false);
    }
  }

  const handleBuySubmit = async () => {
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

      const response = await axios.post('http://localhost:5555/users/portfolio', dataPackage, config)
      if (response && response.data) {
        const { data } = response;
        setLoading(false);
      }
      setBuyMore(false);
      setSellMore(false);
    }
  }

  return (
    <div>
      { buyMore || sellMore ? (
        sellMore ? (
          <div>
            <Form onSubmit={handleSellSubmit}>
              <h1>{ message }</h1>
              <Form.Group controlId="formBasicNumber">
                <Form.Label>Number of Shares to Sell</Form.Label>
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
                <Form.Label>Total Amount Gained</Form.Label>
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
            <button onClick={handleBuyButton}>Buy Shares</button>
            <button onClick={closeButtons}>Close</button>
          </div>
        ) : (
          <div>
            <Form onSubmit={handleBuySubmit}>
              <h1>{ message }</h1>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Number of Shares to Purchase</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={numShares}
                  placeholder="Number of shares to purchase"
                  onChange={(e) => setNumShares(parseInt(e.target.value))}
                />
                </Form.Group>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Total Price</Form.Label>
                <Form.Control
                  type="number"
                  value={ totalPrice }
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Current Portfolio Funds</Form.Label>
                <Form.Control
                  type="number"
                  value={ totalFunds }
                  readOnly
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Purchase Shares
                <Oval visible={loading} height="80" width="80" color="#4fa94d"/>
              </Button>
            </Form>
            <button onClick={handleSellButton}>Sell Shares</button>
            <button onClick={closeButtons}>Close</button>
          </div>
        )
      ) : (
        <div>
          <button onClick={handleSellButton} style={{ border: '1px black solid' }}>Sell Shares</button>
          <button onClick={handleBuyButton} style={{ border: '1px black solid' }}>Buy Shares</button>
        </div>
      )}
    </div>
  )
}

export default ChangeStock;