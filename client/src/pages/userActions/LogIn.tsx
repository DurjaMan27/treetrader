import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner.tsx';
import ErrorMessage from '../../components/ErrorMessage.tsx';
import UserContext from '../../components/context/UserContext.tsx';
import './user.css'

const LoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const context = useContext(UserContext)
  if (! context) {
    throw new Error('UserContext must be used within a User context provider')
  }
  const { setSignedIn } = context

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const dataPackage = {
        email,
        password
      }

      setLoading(true);

      const response = await axios.post('https://treetrader-backend.vercel.app/users/login', dataPackage, config);

      if (response && response.data) {
        const { data } = response;
        if (data.token === "exists") {
          throw new Error("Your email or password are incorrect. Please enter the correct email or password.");
        }
        localStorage.setItem('userInfo', JSON.stringify(data));

        setSignedIn({
          signedIn: true,
          data: {
            username: data.username,
            email: data.email,
          }
        })
      }

      setLoading(false);
      setEmail("");
      setPassword("");
      setError("");
      navigate('/');
    } catch (error) {
      setLoading(false);
      if (isError(error)) {
        setError(error.message);
      } else {
        setError("An unknown error has occurred.");
      }
    }
  }

  const isError = (error: unknown): error is Error => {
    return error instanceof Error;
  }

  return (
    <div className='login-container'>
      <div>Login Screen</div>
      { error && <ErrorMessage>{ error }</ErrorMessage>}
      { loading && <Spinner /> }
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            className='form-control'
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className='form-control'
          />
        </Form.Group>

        <div className='d-grid'>
          <Button variant="primary" type="submit" className='btn btn-primary'>
            Submit
          </Button>
        </div>
      </Form>
      <Row className="py-3">
        <Col className='forgot-password text-right'>
          New Customer? <Link to="/register">Register Here</Link>
        </Col>
      </Row>
    </div>
  );
}

export default LoginScreen;