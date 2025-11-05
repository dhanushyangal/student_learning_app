import React, { useState, useEffect } from 'react';
import API from '../api';
import { FiX } from 'react-icons/fi';

export default function AssessmentForm({ assessment, courses, onClose, onSuccess, teacherId }) {
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    assessment_type: 'quiz',
    max_score: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (assessment) {
      setFormData({
        course_id: assessment.course_id || '',
        title: assessment.title || '',
        description: assessment.description || '',
        assessment_type: assessment.assessment_type || 'quiz',
        max_score: assessment.max_score || '',
        due_date: assessment.due_date ? assessment.due_date.split('T')[0] : ''
      });
    } else if (courses.length > 0) {
      setFormData({ ...formData, course_id: courses[0].id });
    }
  }, [assessment, courses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        max_score: parseFloat(formData.max_score),
        created_by: teacherId
      };
      
      if (assessment) {
        await API.put(`/assessments/${assessment.id}`, payload);
      } else {
        await API.post('/assessments', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save assessment');
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
      <div className="card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
        >
          <FiX />
        </button>
        <h2>{assessment ? 'Edit Assessment' : 'Create New Assessment'}</h2>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '15px', padding: '10px', background: '#fee', borderRadius: '8px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="form">
          <label>
            Course
            <select
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #e6e9ef', fontSize: '0.95rem', background: 'white' }}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </label>
          
          <label>
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Midterm Exam"
            />
          </label>
          
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Assessment description..."
            />
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label>
              Type
              <select
                name="assessment_type"
                value={formData.assessment_type}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #e6e9ef', fontSize: '0.95rem', background: 'white' }}
              >
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
                <option value="project">Project</option>
                <option value="participation">Participation</option>
              </select>
            </label>
            
            <label>
              Max Score
              <input
                type="number"
                name="max_score"
                value={formData.max_score}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="100"
              />
            </label>
          </div>
          
          <label>
            Due Date (Optional)
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </label>
          
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : assessment ? 'Update' : 'Create'}
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

