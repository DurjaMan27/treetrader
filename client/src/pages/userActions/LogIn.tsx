import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner.tsx';
import ErrorMessage from '../../components/ErrorMessage.tsx';
import UserContext from '../../components/context/UserContext.tsx';
import './user.css'

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
      setError(error.message);
    }
  }

  return (
    <div className='login-container'>
      <div>Login Screen</div>
      { error && <ErrorMessage variant="danger">{ error }</ErrorMessage>}
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

{/* <form onSubmit={submitHandler}>

        <h3>Login Screen</h3>
        { error && <ErrorMessage variant="danger">{ error }</ErrorMessage>}
        { loading && <Spinner /> }

        <div className="mb-3">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            className='form-control'
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className='form-control'
          />
        </div>

        <div className='d-grid'>
          <button type="submit" className='btn btn-primary'>
            Submit
          </button>
        </div>
        <p className='forgot-password text-right'>
          New Customer? <Link to='/register'>Register Here</Link>
        </p>
      </form>
      <Row className="py-3">
        <Col className='forgot-password text-right'>
          New Customer? <Link to="/register">Register Here</Link>
        </Col>
      </Row> 
    </div>*/}