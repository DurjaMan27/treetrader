import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import axios, { AxiosError } from 'axios';

const RegisterScreen = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
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
        };

        const dataPackage = {
          username,
          email,
          password,
        }

        setLoading(true);

        const response = await axios.post('http://localhost:5555/users/register', dataPackage, config)
          // .then(() => {
          //   setLoading(false);
          //   localStorage.setItem("userInfo", JSON.stringify(data))
          // })
          // .catch((error) => {
          //   setLoading(false);
          //   console.log(error)
          //   console.log("error with the post method");
          // })
        if (response && response.data) {
          const { data } = response;
          if (data.token === "exists") {
            throw new Error("A user with this email or username already exists. Please use a different email and/or username.");
          }
          localStorage.setItem('userInfo', JSON.stringify(data));
          setLoading(false);
        } else {
          setLoading(false);
        }
        navigate('/')
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    }
  }

  // useEffect(() => {
  //   if(registered) {
  //     const navigate = useNavigate()
  //     setRegistered(false);
  //     navigate('/');
  //   }
  // }, [registered])

  return (
    <div className='login-container'>
      <h1>Register Screen</h1>
      { error && <ErrorMessage variant='danger'>{ error }</ErrorMessage> }
      { message && <ErrorMessage variant='danger'>{ message }</ErrorMessage> }
      { loading && <Spinner /> }
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="name"
            value={ username }
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={ email }
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={ password }
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={ confirmpassword }
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default RegisterScreen;