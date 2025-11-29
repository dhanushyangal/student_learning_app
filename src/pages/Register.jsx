import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api';
import { FiUserPlus, FiUser, FiMail, FiLock, FiBook } from 'react-icons/fi';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/register', formData);
      login(res.data);
      
      if (res.data.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '40px auto', padding: '24px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span className="logo"><FiUserPlus size={20} /></span>
        Register
      </h2>
      
      {error && <div className="error-message" style={{ 
        color: darkMode ? '#fca5a5' : '#ef4444', 
        marginBottom: '15px', 
        padding: '10px', 
        background: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee', 
        borderRadius: '8px',
        border: darkMode ? '1px solid rgba(239, 68, 68, 0.3)' : 'none'
      }}>{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        <label>
          <span className="form-icon"><FiUser /></span>
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
          />
        </label>
        
        <label>
          <span className="form-icon"><FiUser /></span>
          First Name
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            placeholder="First name"
          />
        </label>
        
        <label>
          <span className="form-icon"><FiUser /></span>
          Last Name
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            placeholder="Last name"
          />
        </label>
        
        <label>
          <span className="form-icon"><FiMail /></span>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
          />
        </label>
        
        <label>
          <span className="form-icon"><FiLock /></span>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Choose a password"
            minLength="6"
          />
        </label>
        
        <label>
          <span className="form-icon"><FiBook /></span>
          Role
          <select name="role" value={formData.role} onChange={handleChange} className="form select" style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', fontSize: '0.95rem' }}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>
        
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <button type="button" onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

