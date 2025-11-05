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
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Switch } from '@mui/material';

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
    <AppBar 
      position="sticky" 
      sx={{ 
        background: darkMode ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #FF4433 0%, #ff7a59 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <FiBook size={24} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Learning Tracker
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isTeacher && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/teacher/dashboard"
                startIcon={<FiHome />}
                sx={{ 
                  color: location.pathname === '/teacher/dashboard' ? '#fff' : 'rgba(255,255,255,0.8)',
                  fontWeight: location.pathname === '/teacher/dashboard' ? 'bold' : 'normal'
                }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/teacher/dashboard"
                startIcon={<FiBarChart2 />}
                sx={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Reports
              </Button>
            </>
          )}

          {isStudent && (
            <Button
              color="inherit"
              component={Link}
              to="/student/dashboard"
              startIcon={<FiHome />}
              sx={{ 
                color: location.pathname === '/student/dashboard' ? '#fff' : 'rgba(255,255,255,0.8)',
                fontWeight: location.pathname === '/student/dashboard' ? 'bold' : 'normal'
              }}
            >
              Dashboard
            </Button>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <FiSun size={18} />
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
            <FiMoon size={18} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, pl: 2, borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
            <FiUser size={18} />
            <Typography variant="body2" sx={{ mr: 1 }}>
              {user.first_name} {user.last_name}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <FiLogOut />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

