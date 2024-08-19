import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import CreateStock from './pages/CreateStock';
import ShowStock from './pages/ShowStock';
import EditStock from './pages/EditStock';
import DeleteStock from './pages/DeleteStock';
import LoginScreen from './pages/LogIn';
import RegisterScreen from './pages/LogIn';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/stocks/create' element={<CreateStock />} />
      <Route path='/stocks/details/:id' element={<ShowStock />} />
      <Route path='/stocks/edit/:id' element={<EditStock />} />
      <Route path='/stocks/delete/:id' element={<DeleteStock />} />
    </Routes>
  )
}

export default App;