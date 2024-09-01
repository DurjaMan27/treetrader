import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../components/context/UserContext';

const navigate = useNavigate();

const Logout = () => {

  const navigate = useNavigate();

  localStorage.removeItem("userInfo");

  navigate('/');
}

export default Logout;