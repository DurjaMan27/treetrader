import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.tsx';
import ErrorMessage from '../components/ErrorMessage.tsx';
import UserContext from './UserContext';

const LoginScreen = ({ history }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }

      const dataPackage = {
        email,
        password
      }

      setLoading(true);

      const response = await axios.post('http://localhost:5555/users/login', dataPackage, config);

      if (response && response.data) {
        const { data } = response;
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
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.message);
    }
  }

  return (
    <div>
      <div>Login Screen</div>
      { error && <ErrorMessage variant="danger">{ error }</ErrorMessage>}
      { loading && <Spinner /> }
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer? <Link to="/register">Register Here</Link>
        </Col>
      </Row>
    </div>
  );
}

export default LoginScreen;