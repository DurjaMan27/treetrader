import { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditStock = () => {

  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [industry, setIndustry] = useState('');
  const [currPrice, setCurrPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`https://treetrader-backend.vercel.app/stocks/${id}`)
      .then((response) => {
        setName(response.data.stock.name || '');
        setTicker(response.data.stock.ticker || '');
        setIndustry(response.data.stock.industry || '');
        setCurrPrice(response.data.stock.currPrice || 0);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred in saving the stock. Please check the console');
        console.log(error);
      })
  }, []);

  const handleEditStock = () => {
    const data = {
      name,
      ticker,
      industry,
      currPrice,
    }
    setLoading(true);

    axios
      .put(`https://treetrader-backend.vercel.app/stocks/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console.');
        console.log(error);
      });
  }

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Stock</h1>
      { loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Company Name</label>
          <input
            type='text'
            value={ name }
            onChange={ (e) => setName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Ticker</label>
          <input
            type='text'
            value={ ticker }
            onChange={ (e) => setTicker(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Industry</label>
          <input
            type='text'
            value={ industry }
            onChange={ (e) => setIndustry(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>CurrPrice</label>
          <input
            type='number'
            value={ currPrice }
            onChange={ (e) => setCurrPrice(parseInt(e.target.value))}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleEditStock}>
          Save
        </button>
      </div>
    </div>
  )
}

export default EditStock;