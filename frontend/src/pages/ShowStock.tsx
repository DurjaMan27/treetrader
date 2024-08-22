import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ShowStock = () => {

  const [stock, setStock] = useState({})
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { ticker } = useParams();

  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get(`http://localhost:5555/stocks/${id}`)
  //     .then((response) => {
  //       setStock(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setLoading(false);
  //     })
  // })

  const findStock = async () => {
    const response = await axios.get(`http://localhost:5555/stocks/${ticker}`);
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
            </div>
          )
        )}
      </div>
  )
}

export default ShowStock;