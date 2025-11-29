import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { FiLogIn, FiUser, FiLock, FiBook, FiInfo, FiCopy, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [copied, setCopied] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { role: 'Teacher', username: 'teacher', password: 'teacher123', icon: '👨‍🏫', name: 'Dr. Sarah Johnson' },
    { role: 'Student', username: 'student', password: 'student123', icon: '👨‍🎓', name: 'Alex Martinez' },
    { role: 'Student', username: 'student2', password: 'student123', icon: '👩‍🎓', name: 'Emma Wilson' }
  ];

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const quickLogin = async (username, password) => {
    setUsername(username);
    setPassword(password);
    setError('');
    setLoading(true);
    
    try {
      const res = await API.post('/auth/login', { username, password });
      login(res.data);
      
      if (res.data.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', { username, password });
      login(res.data);
      
      if (res.data.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span className="logo"><FiLogIn size={20} /></span>
        Login
      </h2>

      {/* Demo Accounts */}
      {showDemo && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(102, 126, 234, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiInfo size={16} color="#667eea" />
              <strong style={{ color: '#667eea', fontSize: '13px', fontWeight: '600' }}>Demo Accounts</strong>
            </div>
            <button
              onClick={() => setShowDemo(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '2px 6px',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(148, 163, 184, 0.1)';
                e.target.style.color = '#64748b';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#94a3b8';
              }}
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {demoAccounts.map((account, idx) => (
              <div key={idx} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <span style={{ fontSize: '24px' }}>{account.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px', color: '#1e293b' }}>
                    {account.role}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                    {account.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <strong style={{ color: '#64748b' }}>User:</strong> 
                      <code style={{ 
                        background: '#f1f5f9', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace'
                      }}>
                        {account.username}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(account.username, `user-${idx}`);
                        }}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {copied === `user-${idx}` ? (
                          <FiCheck size={11} color="#10b981" />
                        ) : (
                          <FiCopy size={11} color="#94a3b8" />
                        )}
                      </button>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <strong style={{ color: '#64748b' }}>Pass:</strong> 
                      <code style={{ 
                        background: '#f1f5f9', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace'
                      }}>
                        {account.password}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(account.password, `pass-${idx}`);
                        }}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {copied === `pass-${idx}` ? (
                          <FiCheck size={11} color="#10b981" />
                        ) : (
                          <FiCopy size={11} color="#94a3b8" />
                        )}
                      </button>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => quickLogin(account.username, account.password)}
                  disabled={loading}
                  style={{
                    padding: '8px 14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Quick Login
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div style={{ color: '#ef4444', marginBottom: '15px', padding: '10px', background: '#fee', borderRadius: '8px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        <label>
          <span className="form-icon"><FiUser /></span>
          Username or Email
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username or email"
          />
        </label>

        <label>
          <span className="form-icon"><FiLock /></span>
          Password
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#64748b'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </label>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button type="button" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
