import React, { useState, useEffect } from 'react';
import API from '../api';
import { FiBarChart2, FiUsers, FiTrendingUp, FiAward } from 'react-icons/fi';

export default function CourseReport({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (courseId) => {
    setLoading(true);
    try {
      const res = await API.get(`/reports/course/${courseId}`);
      setReportData(res.data);
      setSelectedCourse(courseId);
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
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

  if (!selectedCourse) {
    return (
      <div className="card">
        <h2>Course Reports</h2>
        <p>Select a course to view detailed reports:</p>
        {courses.length === 0 ? (
          <p className="empty">No courses available</p>
        ) : (
          <ul className="todo-list">
            {courses.map(course => (
              <li key={course.id}>
                <div style={{ flex: 1 }}>
                  <strong>{course.name} ({course.code})</strong>
                  <p>{course.description || 'No description'}</p>
                </div>
                <div className="actions">
                  <button onClick={() => fetchReport(course.id)} className="btn">
                    <FiBarChart2 /> View Report
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (loading) return <div className="card"><p>Loading report...</p></div>;
  if (!reportData) return <div className="card"><p>No report data available</p></div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>
          <FiBarChart2 /> Report: {reportData.course.name}
        </h2>
        <button onClick={() => { setSelectedCourse(null); setReportData(null); }} className="btn ghost">
          Back to Courses
        </button>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Students</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{reportData.statistics.total_students}</div>
        </div>
        <div style={{ padding: '15px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '8px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Assessments</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{reportData.statistics.total_assessments}</div>
        </div>
        <div style={{ padding: '15px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '8px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Course Average</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatPercentage(reportData.statistics.course_average)}</div>
        </div>
        <div style={{ padding: '15px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '8px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Completion Rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatPercentage(reportData.statistics.completion_rate)}</div>
        </div>
      </div>

      {/* Student Performance */}
      <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Student Performance</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e6e9ef' }}>Student</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e6e9ef' }}>Completed</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e6e9ef' }}>Average</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e6e9ef' }}>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {reportData.students.map((student, idx) => (
              <tr key={student.id} style={{ borderBottom: '1px solid #e6e9ef' }}>
                <td style={{ padding: '12px' }}>
                  <strong>{student.first_name} {student.last_name}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{student.email}</div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {student.completed_assessments} / {student.total_assessments}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ color: getGradeColor(student.average_percentage), fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {formatPercentage(student.average_percentage)}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {student.total_score} / {student.total_max_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assessment Breakdown */}
      <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Assessment Breakdown</h3>
      <ul className="todo-list">
        {reportData.assessments.map(assessment => (
          <li key={assessment.id}>
            <div style={{ flex: 1 }}>
              <strong>{assessment.title}</strong>
              <p>{assessment.description || 'No description'}</p>
              <div className="meta">
                {assessment.assessment_type} • Max Score: {assessment.max_score}
                {assessment.due_date && ` • Due: ${new Date(assessment.due_date).toLocaleDateString()}`}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

