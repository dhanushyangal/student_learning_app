import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { FiLogIn, FiUser, FiLock, FiBook, FiInfo, FiCopy, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AnimatedCard from '../components/AnimatedCard';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [copied, setCopied] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { role: 'Teacher', username: 'teacher', password: 'teacher123', icon: '👨‍🏫' },
    { role: 'Student', username: 'student', password: 'student123', icon: '👨‍🎓' }
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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        top: '-250px',
        right: '-250px',
        animation: 'float 20s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        bottom: '-200px',
        left: '-200px',
        animation: 'float 15s ease-in-out infinite reverse'
      }} />

      <AnimatedCard delay={0.1}>
        <div className="card" style={{ 
          maxWidth: '480px', 
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #FF4433 0%, #ff7a59 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(255, 68, 51, 0.3)'
              }}
            >
              <FiBook size={40} color="white" />
            </motion.div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              Learning Tracker
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
              Track your learning progress and outcomes
            </p>
          </div>

          {/* Demo Accounts Card */}
          {showDemo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '25px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <FiInfo size={18} color="#667eea" />
                <strong style={{ color: '#667eea', fontSize: '14px' }}>Demo Accounts</strong>
                <button
                  onClick={() => setShowDemo(false)}
                  style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>
              {demoAccounts.map((account, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <span style={{ fontSize: '24px' }}>{account.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                      {account.role}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', gap: '12px' }}>
                      <span>
                        <strong>User:</strong> {account.username}
                        <button
                          onClick={() => copyToClipboard(account.username, `user-${idx}`)}
                          style={{ marginLeft: '6px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          {copied === `user-${idx}` ? <FiCheck size={12} color="#10b981" /> : <FiCopy size={12} />}
                        </button>
                      </span>
                      <span>
                        <strong>Pass:</strong> {account.password}
                        <button
                          onClick={() => copyToClipboard(account.password, `pass-${idx}`)}
                          style={{ marginLeft: '6px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          {copied === `pass-${idx}` ? <FiCheck size={12} color="#10b981" /> : <FiCopy size={12} />}
                        </button>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => quickLogin(account.username, account.password)}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '12px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    Quick Login
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                color: '#ef4444',
                marginBottom: '20px',
                padding: '12px',
                background: '#fee',
                borderRadius: '8px',
                border: '1px solid #fcc',
                fontSize: '14px'
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                <FiUser size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Username or Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username or email"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  transition: 'all 0.3s',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                <FiLock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  transition: 'all 0.3s',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: loading
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #FF4433 0%, #ff7a59 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(255, 68, 51, 0.3)'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTop: 'none',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Logging in...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FiLogIn size={18} />
                    Login
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  padding: '14px 24px',
                  background: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#667eea';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#667eea';
                }}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </AnimatedCard>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(5deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

