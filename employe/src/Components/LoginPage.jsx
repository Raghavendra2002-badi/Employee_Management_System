import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
} from 'react-bootstrap';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', formData);
      console.log('Login response:', res.data);
      localStorage.setItem('token', res.data.jwt);  // note 'jwt' matches backend response key
      navigate('/employees'); // redirect to employees dashboard
    } catch (err) {
      console.error('Login error:', err.response || err.message);
      setError('Invalid username or password');
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <Card
        style={{ maxWidth: 400, width: '100%', borderRadius: '12px' }}
        className="p-4 shadow-sm"
      >
        <h2
          className="text-center mb-4 fw-bold text-primary"
          style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
        >
          Log In
        </h2>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label className="fw-semibold">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
              size="lg"
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              size="lg"
            />
          </Form.Group>

          <Button type="submit" variant="primary" size="lg" className="w-100 fw-semibold">
            Login
          </Button>
        </Form>

        <div className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
  <div>
    New user?{' '}
    <a href="/register" className="text-decoration-none" style={{ color: '#0d6efd' }}>
      Register now
    </a>
  </div>
  <div>
    Forgot your password?{' '}
    <a href="/forgot-password" className="text-decoration-none" style={{ color: '#0d6efd' }}>
      Reset here
    </a>
  </div>
</div>

      </Card>
    </Container>
  );
};

export default LoginPage;
