import React, { useState, useEffect } from 'react';
import API from '../api';
import { FiBook, FiUser, FiUsers, FiSearch, FiCheckCircle, FiX } from 'react-icons/fi';

export default function CourseBrowser({ studentId, enrolledCourseIds = [], onEnrollSuccess, onClose }) {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get('/courses');
      // Filter out courses the student is already enrolled in
      const filtered = res.data.filter(course => !enrolledCourseIds.includes(course.id));
      setAvailableCourses(filtered);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      setError('');
      await API.post(`/courses/${courseId}/enroll`, { student_id: studentId });
      // Remove enrolled course from list
      setAvailableCourses(prev => prev.filter(c => c.id !== courseId));
      if (onEnrollSuccess) {
        onEnrollSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enroll in course');
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(null);
    }
  };

  const filteredCourses = availableCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (onClose) {
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
        <div className="card modal-content" style={{ 
          maxWidth: '900px', 
          width: '100%', 
          maxHeight: '90vh', 
          overflow: 'auto',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              background: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: '44px', 
              height: '44px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
              minWidth: '44px',
              minHeight: '44px',
              zIndex: 10
            }}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
          <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiBook size={28} color="#6366f1" />
            Browse Available Courses
          </h2>
          {error && (
            <div style={{ 
              color: '#ef4444', 
              marginBottom: '16px', 
              padding: '12px', 
              background: '#fee', 
              borderRadius: '8px' 
            }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <FiSearch style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8' 
            }} />
            <input
              type="text"
              placeholder="Search courses by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(99, 102, 241, 0.1)',
                borderTop: '4px solid #6366f1',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 0.8s linear infinite'
              }} />
              <p style={{ color: '#64748b' }}>Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px'
            }}>
              <FiBook size={64} color="#cbd5e1" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: '#64748b', marginBottom: '8px' }}>
                {searchTerm ? 'No courses found' : 'No available courses'}
              </h3>
              <p style={{ color: '#94a3b8' }}>
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'All courses are currently enrolled or no courses are available yet.'}
              </p>
            </div>
          ) : (
            <div className="courses-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '20px' 
            }}>
              {filteredCourses.map(course => (
                <div key={course.id} style={{
                  padding: '24px',
                  background: 'white',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        marginBottom: '4px' 
                      }}>
                        {course.name}
                      </h3>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6366f1', 
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        {course.code}
                      </p>
                    </div>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      <FiBook size={28} />
                    </div>
                  </div>
                  
                  {course.description && (
                    <p style={{ 
                      fontSize: '0.9375rem', 
                      color: '#64748b', 
                      marginBottom: '16px',
                      lineHeight: '1.6'
                    }}>
                      {course.description}
                    </p>
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    marginBottom: '20px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiUser size={16} color="#6366f1" />
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {course.teacher_first_name} {course.teacher_last_name}
                      </span>
                    </div>
                    {course.enrolled_students !== undefined && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiUsers size={16} color="#6366f1" />
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {course.enrolled_students} enrolled
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling === course.id}
                    className="btn"
                    style={{
                      width: '100%',
                      background: enrolling === course.id 
                        ? '#cbd5e1' 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: enrolling === course.id ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                      padding: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: enrolling === course.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {enrolling === course.id ? (
                      <>Enrolling...</>
                    ) : (
                      <>
                        <FiCheckCircle size={18} style={{ marginRight: '8px' }} />
                        Enroll in Course
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline version (for use in dashboard)
  return (
    <div>
      {error && (
        <div style={{ 
          color: '#ef4444', 
          marginBottom: '16px', 
          padding: '12px', 
          background: '#fee', 
          borderRadius: '8px' 
        }}>
          {error}
        </div>
      )}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <FiSearch style={{ 
          position: 'absolute', 
          left: '16px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          color: '#94a3b8' 
        }} />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 48px',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            fontSize: '1rem'
          }}
        />
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(99, 102, 241, 0.1)',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      ) : filteredCourses.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          {searchTerm ? 'No courses found' : 'No available courses'}
        </p>
      ) : (
        <div className="courses-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredCourses.map(course => (
            <div key={course.id} className="card" style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '8px' }}>{course.name}</h3>
              <p style={{ color: '#6366f1', fontWeight: '600', marginBottom: '12px' }}>{course.code}</p>
              {course.description && <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>{course.description}</p>}
              <button
                onClick={() => handleEnroll(course.id)}
                disabled={enrolling === course.id}
                className="btn"
                style={{ width: '100%' }}
              >
                {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

