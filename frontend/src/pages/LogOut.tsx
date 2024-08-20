import { Link, useNavigate } from 'react-router-dom';

const Logout = () => {
  localStorage.removeItem("userInfo");
  const navigate = useNavigate();
  navigate('/');
}

export default Logout;