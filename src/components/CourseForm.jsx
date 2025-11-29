import React, { useState, useEffect } from 'react';
import API from '../api';
import { useTheme } from '../context/ThemeContext';
import { FiX } from 'react-icons/fi';

export default function CourseForm({ course, onClose, onSuccess, teacherId }) {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || '',
        code: course.code || '',
        description: course.description || ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (course) {
        await API.put(`/courses/${course.id}`, formData);
      } else {
        await API.post('/courses', { ...formData, teacher_id: teacherId });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card modal-content" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            background: '#ef4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '44px',
            minHeight: '44px',
            zIndex: 10
          }}
          aria-label="Close"
        >
          <FiX size={20} />
        </button>
        <h2>{course ? 'Edit Course' : 'Create New Course'}</h2>
        
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
            Course Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Introduction to Computer Science"
            />
          </label>
          
          <label>
            Course Code
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="e.g., CS101"
            />
          </label>
          
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Course description..."
            />
          </label>
          
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : course ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

