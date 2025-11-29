import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { 
  FiBook, 
  FiTrendingUp, 
  FiBarChart2, 
  FiLogOut, 
  FiAward,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiTarget,
  FiStar,
  FiDownload,
  FiFileText
} from 'react-icons/fi';
import PerformanceChart from '../components/Charts/PerformanceChart';
import GradeDistributionChart from '../components/Charts/GradeDistributionChart';
import CourseBrowser from '../components/CourseBrowser';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCourseBrowser, setShowCourseBrowser] = useState(false);

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

  const handleEnrollSuccess = () => {
    fetchStudentData();
    setShowCourseBrowser(false);
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
    const num = typeof percentage === 'number' ? percentage : parseFloat(percentage);
    if (!num || isNaN(num)) return '#6b7280';
    if (num >= 90) return '#10b981';
    if (num >= 80) return '#3b82f6';
    if (num >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    const num = typeof percentage === 'number' ? percentage : parseFloat(percentage);
    if (isNaN(num)) return 'N/A';
    return `${num.toFixed(1)}%`;
  };

  const getUpcomingAssignments = () => {
    if (!studentData) return [];
    const upcoming = studentData.assessments
      .filter(a => !a.score && a.due_date && new Date(a.due_date) > new Date())
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5);
    return upcoming;
  };

  const getRecentGrades = () => {
    if (!studentData) return [];
    return studentData.assessments
      .filter(a => a.score !== null)
      .sort((a, b) => new Date(b.graded_at || 0) - new Date(a.graded_at || 0))
      .slice(0, 5);
  };

  const getPerformanceData = () => {
    if (!studentData || !studentData.assessments) return [];
    return studentData.assessments
      .filter(a => a.score !== null && a.percentage !== null && a.percentage !== undefined)
      .map((a, idx) => {
        const percentage = typeof a.percentage === 'number' ? a.percentage : parseFloat(a.percentage);
        const avgPercentage = studentData.statistics?.average_percentage 
          ? (typeof studentData.statistics.average_percentage === 'number' 
              ? studentData.statistics.average_percentage 
              : parseFloat(studentData.statistics.average_percentage))
          : 0;
        return {
          name: `A${idx + 1}`,
          score: isNaN(percentage) ? 0 : percentage,
          average: isNaN(avgPercentage) ? 0 : avgPercentage
        };
      });
  };

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgba(99, 102, 241, 0.1)',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        margin: '0 auto 20px',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#64748b', fontSize: '1rem' }}>Loading your progress...</p>
    </div>
  );
  
  if (!studentData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
        }}>
          <FiBook size={56} color="white" />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
          Welcome, {user.first_name}!
        </h3>
        <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '32px' }}>
          Let's get you started by enrolling in your first course.
        </p>
        <button 
          onClick={() => setShowCourseBrowser(true)}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            padding: '14px 32px',
            fontSize: '1.0625rem',
            fontWeight: '600'
          }}
        >
          <FiBook size={20} style={{ marginRight: '8px' }} /> Browse Available Courses
        </button>
        {showCourseBrowser && (
          <CourseBrowser
            studentId={user.id}
            enrolledCourseIds={[]}
            onEnrollSuccess={handleEnrollSuccess}
            onClose={() => setShowCourseBrowser(false)}
          />
        )}
      </div>
    );
  }

  const upcomingAssignments = getUpcomingAssignments();
  const recentGrades = getRecentGrades();
  const performanceData = getPerformanceData();

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f5f7fa' }}>
      <div className="content-wrapper">
        {/* Header */}
        <div className="page-header" style={{
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
              gap: '12px',
              flexWrap: 'wrap'
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
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                flexShrink: 0
              }}>
                <FiBook size={28} />
              </span>
              <span>Welcome back, {user.first_name}!</span>
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>
              Track your learning progress and stay on top of your assignments
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container" style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '32px',
          borderBottom: '2px solid #e2e8f0',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: FiTrendingUp },
            { id: 'courses', label: 'My Courses', icon: FiBook },
            { id: 'assignments', label: 'Assignments', icon: FiFileText },
            { id: 'performance', label: 'Performance', icon: FiBarChart2 },
            { id: 'achievements', label: 'Achievements', icon: FiAward }
          ].map(tab => (
            <button
              key={tab.id}
              className="tab-button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #6366f1' : '3px solid transparent',
                color: activeTab === tab.id ? '#6366f1' : '#64748b',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9375rem',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                minHeight: '44px',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = '#6366f1';
                  e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = '#64748b';
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {studentData.courses.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 40px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '16px',
                border: '2px dashed #cbd5e1'
              }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  margin: '0 auto 32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
                  animation: 'pulse 2s infinite'
                }}>
                  <FiBook size={72} color="white" />
                </div>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: '#1e293b', 
                  marginBottom: '16px' 
                }}>
                  Welcome to Your Learning Dashboard!
                </h2>
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: '#64748b', 
                  marginBottom: '40px',
                  maxWidth: '600px',
                  margin: '0 auto 40px',
                  lineHeight: '1.7'
                }}>
                  Get started by browsing and enrolling in courses. Once enrolled, you'll be able to 
                  track your assignments, view grades, monitor your performance, and achieve your learning goals.
                </p>
                <button 
                  onClick={() => setShowCourseBrowser(true)}
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                    padding: '16px 40px',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '40px'
                  }}
                >
                  <FiBook size={22} style={{ marginRight: '10px' }} /> Browse & Enroll in Courses
                </button>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '20px',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  {[
                    { icon: FiBook, title: 'Enroll in Courses', desc: 'Browse and join courses' },
                    { icon: FiFileText, title: 'Track Assignments', desc: 'View and complete tasks' },
                    { icon: FiBarChart2, title: 'Monitor Progress', desc: 'See your performance' },
                    { icon: FiAward, title: 'Achieve Goals', desc: 'Track your achievements' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      padding: '24px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px'
                      }}>
                        <item.icon size={24} color="#6366f1" />
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Statistics Cards */}
                <div className="stats-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                  gap: '20px',
                  marginBottom: '32px'
                }}>
              <div className="stats-card" style={{ 
                padding: '24px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                borderRadius: '16px', 
                color: 'white',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="stat-label" style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Total Courses</div>
                <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {studentData.courses.length}
                </div>
              </div>
              <div className="stats-card" style={{ 
                padding: '24px', 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                borderRadius: '16px', 
                color: 'white',
                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.3)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="stat-label" style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Completed</div>
                <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {studentData.statistics?.graded_assessments || 0}/{studentData.statistics?.total_assessments || 0}
                </div>
              </div>
              <div className="stats-card" style={{ 
                padding: '24px', 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                borderRadius: '16px', 
                color: 'white',
                boxShadow: '0 8px 20px rgba(79, 172, 254, 0.3)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="stat-label" style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Average Score</div>
                <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {formatPercentage(studentData.statistics.average_percentage)}
                </div>
              </div>
              <div className="stats-card" style={{ 
                padding: '24px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                borderRadius: '16px', 
                color: 'white',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="stat-label" style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Upcoming</div>
                <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {upcomingAssignments.length}
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="two-column" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              {/* Upcoming Assignments */}
              <div className="card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <FiClock size={24} color="#6366f1" />
                  Upcoming Assignments
                </h2>
                {upcomingAssignments.length === 0 ? (
                  <p className="empty" style={{ padding: '40px' }}>No upcoming assignments</p>
                ) : (
                  <ul className="todo-list" style={{ margin: 0, padding: 0 }}>
                    {upcomingAssignments.map(assignment => (
                      <li key={assignment.id} style={{ marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <strong>{assignment.title}</strong>
                          <p style={{ fontSize: '0.875rem', margin: '4px 0' }}>{assignment.course_name}</p>
                          <div className="meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiCalendar size={14} />
                            <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                              Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Recent Grades */}
              <div className="card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <FiCheckCircle size={24} color="#6366f1" />
                  Recent Grades
                </h2>
                {recentGrades.length === 0 ? (
                  <p className="empty" style={{ padding: '40px' }}>No grades yet</p>
                ) : (
                  <ul className="todo-list" style={{ margin: 0, padding: 0 }}>
                    {recentGrades.map(grade => (
                      <li key={grade.id} style={{ marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <strong>{grade.title}</strong>
                          <p style={{ fontSize: '0.875rem', margin: '4px 0' }}>{grade.course_name}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                              {grade.score} / {grade.max_score}
                            </span>
                            <span style={{ 
                              color: getGradeColor(grade.percentage), 
                              fontWeight: 'bold', 
                              fontSize: '1.125rem' 
                            }}>
                              {formatPercentage(grade.percentage)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Performance Chart */}
            {performanceData.length > 0 && (
              <div className="card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <FiBarChart2 size={24} color="#6366f1" />
                  Performance Trend
                </h2>
                <PerformanceChart data={performanceData} type="line" />
              </div>
            )}
              </>
            )}
          </>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                <FiBook size={24} color="#6366f1" />
                My Courses
              </h2>
              <button 
                onClick={() => setShowCourseBrowser(true)}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                <FiBook size={18} style={{ marginRight: '8px' }} /> Browse More Courses
              </button>
            </div>
            {studentData.courses.length === 0 ? (
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
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
                }}>
                  <FiBook size={56} color="white" />
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: '#1e293b', 
                  marginBottom: '12px' 
                }}>
                  No Courses Yet
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#64748b', 
                  marginBottom: '32px',
                  maxWidth: '500px',
                  margin: '0 auto 32px'
                }}>
                  Browse available courses and enroll to start tracking your learning progress, 
                  view assignments, and see your grades.
                </p>
                <button 
                  onClick={() => setShowCourseBrowser(true)}
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    padding: '14px 32px',
                    fontSize: '1.0625rem',
                    fontWeight: '600'
                  }}
                >
                  <FiBook size={20} style={{ marginRight: '8px' }} /> Browse Available Courses
                </button>
              </div>
            ) : (
              <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {studentData.courses.map(course => {
                  const courseAssessments = studentData.assessments.filter(a => a.course_id === course.id);
                  const completed = courseAssessments.filter(a => a.score !== null).length;
                  const total = courseAssessments.length;
                  const avgScore = completed > 0
                    ? courseAssessments.filter(a => a.score !== null)
                        .reduce((sum, a) => {
                          const pct = typeof a.percentage === 'number' ? a.percentage : parseFloat(a.percentage) || 0;
                          return sum + (isNaN(pct) ? 0 : pct);
                        }, 0) / completed
                    : 0;

                  return (
                    <div key={course.id} className="card" style={{
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'var(--shadow)';
                    }}
                    onClick={() => fetchCourseProgress(course.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <strong style={{ fontSize: '1.125rem', display: 'block', marginBottom: '4px' }}>
                            {course.name}
                          </strong>
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{course.code}</span>
                        </div>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}>
                          {avgScore > 0 && !isNaN(avgScore) ? Math.round(avgScore) : '—'}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '12px 0' }}>
                        {course.description || 'No description'}
                      </p>
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Progress</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6366f1' }}>
                            {completed} / {total} completed
                          </span>
                        </div>
                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchCourseProgress(course.id);
                        }}
                        className="btn"
                        style={{
                          width: '100%',
                          marginTop: '16px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}
                      >
                        <FiBarChart2 size={18} /> View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <FiTarget size={24} color="#6366f1" />
              All Assignments
            </h2>
            {studentData.assessments.length === 0 ? (
              <p className="empty">No assignments yet.</p>
            ) : (
              <ul className="todo-list">
                {studentData.assessments.map(assessment => (
                  <li key={assessment.id}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <strong>{assessment.title}</strong>
                        <span className="badge" style={{
                          background: assessment.score !== null ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: assessment.score !== null ? '#10b981' : '#f59e0b',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {assessment.score !== null ? (
                            <><FiCheckCircle size={12} style={{ marginRight: '4px' }} />Completed</>
                          ) : (
                            <><FiClock size={12} style={{ marginRight: '4px' }} />Pending</>
                          )}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0' }}>
                        {assessment.course_name} • {assessment.assessment_type}
                      </p>
                      <div className="meta" style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiTarget size={14} /> Max: {assessment.max_score}
                        </span>
                        {assessment.due_date && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: assessment.score === null && new Date(assessment.due_date) < new Date() ? '#ef4444' : '#64748b' }}>
                            <FiCalendar size={14} /> Due: {new Date(assessment.due_date).toLocaleDateString()}
                          </span>
                        )}
                        {assessment.score !== null && (
                          <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            color: getGradeColor(assessment.percentage),
                            fontWeight: '600'
                          }}>
                            <FiStar size={14} /> {formatPercentage(assessment.percentage)}
                          </span>
                        )}
                      </div>
                      {assessment.score !== null && (
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '12px', 
                          background: '#f8fafc', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '600' }}>Score: <strong>{assessment.score}</strong> / {assessment.max_score}</span>
                            <span style={{ 
                              color: getGradeColor(assessment.percentage), 
                              fontWeight: 'bold', 
                              fontSize: '1.25rem' 
                            }}>
                              {formatPercentage(assessment.percentage)}
                            </span>
                          </div>
                          {assessment.feedback && (
                            <div style={{ 
                              marginTop: '8px', 
                              padding: '8px', 
                              background: 'white', 
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              color: '#475569'
                            }}>
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
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <>
            <div className="two-column" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div className="card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <FiBarChart2 size={24} color="#6366f1" />
                  Performance Trends
                </h2>
                {performanceData.length > 0 ? (
                  <PerformanceChart data={performanceData} type="line" />
                ) : (
                  <p className="empty" style={{ padding: '40px' }}>No performance data yet</p>
                )}
              </div>
              <div className="card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <FiTarget size={24} color="#6366f1" />
                  Grade Distribution
                </h2>
                {performanceData.length > 0 ? (
                  <GradeDistributionChart data={studentData.assessments.filter(a => a.score !== null)} />
                ) : (
                  <p className="empty" style={{ padding: '40px' }}>No grade data yet</p>
                )}
              </div>
            </div>

            {/* Course-wise Performance */}
            <div className="card">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <FiBook size={24} color="#6366f1" />
                Performance by Course
              </h2>
              <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {studentData.courses.map(course => {
                  const courseAssessments = studentData.assessments.filter(a => a.course_id === course.id);
                  const graded = courseAssessments.filter(a => a.score !== null);
                  const avgPercentage = graded.length > 0
                    ? graded.reduce((sum, a) => {
                        const pct = typeof a.percentage === 'number' ? a.percentage : parseFloat(a.percentage) || 0;
                        return sum + (isNaN(pct) ? 0 : pct);
                      }, 0) / graded.length
                    : null;

                  return (
                    <div key={course.id} style={{
                      padding: '20px',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>{course.name}</strong>
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Average</span>
                          <span style={{ 
                            fontWeight: 'bold',
                            color: getGradeColor(avgPercentage),
                            fontSize: '1.125rem'
                          }}>
                            {formatPercentage(avgPercentage)}
                          </span>
                        </div>
                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(() => {
                              if (!avgPercentage) return 0;
                              const pct = typeof avgPercentage === 'number' ? avgPercentage : parseFloat(avgPercentage) || 0;
                              return isNaN(pct) ? 0 : Math.max(0, Math.min(100, pct));
                            })()}%`,
                            background: getGradeColor(avgPercentage),
                            transition: 'width 0.3s'
                          }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
                          {graded.length} of {courseAssessments.length} assessments graded
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <FiAward size={24} color="#6366f1" />
              Achievements & Progress
            </h2>
            <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Achievement Cards */}
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                color: 'white'
              }}>
                <FiAward size={32} style={{ marginBottom: '12px' }} />
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Course Master</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Completed {studentData.courses.length} course{studentData.courses.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '16px',
                color: 'white'
              }}>
                <FiCheckCircle size={32} style={{ marginBottom: '12px' }} />
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Assignment Champion</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Completed {studentData.statistics.graded_assessments} assignment{studentData.statistics.graded_assessments !== 1 ? 's' : ''}
                </div>
              </div>
              {studentData.statistics?.average_percentage && typeof studentData.statistics.average_percentage === 'number' && studentData.statistics.average_percentage >= 90 && (
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '16px',
                  color: 'white'
                }}>
                  <FiStar size={32} style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Honor Student</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    Maintained {formatPercentage(studentData.statistics.average_percentage)} average
                  </div>
                </div>
              )}
              {studentData.statistics?.average_percentage && typeof studentData.statistics.average_percentage === 'number' && studentData.statistics.average_percentage >= 80 && studentData.statistics.average_percentage < 90 && (
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '16px',
                  color: 'white'
                }}>
                  <FiStar size={32} style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Excellent Performance</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    Average score: {formatPercentage(studentData.statistics.average_percentage)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
            <div className="card modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto', position: 'relative', width: '100%' }}>
              <button
                onClick={() => { setSelectedCourse(null); setCourseProgress(null); }}
                style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  right: '16px', 
                  background: '#ef4444', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '36px', 
                  height: '36px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
              >
                ×
              </button>
              <h2 style={{ marginBottom: '24px' }}>{courseProgress.course.name} - Detailed Progress</h2>

              {/* Assessments */}
              <div style={{ marginTop: '24px' }}>
                <h3>Assessments</h3>
                {courseProgress.assessments.length === 0 ? (
                  <p>No assessments yet.</p>
                ) : (
                  <ul className="todo-list" style={{ marginTop: '16px' }}>
                    {courseProgress.assessments.map(assessment => (
                      <li key={assessment.id}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <strong>{assessment.title}</strong>
                            <span className="badge" style={{
                              background: assessment.score !== null ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              color: assessment.score !== null ? '#10b981' : '#f59e0b'
                            }}>
                              {assessment.assessment_type}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0' }}>
                            {assessment.description || 'No description'}
                          </p>
                          <div className="meta" style={{ marginTop: '8px' }}>
                            Max Score: {assessment.max_score}
                            {assessment.due_date && ` • Due: ${new Date(assessment.due_date).toLocaleDateString()}`}
                          </div>
                          {assessment.score !== null && (
                            <div style={{ 
                              marginTop: '12px', 
                              padding: '16px', 
                              background: '#f8fafc', 
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: '600' }}>Score: <strong>{assessment.score}</strong> / {assessment.max_score}</span>
                                <span style={{ 
                                  color: getGradeColor(assessment.percentage), 
                                  fontWeight: 'bold', 
                                  fontSize: '1.5rem' 
                                }}>
                                  {formatPercentage(assessment.percentage)}
                                </span>
                              </div>
                              {assessment.feedback && (
                                <div style={{ 
                                  marginTop: '12px', 
                                  padding: '12px', 
                                  background: 'white', 
                                  borderRadius: '8px',
                                  fontSize: '0.875rem',
                                  color: '#475569',
                                  borderLeft: '4px solid #6366f1'
                                }}>
                                  <strong>Teacher Feedback:</strong>
                                  <div style={{ marginTop: '4px' }}>{assessment.feedback}</div>
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
              {courseProgress.learning_outcomes && courseProgress.learning_outcomes.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h3>Learning Outcomes Progress</h3>
                  <ul className="todo-list" style={{ marginTop: '16px' }}>
                    {courseProgress.learning_outcomes.map(outcome => (
                      <li key={outcome.id}>
                        <div style={{ flex: 1 }}>
                          <strong>{outcome.title}</strong>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0' }}>
                            {outcome.description || 'No description'}
                          </p>
                          <div style={{ marginTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Average Performance</span>
                              <span style={{ 
                                color: getGradeColor(outcome.average_percentage), 
                                fontWeight: 'bold',
                                fontSize: '1.125rem'
                              }}>
                                {formatPercentage(outcome.average_percentage)}
                              </span>
                            </div>
                            <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${outcome.average_percentage || 0}%`,
                                background: getGradeColor(outcome.average_percentage),
                                transition: 'width 0.3s'
                              }} />
                            </div>
                            <div className="meta" style={{ marginTop: '8px', fontSize: '0.75rem' }}>
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

        {/* Course Browser Modal */}
        {showCourseBrowser && (
          <CourseBrowser
            studentId={user.id}
            enrolledCourseIds={studentData.courses.map(c => c.id)}
            onEnrollSuccess={handleEnrollSuccess}
            onClose={() => setShowCourseBrowser(false)}
          />
        )}
      </div>
    </div>
  );
}
