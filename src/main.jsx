import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import Register from './pages/Register'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import { createTheme } from '@mui/material/styles'
import './index.css'
import { Analytics } from "@vercel/analytics/react"

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF4433',
    },
    secondary: {
      main: '#ff7a59',
    },
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b5a',
    },
    secondary: {
      main: '#ff8e7a',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
})

function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container"><div className="card"><p>Loading...</p></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();
  const { darkMode } = useTheme();

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <CssBaseline />
        {user && <Navigation />}
        {!user ? (
          <main style={{ width: '100%', minHeight: '100vh' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        ) : (
          <main style={{ width: '100%' }}>
            <Routes>
              <Route path="/login" element={<Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />} />
              <Route path="/register" element={<Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />} />
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute requireRole="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requireRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />} />
            </Routes>
          </main>
        )}
      </BrowserRouter>
    </ThemeProvider>
  )
}

function App() {
  return <AppContent />;
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <CustomThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CustomThemeProvider>
  </ErrorBoundary>
)
