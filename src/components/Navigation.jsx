import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FiBook, 
  FiLogOut, 
  FiSun, 
  FiMoon,
  FiHome,
  FiBarChart2,
  FiFileText,
  FiUser
} from 'react-icons/fi';
import { Switch } from '@mui/material';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      width: '100%',
      background: darkMode ? '#1e293b' : '#6366f1',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <FiBook size={24} color="white" />
          <span style={{ fontWeight: 'bold', color: 'white', fontSize: '1.125rem' }}>
            Learning Tracker
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isTeacher && (
            <>
              <Link
                to="/teacher/dashboard"
                style={{
                  padding: '8px 16px',
                  color: location.pathname === '/teacher/dashboard' ? '#fff' : 'rgba(255,255,255,0.8)',
                  fontWeight: location.pathname === '/teacher/dashboard' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <FiHome size={18} /> Dashboard
              </Link>
              <Link
                to="/teacher/dashboard"
                style={{
                  padding: '8px 16px',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <FiBarChart2 size={18} /> Reports
              </Link>
            </>
          )}

          {isStudent && (
            <>
              <Link
                to="/student/dashboard"
                style={{
                  padding: '8px 16px',
                  color: location.pathname === '/student/dashboard' ? '#fff' : 'rgba(255,255,255,0.8)',
                  fontWeight: location.pathname === '/student/dashboard' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <FiHome size={18} /> Dashboard
              </Link>
              <Link
                to="/student/dashboard"
                style={{
                  padding: '8px 16px',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <FiBarChart2 size={18} /> Progress
              </Link>
              <Link
                to="/student/dashboard"
                style={{
                  padding: '8px 16px',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <FiFileText size={18} /> Assignments
              </Link>
            </>
          )}

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginLeft: '24px', 
            paddingLeft: '24px', 
            borderLeft: '1px solid rgba(255,255,255,0.2)' 
          }}>
            <FiSun size={18} color="white" />
            <Switch
              checked={darkMode}
              onChange={toggleTheme}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#fff',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#fff',
                },
              }}
            />
            <FiMoon size={18} color="white" />
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginLeft: '24px', 
            paddingLeft: '24px', 
            borderLeft: '1px solid rgba(255,255,255,0.2)' 
          }}>
            <FiUser size={18} color="white" />
            <span style={{ marginRight: '8px', color: 'white', fontSize: '0.875rem' }}>
              {user.first_name} {user.last_name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.9)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

