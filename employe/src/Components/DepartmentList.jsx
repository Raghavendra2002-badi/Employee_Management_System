import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance.jsx';
import { getUserRoles } from '../utils/auth.jsx';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setRoles(getUserRoles());
  }, []);

  const isAdmin = roles.includes('ROLE_ADMIN');

  useEffect(() => {
    if (roles.length && (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_USER'))) {
      fetchDepartments();
    }
  }, [roles]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch departments', err.response || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await axios.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error('Delete failed', err.response || err.message);
    }
  };

  const handleEdit = (dept) => {
    if (!isAdmin) return;
    setFormData({ name: dept.name });
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    if (!isAdmin) return;
    setFormData({ name: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      if (editingId) {
        await axios.put(`/departments/${editingId}`, formData);
      } else {
        await axios.post('/departments', formData);
      }
      setShowForm(false);
      fetchDepartments();
    } catch (err) {
      console.error('Save failed', err.response || err.message);
    }
  };

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Departments</h2>
      <p>Manage all your organization’s departments</p>

      <div className="top-bar d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by department name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={!roles.length}
        />
        {isAdmin && (
          <button className="btn btn-success" onClick={handleAddNew}>
            Add New Department
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form className="border p-3 mb-4 bg-light rounded shadow-sm" onSubmit={handleSubmit}>
          <h5>{editingId ? 'Edit Department' : 'Add New Department'}</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Department Name"
                value={formData.name}
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="col-md-2 mb-2">
              <button type="submit" className="btn btn-primary w-100">
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.id}</td>
              <td>{dept.name}</td>
              {isAdmin && (
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(dept)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dept.id)}>
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

export default DepartmentList;
