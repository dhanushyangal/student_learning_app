// API wrapper with fallback to mock data
import axios from 'axios';
import { mockApi } from './services/mockApi';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://student-learning-backend.vercel.app/api';
// Force use of real API (set to false to use mock)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

// Helper function to check if error is network/backend unavailable
const isBackendUnavailable = (error) => {
  return !error.response || error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK';
};

// API wrapper with automatic fallback to mock
const API = {
  get: async (url, config) => {
    // Always try real backend first unless USE_MOCK is explicitly true
    if (USE_MOCK) {
      const endpoint = url.replace('/api', '').replace(/^\//, '');
      if (endpoint.startsWith('courses')) {
        return mockApi.getCourses(config?.params || {});
      } else if (endpoint.startsWith('assessments')) {
        if (endpoint.includes('/grades')) {
          const id = endpoint.split('/')[1];
          return mockApi.getAssessmentGrades(id);
        }
        if (endpoint.match(/assessments\/\d+$/)) {
          const id = endpoint.split('/')[1];
          return mockApi.getAssessment(id);
        }
        return mockApi.getAssessments(config?.params || {});
      } else if (endpoint.startsWith('students')) {
        const parts = endpoint.split('/');
        if (parts.length === 2) {
          return mockApi.getStudent(parts[1]);
        } else if (parts.length === 4 && parts[2] === 'courses') {
          return mockApi.getStudentCourseProgress(parts[1], parts[3]);
        }
      } else if (endpoint.startsWith('reports/course/')) {
        const id = endpoint.split('/')[2];
        return mockApi.getCourseReport(id);
      }
    }
    
    // Try real backend
    try {
      return await axiosInstance.get(url, config);
    } catch (err) {
      // Fallback to mock only if backend is unavailable
      if (isBackendUnavailable(err)) {
        const endpoint = url.replace('/api', '').replace(/^\//, '');
        if (endpoint.startsWith('courses')) {
          return mockApi.getCourses(config?.params || {});
        } else if (endpoint.startsWith('assessments')) {
          if (endpoint.includes('/grades')) {
            const id = endpoint.split('/')[1];
            return mockApi.getAssessmentGrades(id);
          }
          if (endpoint.match(/assessments\/\d+$/)) {
            const id = endpoint.split('/')[1];
            return mockApi.getAssessment(id);
          }
          return mockApi.getAssessments(config?.params || {});
        } else if (endpoint.startsWith('students')) {
          const parts = endpoint.split('/');
          if (parts.length === 2) {
            return mockApi.getStudent(parts[1]);
          } else if (parts.length === 4 && parts[2] === 'courses') {
            return mockApi.getStudentCourseProgress(parts[1], parts[3]);
          }
        } else if (endpoint.startsWith('reports/course/')) {
          const id = endpoint.split('/')[2];
          return mockApi.getCourseReport(id);
        }
      }
      throw err;
    }
  },

  post: async (url, data, config) => {
    // Always try real backend first for auth operations (critical for database)
    const endpoint = url.replace('/api', '').replace(/^\//, '');
    const isAuthOperation = endpoint === 'auth/login' || endpoint === 'auth/register';
    
    // For auth operations, never use mock - always try real backend
    if (isAuthOperation) {
      try {
        return await axiosInstance.post(url, data, config);
      } catch (err) {
        // Don't fallback to mock for auth - throw the error
        throw err;
      }
    }
    
    // For other operations, check USE_MOCK flag
    if (USE_MOCK) {
      if (endpoint.startsWith('courses')) {
        if (endpoint.includes('/enroll')) {
          return { data: { success: true } };
        }
        return mockApi.createCourse(data);
      } else if (endpoint.startsWith('assessments')) {
        if (endpoint.includes('/grade')) {
          const id = endpoint.split('/')[1];
          return mockApi.gradeAssessment(id, data);
        }
        return mockApi.createAssessment(data);
      }
    }
    
    // Try real backend
    try {
      return await axiosInstance.post(url, data, config);
    } catch (err) {
      // Fallback to mock only if backend is unavailable (but not for auth)
      if (isBackendUnavailable(err) && !isAuthOperation) {
        if (endpoint.startsWith('courses')) {
          if (endpoint.includes('/enroll')) {
            return { data: { success: true } };
          }
          return mockApi.createCourse(data);
        } else if (endpoint.startsWith('assessments')) {
          if (endpoint.includes('/grade')) {
            const id = endpoint.split('/')[1];
            return mockApi.gradeAssessment(id, data);
          }
          return mockApi.createAssessment(data);
        }
      }
      throw err;
    }
  },

  put: async (url, data, config) => {
    if (USE_MOCK) {
      try {
        return await axiosInstance.put(url, data, config);
      } catch (err) {
        throw err;
      }
    }
    
    try {
      return await axiosInstance.put(url, data, config);
    } catch (err) {
      if (isBackendUnavailable(err) && USE_MOCK) {
        // Could add mock updates here if needed
      }
      throw err;
    }
  },

  delete: async (url, config) => {
    if (USE_MOCK) {
      try {
        return await axiosInstance.delete(url, config);
      } catch (err) {
        throw err;
      }
    }
    
    try {
      return await axiosInstance.delete(url, config);
    } catch (err) {
      if (isBackendUnavailable(err) && USE_MOCK) {
        // Could add mock deletes here if needed
      }
      throw err;
    }
  }
};

export default API;
