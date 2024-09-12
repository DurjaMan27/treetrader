import React, { useState, useEffect, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Oval } from 'react-loader-spinner';
import UserContext from './context/UserContext';
import axios from 'axios';

interface PortfolioFormProps {
  ticker: {
    name: string,
    ticker: string,
    industry: string,
    currPrice: number,
    createdAt: Date,
    updatedAt: Date,
  }
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ ticker }) => {

  const [numShares, setNumShares] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalFunds, setTotalFunds] = useState(0);
  const [message, setMessage] = useState('');

  const context = useContext(UserContext)
  if (! context) {
    throw new Error('UserContext must be used within a User context provider')
  }
  const { signedIn } = context

  useEffect(() => {
    setTotalPrice(numShares * ticker.currPrice);
  }, [numShares])

  const findFunds = async () => {
    if(signedIn.signedIn) {
      const response = await axios.get(`https://treetrader-backend.vercel.app/users/user/${signedIn.data.username}`, {withCredentials: true});
      if (response && response.data) {
        const { data } = response;
        setTotalFunds(data.totalFunds)
      }
    }
  }

  useEffect(() => {
    findFunds();
  }, [])

  const submitHandler = async () => {
    if (signedIn.signedIn) {
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
          withCredentials: true,
        };

        const dataPackage = {
          username: signedIn.data.username,
          ticker: ticker.ticker,
          numShares: numShares,
          totalPrice: totalPrice,
          action: "buy",
        }

        const response = await axios.post('https://treetrader-backend.vercel.app/users/portfolio', dataPackage, config)
        if (response && response.data) {
          console.log(response)
          setLoading(false);
        }
      }

    }
  }

  return (
    <Form onSubmit={submitHandler}>

      <h1>{ message }</h1>

      <Form.Group controlId="formBasicNumber">
        <Form.Label>Number of Shares to Purchase</Form.Label>
        <Form.Control
          type="number"
          min="1"
          value={numShares}
          placeholder="# of shares to purchase"
          onChange={(e) => setNumShares(parseInt(e.target.value))}
        />
      </Form.Group>

      <Form.Group controlId="formBasicNumber">
        <Form.Label>Total Price</Form.Label>
        <Form.Control
          type="number"
          value={totalPrice}
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
  )

}

export default PortfolioForm;