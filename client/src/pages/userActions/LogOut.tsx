import { useNavigate } from 'react-router-dom';

const Logout = () => {

  const navigate = useNavigate();

  localStorage.removeItem("userInfo");

  navigate('/');
}

export default Logout;