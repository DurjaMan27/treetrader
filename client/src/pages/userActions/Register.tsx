import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import axios from 'axios';
import UserContext from '../../components/context/UserContext';
import './user.css';

const RegisterScreen = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [totalFunds, setTotalFunds] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const context = useContext(UserContext)
  if (! context) {
    throw new Error('UserContext must be used within a User context provider')
  }
  const { setSignedIn } = context

  useEffect(() => {
    setError('');
  }, [])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setMessage('Passwords do not match.');
    } else {
      setMessage('');
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        };

        const dataPackage = {
          username,
          email,
          password,
          totalFunds
        }

        setLoading(true);

        const response = await axios.post('https://treetrader-backend.vercel.app/users/register', dataPackage, config)
        if (response && response.data) {
          const { data } = response;
          if (data.token === "exists") {
            throw new Error("A user with this email or username already exists. Please use a different email and/or username.");
          }
          localStorage.setItem('userInfo', JSON.stringify(data));

          setSignedIn({
            signedIn: true,
            data: {
              username: data.username,
              email: data.email,
            }
          })

          setLoading(false);
        } else {
          setLoading(false);
        }
        navigate('/')
      } catch (error) {
        setLoading(false);
        if (isError(error)) {
          setError(error.message);
        } else {
          setError("An unknown error has occurred");
        }
      }
    }
  }

  const isError = (error: unknown): error is Error => {
    return error instanceof Error;
  }

  return (
    <div className='login-container'>
      <div>Register Below</div>
      { error != '' && <ErrorMessage>{ error }</ErrorMessage> }
      { message && <ErrorMessage>{ message }</ErrorMessage> }
      { loading && <Spinner /> }
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="name"
            value={ username }
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='formBasicEmail' className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={ email }
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='formBasicNumber' className="mb-3">
          <Form.Label>Starting Portfolio Investment</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={ totalFunds }
            placeholder="Enter starting portfolio investment"
            onChange={(e) => setTotalFunds(parseInt(e.target.value))}
          />
        </Form.Group>

        <Form.Group controlId='formBasicPassword' className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={ password }
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword' className="mb-3">
          <Form.Label> Confirm{'               '}</Form.Label>
          <Form.Control
            type="password"
            value={ confirmpassword }
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className='btn btn-primary'>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default RegisterScreen;