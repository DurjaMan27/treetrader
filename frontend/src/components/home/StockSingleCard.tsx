import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import {BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';
import UserContext from '../context/UserContext';


const StockSingleCard = ({ stock }) => {

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const [watching, setWatching] = useState(false);
  const [iconClass, setIconClass] = useState('rgb(196, 196, 196)');

  useEffect(() => {
    if (watching) {
      setIconClass('rgb(0, 255, 0)');
    } else {
      setIconClass('rgb(196, 196, 196)');
    }
  }, [watching])

  useEffect(() => {
    checkWatchingStatus();
  }, [stock])

  const checkWatchingStatus = async () => {
    if (signedIn.signedIn) {
      const response = await axios.get('http://localhost:5555/users/watchlist', {
        params: {
          username: signedIn.data.username,
        }
      });
      if (response && response.data) {
        const { data } = response;
        for(let i = 0; i < data.watchlist.length; i++) {
          if (data.watchlist[i] === stock.ticker ) {
            setWatching(true);
          }
        }
      }
    }
  }

  const handleSaveOrUnsave = async () => {
    if (signedIn.signedIn ) {
      if ( watching ) {
        const dataPackage = {
          username: signedIn.data.username,
          action: 'remove',
        }

        const response = await axios.post(`http://localhost:5555/users/watchlist/${stock.ticker}`, dataPackage)
        if (response && response.data) {
          const { data } = response;
          setWatching(false);
        }
      } else {
        const dataPackage = {
          username: signedIn.data.username,
          action: 'add',
        }

        const response = await axios.post(`http://localhost:5555/users/watchlist/${stock.ticker}`, dataPackage)
        if (response && response.data) {
          const { data } = response;
          setWatching(true);
        }
      }
    }
  }

  return (
    <div
      key={stock._id}
      className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl'
    >
      <h2 className='absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg'>
        { stock.currPrice }
      </h2>
      <h4 className='my-2 text-gray-500'>{stock.ticker}</h4>
      <div className='flex justify-start items-center gap-x-2'>
        <PiBookOpenTextLight className='text-red-300 text-2xl' />
        <h2 className='my-1'>{stock.name}</h2>
      </div>
      <div className='flex justify-start items-center gap-x-2'>
        <BiUserCircle className='text-red-300 text-2xl' />
        <h2 className='my-1'>{stock.company}</h2>
      </div>
      <div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
        <Link to={`stocks/details/${stock.ticker}`}>
          <BsInfoCircle className='text-2xl text-green-800 hover:text-black' />
        </Link>
        { signedIn.signedIn &&
          <button onClick={handleSaveOrUnsave}>
            <FaEye className={'text-2xl hover:text-black'} style={{ color: iconClass }}/>
          </button>
        }
        <Link to={`stocks/delete/${stock._id}`}>
          <MdOutlineDelete className='text-2xl text-red-600 hover:text-black' />
        </Link>
      </div>
    </div>
  )
}

export default StockSingleCard;