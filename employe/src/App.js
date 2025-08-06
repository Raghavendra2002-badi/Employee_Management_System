import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './Components/Homepage.jsx';
import CustomNavbar from './Components/CustomNavbar.jsx';
import Employeelist from './Components/Employeelist.jsx';
import DepartmentList from './Components/DepartmentList.jsx';
import LoginPage from './Components/LoginPage.jsx';
import ForgotPasswordPage from './Components/ForgotPasswordPage.jsx';
import EmployeeProfile from './Components/EmployeeProfile.jsx';
import Register from './Components/Register.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';

const App = () => (
  <Router>
    <CustomNavbar />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route
        path="/employees"
        element={
          <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_USER']}>
            <Employeelist />
          </PrivateRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_USER']}>
            <DepartmentList />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_USER']}>
            <EmployeeProfile />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
