import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { FiX, FiCheck } from 'react-icons/fi';

export default function GradeAssessment({ assessment, onClose, onSuccess }) {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    fetchGrades();
  }, [assessment]);

  const fetchGrades = async () => {
    try {
      const res = await API.get(`/assessments/${assessment.id}/grades`);
      setGrades(res.data);
    } catch (err) {
      console.error('Error fetching grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (studentId, field, value) => {
    setGrades(grades.map(grade => {
      if (grade.student_id === studentId) {
        return { ...grade, [field]: value };
      }
      return grade;
    }));
  };

  const saveGrade = async (grade) => {
    setSaving({ ...saving, [grade.student_id]: true });
    try {
      await API.post(`/assessments/${assessment.id}/grade`, {
        student_id: grade.student_id,
        score: parseFloat(grade.score),
        feedback: grade.feedback,
        graded_by: user.id
      });
      await fetchGrades();
    } catch (err) {
      console.error('Error saving grade:', err);
      alert('Failed to save grade');
    } finally {
      setSaving({ ...saving, [grade.student_id]: false });
    }
  };

  if (loading) return <div className="card"><p>Loading...</p></div>;

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
      <div className="card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
        >
          <FiX />
        </button>
        <h2>Grade: {assessment.title}</h2>
        <p className="text-muted">Max Score: {assessment.max_score}</p>

        {grades.length === 0 ? (
          <p className="empty">No students enrolled in this assessment's course.</p>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e6e9ef' }}>Student</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e6e9ef' }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e6e9ef' }}>Percentage</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e6e9ef' }}>Feedback</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e6e9ef' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(grade => (
                  <tr key={grade.student_id} style={{ borderBottom: '1px solid #e6e9ef' }}>
                    <td style={{ padding: '12px' }}>
                      <strong>{grade.student_first_name} {grade.student_last_name}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{grade.student_email}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={grade.score || ''}
                        onChange={(e) => handleGradeChange(grade.student_id, 'score', e.target.value)}
                        min="0"
                        max={assessment.max_score}
                        step="0.01"
                        style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #e6e9ef', textAlign: 'center' }}
                        placeholder="0"
                      />
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
                        / {assessment.max_score}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {grade.score && assessment.max_score ? (() => {
                        const scoreNum = typeof grade.score === 'number' ? grade.score : parseFloat(grade.score) || 0;
                        const maxScoreNum = typeof assessment.max_score === 'number' ? assessment.max_score : parseFloat(assessment.max_score) || 1;
                        const percentage = maxScoreNum > 0 ? (scoreNum / maxScoreNum) * 100 : 0;
                        return (
                          <span style={{ fontWeight: 'bold', color: percentage >= 70 ? '#10b981' : '#ef4444' }}>
                            {isNaN(percentage) ? 'N/A' : `${percentage.toFixed(1)}%`}
                          </span>
                        );
                      })() : (
                        <span style={{ color: '#6b7280' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <textarea
                        value={grade.feedback || ''}
                        onChange={(e) => handleGradeChange(grade.student_id, 'feedback', e.target.value)}
                        placeholder="Add feedback..."
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #e6e9ef', minHeight: '60px', resize: 'vertical' }}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => saveGrade(grade)}
                        disabled={saving[grade.student_id] || !grade.score}
                        className="btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
                      >
                        <FiCheck /> {saving[grade.student_id] ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

