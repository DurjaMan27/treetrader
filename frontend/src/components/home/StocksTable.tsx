import { Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';
import UserContext from '../../pages/UserContext';

const StocksTable = ({ stocks }) => {

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
  }, [stocks])

  const checkWatchingStatus = async () => {
    if (signedIn.signedIn) {
      const response = await axios.get('http://localhost:5555/users/watchlist', {
        params: {
          username: signedIn.data.username,
        }
      })
      if (response && response.data) {
        const { data } = response;
        for(let i = 0; i < data.watchlist.length; i++) {
          if (data.watchlist[i] === stocks.ticker ) {
            setWatching(true);
          }
        }
      }
    }
  }

  return (
    <table className='w-full border-separate border-spacing-2'>
          <thead>
            <tr>
              <th className='border border-slate-600 rounded-md'>No</th>
              <th className='border border-slate-600 rounded-md'>Company</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Ticker</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>CurrPrice</th>
              <th className='border border-slate-600 rounded-md'>Operations</th>
            </tr>
          </thead>
          <tbody>
            { stocks.map((stock, index) => (
              <tr key={ stock._id } className='h-8'>
                <td className='border border-slate-700 rounded-md text-center'>
                  { index + 1 }
                </td>
                <td className='border border-slate-700 rounded-md text-center'>
                  { stock.name }
                </td>
                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                  { stock.ticker }
                </td>
                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                  { stock.currPrice }
                </td>
                <td className='border border-slate-700 rounded-md text-center'>
                  <div className='flex justify-center gap-x-4'>
                    <Link to={`/stocks/details/${stock._id}`}>
                      <BsInfoCircle className='text-2xl text-green-800' />
                    </Link>
                    <Link to={`/stocks/edit/${stock._id}`}>
                      <AiOutlineEdit className='text-2xl text-yellow-600' />
                    </Link>
                    <Link to={`/stocks/delete/${stock._id}`}>
                      <MdOutlineDelete className='text-2xl text-red-600' />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  )
}

export default StocksTable;