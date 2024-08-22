import React, { useEffect, useState, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import UserContext from './UserContext';
import PortfolioForm from './PortfolioForm';

const ShowStock = () => {

  const [stock, setStock] = useState({})
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [portfolioForm, setPortfolioForm] = useState(false);
  const { ticker } = useParams();

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const findStock = async () => {
    const response = await axios.get(`http://localhost:5555/stocks/ticker/${ticker}`);
    if (response && response.data) {
      const { data } = response;
      console.log("here is the data")
      console.log(data);
      if (data.stock.name === 'error') {
        setErrorMessage('Sorry, the ticker you are looking for does not exist. Please refine your search criteria.');
      } else {
        setStock(data.stock)
      }
    }
  }

  const togglePortfolioForm = () => {
    if (portfolioForm) {
      setPortfolioForm(false);
    } else {
      setPortfolioForm(true);
    }
  }

  useEffect(() => {
    setErrorMessage('');
    findStock();
  }, [])

  return (
      <div>
        <BackButton />
        <h1 className='text-3xl my-4'>Show Stock</h1>
        { loading ? (
          <Spinner />
        ) : (
          errorMessage !== '' ? (
            <div>
              <h1>{ errorMessage }</h1>
              <Link to="/">Return to Home Page</Link>
            </div>
          ) : (
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Id</span>
                <span>{ stock._id }</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Company</span>
                <span>{ stock.name }</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Ticker Symbol</span>
                <span>{ stock.symbol }</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Price</span>
                <span>{ stock.currPrice }</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Create Time</span>
                <span>{ new Date(stock.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'}) }</span>
              </div>
              <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
                <span>{ new Date(stock.updatedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'}) }</span>
              </div>
                { signedIn.signedIn ? (
                  <div>
                    { portfolioForm ? (
                      <div>
                        <PortfolioForm ticker={stock} />
                        <button onClick={togglePortfolioForm}>Close Form</button>
                      </div>
                    ) : (
                      <button onClick={togglePortfolioForm}>Add to Portfolio</button>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
            </div>
          )
        )}
      </div>
  )
}

export default ShowStock;