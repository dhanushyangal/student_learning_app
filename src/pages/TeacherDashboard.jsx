import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { FiPlus, FiBook, FiFileText, FiUsers, FiBarChart2, FiEdit2, FiTrash2, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import CourseForm from '../components/CourseForm';
import AssessmentForm from '../components/AssessmentForm';
import CourseReport from '../components/CourseReport';
import GradeAssessment from '../components/GradeAssessment';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentToGrade, setAssessmentToGrade] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [coursesRes, assessmentsRes] = await Promise.all([
        API.get(`/courses?teacher_id=${user.id}`),
        API.get(`/assessments`)
      ]);
      setCourses(coursesRes.data);
      setAssessments(assessmentsRes.data.filter(a => a.created_by === user.id));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return (
    <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgba(99, 102, 241, 0.1)',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        margin: '0 auto 20px',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#64748b', fontSize: '1rem' }}>Loading your dashboard...</p>
    </div>
  );

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f5f7fa' }}>
      <div className="content-wrapper">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingTop: '24px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              margin: '0 0 8px 0',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}>
                <FiBook size={28} />
              </span>
              Teacher Dashboard
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>
              Welcome, {user.first_name} {user.last_name} • Manage your courses and students
            </p>
          </div>
        </div>

      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '32px', 
        paddingBottom: '16px',
        borderBottom: '2px solid rgba(99, 102, 241, 0.1)',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('courses')}
          className={activeTab === 'courses' ? 'btn' : 'btn ghost'}
          style={{ 
            borderRadius: '12px',
            padding: '12px 24px',
            borderBottom: 'none',
            position: 'relative',
            ...(activeTab === 'courses' && {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            })
          }}
        >
          <FiBook size={18} /> Courses
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={activeTab === 'assessments' ? 'btn' : 'btn ghost'}
          style={{ 
            borderRadius: '12px',
            padding: '12px 24px',
            borderBottom: 'none',
            ...(activeTab === 'assessments' && {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            })
          }}
        >
          <FiFileText size={18} /> Assessments
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={activeTab === 'reports' ? 'btn' : 'btn ghost'}
          style={{ 
            borderRadius: '12px',
            padding: '12px 24px',
            borderBottom: 'none',
            ...(activeTab === 'reports' && {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            })
          }}
        >
          <FiBarChart2 size={18} /> Reports
        </button>
      </div>

      {activeTab === 'courses' && (
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiBook size={24} color="#6366f1" />
              My Courses
            </h2>
            <button 
              onClick={() => { setShowCourseForm(true); setSelectedCourse(null); }} 
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              <FiPlus size={18} /> New Course
            </button>
          </div>

          {courses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px',
              border: '2px dashed #cbd5e1'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
              }}>
                <FiBook size={56} color="white" />
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#1e293b', 
                marginBottom: '12px' 
              }}>
                Welcome to Your Dashboard!
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                color: '#64748b', 
                marginBottom: '32px',
                maxWidth: '500px',
                margin: '0 auto 32px'
              }}>
                Get started by creating your first course. You'll be able to manage students, 
                create assessments, and track learning outcomes.
              </p>
              <button 
                onClick={() => { setShowCourseForm(true); setSelectedCourse(null); }} 
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  padding: '14px 32px',
                  fontSize: '1.0625rem',
                  fontWeight: '600'
                }}
              >
                <FiPlus size={20} style={{ marginRight: '8px' }} /> Create Your First Course
              </button>
              <div style={{ 
                marginTop: '40px', 
                padding: '24px', 
                background: 'white', 
                borderRadius: '12px',
                textAlign: 'left',
                maxWidth: '600px',
                margin: '40px auto 0'
              }}>
                <h4 style={{ color: '#1e293b', marginBottom: '16px', fontSize: '1.125rem' }}>
                  Quick Start Guide:
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  display: 'grid',
                  gap: '12px'
                }}>
                  {[
                    { icon: FiBook, text: 'Create courses for your subjects' },
                    { icon: FiFileText, text: 'Add assessments and assignments' },
                    { icon: FiUsers, text: 'Enroll students and track progress' },
                    { icon: FiBarChart2, text: 'View detailed reports and analytics' }
                  ].map((item, idx) => (
                    <li key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      color: '#475569'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <item.icon size={18} color="#6366f1" />
                      </div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <ul className="todo-list">
              {courses.map(course => (
                <li key={course.id}>
                  <div style={{ flex: 1 }}>
                    <strong>{course.name} ({course.code})</strong>
                    <p>{course.description || 'No description'}</p>
                    <div className="meta" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: 'rgba(99, 102, 241, 0.05)',
                      borderRadius: '8px',
                      width: 'fit-content'
                    }}>
                      <FiUsers size={16} /> 
                      <span style={{ fontWeight: '600', color: '#6366f1' }}>
                        {course.enrolled_students || 0} students enrolled
                      </span>
                    </div>
                  </div>
                  <div className="actions">
                    <button onClick={() => { setSelectedCourse(course); setShowCourseForm(true); }} className="btn icon">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => { setSelectedCourse(course); setActiveTab('reports'); }} className="btn icon">
                      <FiBarChart2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Assessments</h2>
            <button onClick={() => { setShowAssessmentForm(true); setSelectedAssessment(null); }} className="btn">
              <FiPlus /> New Assessment
            </button>
          </div>

          {assessments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px',
              border: '2px dashed #cbd5e1'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(245, 87, 108, 0.3)'
              }}>
                <FiFileText size={48} color="white" />
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#1e293b', 
                marginBottom: '12px' 
              }}>
                No Assessments Yet
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                color: '#64748b', 
                marginBottom: '32px',
                maxWidth: '500px',
                margin: '0 auto 32px'
              }}>
                {courses.length === 0 
                  ? 'Create a course first, then add assessments to track student progress.'
                  : 'Create assessments for your courses to evaluate student learning and track outcomes.'}
              </p>
              {courses.length > 0 ? (
                <button 
                  onClick={() => { setShowAssessmentForm(true); setSelectedAssessment(null); }} 
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
                    padding: '14px 32px',
                    fontSize: '1.0625rem',
                    fontWeight: '600'
                  }}
                >
                  <FiPlus size={20} style={{ marginRight: '8px' }} /> Create Your First Assessment
                </button>
              ) : (
                <button 
                  onClick={() => { setActiveTab('courses'); setShowCourseForm(true); }} 
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    padding: '14px 32px',
                    fontSize: '1.0625rem',
                    fontWeight: '600'
                  }}
                >
                  <FiBook size={20} style={{ marginRight: '8px' }} /> Create a Course First
                </button>
              )}
            </div>
          ) : (
            <ul className="todo-list">
              {assessments.map(assessment => (
                <li key={assessment.id}>
                  <div style={{ flex: 1 }}>
                    <strong>{assessment.title}</strong>
                    <p>{assessment.description || 'No description'}</p>
                    <div className="meta">
                      {assessment.course_name} • {assessment.assessment_type} • Max Score: {assessment.max_score}
                      {assessment.due_date && ` • Due: ${new Date(assessment.due_date).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="actions">
                    <button onClick={() => { setAssessmentToGrade(assessment); setShowGradeForm(true); }} className="btn icon" title="Grade Students">
                      <FiCheckCircle />
                    </button>
                    <button onClick={() => { setSelectedAssessment(assessment); setShowAssessmentForm(true); }} className="btn icon">
                      <FiEdit2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <CourseReport courses={courses} />
      )}

      {showCourseForm && (
        <CourseForm
          course={selectedCourse}
          onClose={() => { setShowCourseForm(false); setSelectedCourse(null); }}
          onSuccess={() => { setShowCourseForm(false); fetchData(); }}
          teacherId={user.id}
        />
      )}

      {showAssessmentForm && (
        <AssessmentForm
          assessment={selectedAssessment}
          courses={courses}
          onClose={() => { setShowAssessmentForm(false); setSelectedAssessment(null); }}
          onSuccess={() => { setShowAssessmentForm(false); fetchData(); }}
          teacherId={user.id}
        />
      )}

      {showGradeForm && assessmentToGrade && (
        <GradeAssessment
          assessment={assessmentToGrade}
          onClose={() => { setShowGradeForm(false); setAssessmentToGrade(null); }}
          onSuccess={() => { setShowGradeForm(false); setAssessmentToGrade(null); fetchData(); }}
        />
      )}
      </div>
    </div>
  );
}

