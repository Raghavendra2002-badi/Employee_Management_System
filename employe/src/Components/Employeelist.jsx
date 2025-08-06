import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance.jsx';
import { getUserRoles } from '../utils/auth.jsx';

const Employeelist = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    age: '',
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [roles, setRoles] = useState([]);

  // Load roles first, then load employees and departments
  useEffect(() => {
    const rolesFromToken = getUserRoles();
    setRoles(rolesFromToken);
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      fetchEmployees();
      fetchDepartments();
    }
  }, [roles]);

  const isAdmin = roles.includes('ROLE_ADMIN');

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/employees');  // baseURL includes /api
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err.response || err.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/departments');  // baseURL includes /api
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err.response || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await axios.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error('Delete failed', err.response || err.message);
    }
  };

  const handleEdit = (emp) => {
    if (!isAdmin) return;
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      department: emp.department?.id || '',
      age: emp.age,
    });
    setEditingEmployeeId(emp.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    if (!isAdmin) return;
    setFormData({ firstName: '', lastName: '', email: '', department: '', age: '' });
    setEditingEmployeeId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const selectedDept = departments.find((d) => d.id === parseInt(formData.department));
    const payload = {
      ...formData,
      department: selectedDept,
      age: parseInt(formData.age),
    };

    try {
      if (editingEmployeeId) {
        await axios.put(`/employees/${editingEmployeeId}`, payload);
      } else {
        await axios.post('/employees', payload);
      }
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error saving employee:', err.response || err.message);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.department?.name || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === '' || emp.department?.id?.toString() === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="directory container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h2 className="m-0">Employee Directory</h2>
        {isAdmin && (
          <button className="btn btn-success" onClick={handleAddNew}>
            Add New Employee
          </button>
        )}
      </div>
      <p className="mb-4">Manage your team members and their information</p>

      <div className="top-bar d-flex justify-content-between align-items-center flex-wrap my-3 gap-2">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-select w-25"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && isAdmin && (
        <form className="border p-3 mb-4" onSubmit={handleSubmit}>
          <h5>{editingEmployeeId ? 'Edit Employee' : 'Add New Employee'}</h5>
          <div className="row">
            <div className="col-md-2 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={formData.firstName}
                required
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={formData.lastName}
                required
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="col-md-3 mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="col-md-3 mb-2">
              <select
                className="form-control"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Age"
                value={formData.age}
                required
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Save
          </button>
        </form>
      )}

      <table className="table table-bordered table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Department</th>
            <th>Age</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.firstName}</td>
              <td>{emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.department?.name || ''}</td>
              <td>{emp.age}</td>
              {isAdmin && (
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(emp)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employeelist;
