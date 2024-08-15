import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ShowStock = () => {

  const [stock, setStock] = useState({})
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/stocks/${id}`)
      .then((response) => {
        setStock(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      })
  })

  return (
      <div>
        <BackButton />
        <h1 className='text-3xl my-4'>Show Stock</h1>
        { loading ? (
          <Spinner />
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
              <span>{ new Date(stock.createdAt).toString() }</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
              <span>{ new Date(stock.updatedAt).toString() }</span>
            </div>
          </div>
        )}
      </div>
  )
}

export default ShowStock;