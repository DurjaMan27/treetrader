import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../components/context/UserContext';

const navigate = useNavigate();

const Logout = () => {

  const navigate = useNavigate();
  // const context = useContext(UserContext);
  // const { signedIn, setSignedIn } = context;

  console.log("got context")

  localStorage.removeItem("userInfo");

  console.log("removed from storage");

  // setSignedIn({
  //   signedIn: false,
  //   data: {
  //     username: "",
  //     email: "",
  //   }
  // })

  console.log("changed sign in");

  navigate('/');

  console.log("Back to home");
}

export default Logout;