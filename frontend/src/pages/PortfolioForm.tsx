import React, { useState, useEffect, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import UserContext from './UserContext';

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

  useEffect(() => {
    setTotalPrice(numShares * ticker.currPrice);
  }, [numShares])

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const submitHandler = async () => {

  }

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="formBasicNumber">
        <Form.Label>Number of Shares to Purchase</Form.Label>
        <Form.Control
          type="number"
          min="1"
          value={numShares}
          placeholder="Enter email"
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

      <Button variant="primary" type="submit">
        Purchase Shares
      </Button>
    </Form>
  )

}

export default PortfolioForm;