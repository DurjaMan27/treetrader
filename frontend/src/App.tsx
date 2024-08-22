import { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateStock from './pages/CreateStock';
import ShowStock from './pages/ShowStock';
import EditStock from './pages/EditStock';
import DeleteStock from './pages/DeleteStock';
import Login from './pages/LogIn';
import Register from './pages/Register';
import Layout from './pages/constants/Layout';
import UserContext from './pages/UserContext';
import Watchlist from './pages/watchPortfolio/Watchlist';
import Portfolio from './pages/watchPortfolio/Portfolio';
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
    const response = await axios.get('http://localhost:5555/tickers/');

    if(response && response.data) {
      const tickers = response.data;
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // console.log(tickers.data.slice(0,4));

      const dataPackage = {
        tickers: tickers.data,
      }

      const message = await axios.post('http://localhost:5555/stocks/addAll', dataPackage, config);
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