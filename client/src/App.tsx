import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateStock from './pages/stockActions/CreateStock';
import ShowStock from './pages/stockActions/ShowStock';
import EditStock from './pages/stockActions/EditStock';
import DeleteStock from './pages/stockActions/DeleteStock';
import Login from './pages/userActions/LogIn';
import Register from './pages/userActions/Register';
import Layout from './components/pageLayout/Layout';
import UserContext from './components/context/UserContext';
import Watchlist from './pages/watchlist/Watchlist';
import Portfolio from './pages/portfolio/Portfolio';
import axios from 'axios';


interface UserState {
  signedIn: boolean,
  data: {
    username: String,
    email: String,
  },
}

const App = () => {

  const [signedIn, setSignedIn] = useState<UserState>({signedIn: false, data: {username: "", email: ""}})

  useEffect(() => {
    const data = localStorage.getItem('userInfo')
    if (data !== null && signedIn.signedIn === false) {
      const JSON_data = JSON.parse(data);
      setSignedIn({signedIn: true, data: {username: JSON_data.username, email: JSON_data.email}})
    } else if (signedIn.signedIn) {
      updatingStocks();
    }

  }, [signedIn])

  const updatingStocks = async () => {
    const response = await axios.get('https://treetrader-backend.vercel.app/tickers/');

    if(response && response.data) {
      const tickers = response.data;
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const dataPackage = {
        tickers: tickers.data,
      }

      const message = await axios.post('https://treetrader-backend.vercel.app/stocks/addAll', dataPackage, config);
    }
  }

  return (
    <UserContext.Provider value={{ signedIn, setSignedIn }}>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/stocks/create' element={<CreateStock />} />
          <Route path='/stocks/details/:ticker' element={<ShowStock />} />
          <Route path='/stocks/edit/:id' element={<EditStock />} />
          <Route path='/stocks/delete/:id' element={<DeleteStock />} />
          <Route path='/portfolio' element={<Portfolio />} />
          <Route path='/watchlist' element={<Watchlist />} />
        </Routes>
      </Layout>
    </UserContext.Provider>
  )
}

export default App;