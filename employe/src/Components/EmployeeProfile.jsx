import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance.jsx';
import { Card, Container, Spinner, Alert } from 'react-bootstrap';

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/employees/profile');
        setProfile(res.data);
      } catch (err) {
        setError('Unable to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Container className="d-flex justify-content-center align-items-center min-vh-100"><Spinner animation="border" /></Container>;
  if (error) return <Container className="d-flex justify-content-center align-items-center min-vh-100"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: 500 }}>
        <h3 className="text-center mb-4">My Profile</h3>
        <p><strong>First Name:</strong> {profile.firstName}</p>
        <p><strong>Last Name:</strong> {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Department:</strong> {profile.department?.name || 'N/A'}</p>
        <p><strong>Age:</strong> {profile.age}</p>
      </Card>
    </Container>
  );
};

export default EmployeeProfile;
