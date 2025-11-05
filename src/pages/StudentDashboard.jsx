import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { FiBook, FiTrendingUp, FiBarChart2, FiLogOut, FiAward } from 'react-icons/fi';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const res = await API.get(`/students/${user.id}`);
      setStudentData(res.data);
    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseProgress = async (courseId) => {
    try {
      const res = await API.get(`/students/${user.id}/courses/${courseId}`);
      setCourseProgress(res.data);
      setSelectedCourse(courseId);
    } catch (err) {
      console.error('Error fetching course progress:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getGradeColor = (percentage) => {
    if (!percentage) return '#6b7280';
    if (percentage >= 90) return '#10b981';
    if (percentage >= 80) return '#3b82f6';
    if (percentage >= 70) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) return <div className="card"><p>Loading...</p></div>;
  if (!studentData) return <div className="card"><p>No data available</p></div>;

  return (
    <div>
      <header>
        <h1>
          <span className="logo"><FiBook size={20} /></span>
          Student Dashboard - {user.first_name} {user.last_name}
        </h1>
        <nav>
          <button onClick={handleLogout} className="btn ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiLogOut /> Logout
          </button>
        </nav>
      </header>

      {/* Overall Statistics */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiTrendingUp /> Overall Performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Courses</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{studentData.courses.length}</div>
          </div>
          <div style={{ padding: '15px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '8px', color: 'white' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Assessments</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {studentData.statistics.graded_assessments}/{studentData.statistics.total_assessments}
            </div>
          </div>
          <div style={{ padding: '15px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '8px', color: 'white' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Average Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {studentData.statistics.average_percentage ? `${studentData.statistics.average_percentage.toFixed(1)}%` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiBook /> My Courses
        </h2>
        {studentData.courses.length === 0 ? (
          <p className="empty">You are not enrolled in any courses yet.</p>
        ) : (
          <ul className="todo-list">
            {studentData.courses.map(course => (
              <li key={course.id}>
                <div style={{ flex: 1 }}>
                  <strong>{course.name} ({course.code})</strong>
                  <p>{course.description || 'No description'}</p>
                  <div className="meta">
                    Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="actions">
                  <button onClick={() => fetchCourseProgress(course.id)} className="btn">
                    <FiBarChart2 /> View Progress
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Course Progress Modal */}
      {selectedCourse && courseProgress && (
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
          <div className="card" style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
            <button
              onClick={() => { setSelectedCourse(null); setCourseProgress(null); }}
              style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
            >
              ×
            </button>
            <h2>{courseProgress.course.name} - Progress</h2>

            {/* Assessments */}
            <div style={{ marginTop: '20px' }}>
              <h3>Assessments</h3>
              {courseProgress.assessments.length === 0 ? (
                <p>No assessments yet.</p>
              ) : (
                <ul className="todo-list">
                  {courseProgress.assessments.map(assessment => (
                    <li key={assessment.id}>
                      <div style={{ flex: 1 }}>
                        <strong>{assessment.title}</strong>
                        <p>{assessment.description || 'No description'}</p>
                        <div className="meta">
                          {assessment.assessment_type} • Max: {assessment.max_score}
                          {assessment.due_date && ` • Due: ${new Date(assessment.due_date).toLocaleDateString()}`}
                        </div>
                        {assessment.score !== null && (
                          <div style={{ marginTop: '10px', padding: '10px', background: '#f3f4f6', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>Score: <strong>{assessment.score}</strong> / {assessment.max_score}</span>
                              <span style={{ color: getGradeColor(assessment.percentage), fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {assessment.percentage?.toFixed(1)}%
                              </span>
                            </div>
                            {assessment.feedback && (
                              <div style={{ marginTop: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                <strong>Feedback:</strong> {assessment.feedback}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Learning Outcomes */}
            {courseProgress.learning_outcomes.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3>Learning Outcomes Progress</h3>
                <ul className="todo-list">
                  {courseProgress.learning_outcomes.map(outcome => (
                    <li key={outcome.id}>
                      <div style={{ flex: 1 }}>
                        <strong>{outcome.title}</strong>
                        <p>{outcome.description || 'No description'}</p>
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span>Average Performance</span>
                            <span style={{ color: getGradeColor(outcome.average_percentage), fontWeight: 'bold' }}>
                              {outcome.average_percentage ? `${outcome.average_percentage.toFixed(1)}%` : 'N/A'}
                            </span>
                          </div>
                          <div style={{ height: '8px', background: '#e6e9ef', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${outcome.average_percentage || 0}%`,
                              background: getGradeColor(outcome.average_percentage),
                              transition: 'width 0.3s'
                            }} />
                          </div>
                          <div className="meta" style={{ marginTop: '5px' }}>
                            {outcome.assessments_count} assessment(s) evaluated
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

