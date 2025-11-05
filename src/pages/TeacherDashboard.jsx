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

  if (loading) return <div className="card"><p>Loading...</p></div>;

  return (
    <div>
      <header>
        <h1>
          <span className="logo"><FiBook size={20} /></span>
          Teacher Dashboard - {user.first_name} {user.last_name}
        </h1>
        <nav>
          <button onClick={handleLogout} className="btn ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiLogOut /> Logout
          </button>
        </nav>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e6e9ef' }}>
        <button
          onClick={() => setActiveTab('courses')}
          className={activeTab === 'courses' ? 'btn' : 'btn ghost'}
          style={{ borderBottom: activeTab === 'courses' ? '2px solid var(--accent)' : 'none' }}
        >
          <FiBook /> Courses
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={activeTab === 'assessments' ? 'btn' : 'btn ghost'}
          style={{ borderBottom: activeTab === 'assessments' ? '2px solid var(--accent)' : 'none' }}
        >
          <FiFileText /> Assessments
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={activeTab === 'reports' ? 'btn' : 'btn ghost'}
          style={{ borderBottom: activeTab === 'reports' ? '2px solid var(--accent)' : 'none' }}
        >
          <FiBarChart2 /> Reports
        </button>
      </div>

      {activeTab === 'courses' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>My Courses</h2>
            <button onClick={() => { setShowCourseForm(true); setSelectedCourse(null); }} className="btn">
              <FiPlus /> New Course
            </button>
          </div>

          {courses.length === 0 ? (
            <p className="empty">No courses yet. Create your first course!</p>
          ) : (
            <ul className="todo-list">
              {courses.map(course => (
                <li key={course.id}>
                  <div style={{ flex: 1 }}>
                    <strong>{course.name} ({course.code})</strong>
                    <p>{course.description || 'No description'}</p>
                    <div className="meta">
                      <FiUsers /> {course.enrolled_students || 0} students enrolled
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
            <p className="empty">No assessments yet. Create your first assessment!</p>
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
  );
}

