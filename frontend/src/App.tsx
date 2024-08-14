import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateStock from './pages/CreateStock';
import ShowStock from './pages/ShowStock';
import EditStock from './pages/EditStock';
import DeleteStock from './pages/DeleteStock';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/stocks/create' element={<CreateStock />} />
      <Route path='/stocks/details/:id' element={<ShowStock />} />
      <Route path='/stocks/edit/:id' element={<EditStock />} />
      <Route path='/stocks/delete/:id' element={<DeleteStock />} />
    </Routes>
  )
}

export default App;