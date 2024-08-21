import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../UserContext';


const Header = () => {

  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { signedIn, setSignedIn } = context;

  const Logout = () => {
    localStorage.removeItem("userInfo");
    setSignedIn({
      signedIn: false,
      data: {
        username: "",
        email: "",
      }
    })

    navigate('/');
  }

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        { signedIn.signedIn ? (
          <>
            <button onClick={Logout}>Log Out</button>
            <Link to="/profile">Profile</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/portfolio">Portfolio</Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      { signedIn.signedIn ? (
        <p>Logged in as <strong>{ signedIn.data.username }</strong>.</p>
      ) : (
        <p></p>
      )}
    </header>
  );
};

export default Header;