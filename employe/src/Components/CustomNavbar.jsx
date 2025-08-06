// src/Components/CustomNavbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { getUserRoles } from '../utils/auth.jsx';

const CustomNavbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setRoles(getUserRoles());

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      setIsLoggedIn(!!updatedToken);
      setRoles(getUserRoles());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isAdmin = roles.includes('ROLE_ADMIN');
  const isUser = !isAdmin && roles.includes('ROLE_USER');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRoles([]);
    window.location.href = '/login';
  };

  const handleLogin = () => {
    navigate('/login');
    window.location.reload();
  };

  const handleRegister = () => {
    navigate('/register');
    window.location.reload();
  };

  const badgeStyle = {
    height: '38px',           // matches btn-md height
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',        // horizontal padding similar to button
    fontWeight: '500',
    borderRadius: '0.375rem', // default Bootstrap border radius for buttons
    fontSize: '1rem',         // same as button font size
    cursor: 'default',        // badge is not clickable
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary d-flex align-items-center">
          <FaUserCircle size={26} className="me-2" />
          EMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/" className="text-dark fw-semibold mx-2">Home</Nav.Link>
                <Nav.Link as={Link} to="/employees" className="text-dark fw-semibold mx-2">Employees</Nav.Link>
                {(isAdmin || roles.includes('ROLE_USER')) && (
                  <Nav.Link as={Link} to="/departments" className="text-dark fw-semibold mx-2">
                    Departments
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/profile" className="text-dark fw-semibold mx-2">My Profile</Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            {!isLoggedIn ? (
              <>
                <Button variant="outline-primary" onClick={handleLogin} className="me-2">
                  Login
                </Button>
                <Button variant="primary" onClick={handleRegister}>
                  Register
                </Button>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Badge bg="secondary" pill className="me-2" style={badgeStyle}>
                    Admin
                  </Badge>
                )}
                {isUser && (
                  <Badge bg="info" pill className="me-2" style={{ ...badgeStyle, color: 'white' }}>
                    User
                  </Badge>
                )}
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
