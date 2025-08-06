import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({ username: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation example (you can customize)
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setMessage('');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.post('http://localhost:8080/reset-password', formData);
      setMessage('Password reset successful! You can now login.');
      setError('');
      setFormData({ username: '', newPassword: '' });
    } catch (err) {
      const errMsg =
        err.response?.data || 'Username not found or error occurred.';
      setError(errMsg);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: 400 }}>
        <h3 className="text-center mb-4">Reset Password</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter your new password"
              disabled={loading}
            />
          </Form.Group>

          <Button type="submit" className="w-100" variant="warning" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Link to="/login">Back to Login</Link>
        </div>
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;
