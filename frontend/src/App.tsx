import { createContext, useState } from 'react';
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

interface UserState {
  signedIn: boolean,
  data: {
    username: String,
    email: String,
  },
}

const App = () => {

  const [signedIn, setSignedIn] = useState<UserState>({signedIn: false, data: {username: "", email: ""}})

  return (
    <UserContext.Provider value={{ signedIn, setSignedIn }}>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/stocks/create' element={<CreateStock />} />
          <Route path='/stocks/details/:id' element={<ShowStock />} />
          <Route path='/stocks/edit/:id' element={<EditStock />} />
          <Route path='/stocks/delete/:id' element={<DeleteStock />} />
        </Routes>
      </Layout>
    </UserContext.Provider>
  )
}

export default App;