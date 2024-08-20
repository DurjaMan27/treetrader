import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logout from '../LogOut';

const Header = () => {

  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('userInfo') !== null);
  const [username, setUsername] = useState("");

  const handleLocalStorage = () => {
    setLoggedIn(localStorage.getItem('userInfo') !== null);
    if(localStorage.getItem('userInfo') !== null) {
      setUsername(localStorage.getItem('userInfo').username || "");
      console.log("here we go");
      console.log(localStorage.getItem('userInfo').username)
    }
  }

  useEffect(() => {
    window.addEventListener('storage', handleLocalStorage);
    console.log("here we are");

    return () => {
      window.removeEventListener('storage', handleLocalStorage);
    };
  }, []);

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        { loggedIn ? (
          <>
            <button onClick={Logout}>Log Out</button>
            <Link to="/profile">Profile</Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      { loggedIn ? (
        <p>Logged in as <strong>{ username }</strong>.</p>
      ) : (
        <p></p>
      )}
    </header>
  );
};

export default Header;