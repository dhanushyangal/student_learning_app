import React, { useState, useEffect } from 'react';
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
  FiUser,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { Switch } from '@mui/material';

// Hook to detect mobile screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default function Navigation() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  if (!user) {
    return null;
  }

  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';

  const navLinks = isTeacher ? [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/teacher/dashboard', label: 'Reports', icon: FiBarChart2 }
  ] : [
    { to: '/student/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/student/dashboard', label: 'Progress', icon: FiBarChart2 },
    { to: '/student/dashboard', label: 'Assignments', icon: FiFileText }
  ];

  return (
    <>
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
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Logo and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <FiBook size={24} color="white" />
            <span style={{ 
              fontWeight: 'bold', 
              color: 'white', 
              fontSize: '1.125rem',
              display: isMobile ? 'none' : 'block'
            }}>
              Learning Tracker
            </span>
          </div>

          {/* Desktop Navigation */}
          <div style={{ 
            display: !isMobile ? 'flex' : 'none', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            {navLinks.map((link, idx) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={idx}
                  to={link.to}
                  style={{
                    padding: '8px 16px',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                    fontWeight: isActive ? 'bold' : 'normal',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '44px'
                  }}
                  onMouseEnter={(e) => !isActive && (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Icon size={18} /> {link.label}
                </Link>
              );
            })}

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginLeft: '16px', 
              paddingLeft: '16px', 
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
              marginLeft: '16px', 
              paddingLeft: '16px', 
              borderLeft: '1px solid rgba(255,255,255,0.2)' 
            }}>
              <FiUser size={18} color="white" />
              <span style={{ 
                marginRight: '8px', 
                color: 'white', 
                fontSize: '0.875rem',
                display: window.innerWidth > 1024 ? 'inline' : 'none'
              }}>
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
                  transition: 'all 0.2s',
                  minWidth: '44px',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Logout"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: isMobile ? 'flex' : 'none',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              background: darkMode ? '#1e293b' : '#6366f1',
              width: '100%',
              maxWidth: '320px',
              height: '100%',
              padding: '24px',
              boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
              animation: 'slideIn 0.3s ease-out',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info */}
            <div style={{
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiUser size={24} color="white" />
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                    {user.role === 'teacher' ? 'Teacher' : 'Student'}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={idx}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '14px 16px',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.9)',
                      fontWeight: isActive ? '600' : 'normal',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => !isActive && (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                    onMouseLeave={(e) => !isActive && (e.target.style.backgroundColor = 'transparent')}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <FiSun size={18} />
                <span style={{ fontSize: '0.9375rem' }}>Theme</span>
              </div>
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
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

