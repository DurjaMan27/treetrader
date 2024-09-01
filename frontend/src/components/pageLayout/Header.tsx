import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import { CgProfile } from 'react-icons/cg';
import './header.css';


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
    <header className="header">
      <nav>
        <div className='navbar-links'>
          <Link to="/">Home</Link>
          { signedIn.signedIn ? (
            <>
              <button onClick={Logout}>Log Out</button>
              <Link to="/watchlist">Watchlist</Link>
              <Link to="/portfolio">Portfolio</Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
      <div className="user-message">
        { signedIn.signedIn ? (
          <div className='profile-icon'>
            <strong>{ signedIn.data.username }</strong>
            <CgProfile size={64}/>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </header>
  );
};

export default Header;