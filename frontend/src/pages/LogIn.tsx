import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.tsx';
import ErrorMessage from '../components/ErrorMessage.tsx';

const LoginScreen = ({ history }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const userInfo = localStorage.getItem("userInfo");

  //   if(userInfo) {
  //     history.push('/mynotes');
  //   }
  // }, [history]);

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }

      setLoading(true);

      const { data } = await axios.post(
        '/users/login',
        {
          email,
          password,
        },
        config
      );

      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.message);
    }
  }

  return (
    <body>
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
            placeholder="password"
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
    </body>
  );
}

export default LoginScreen;