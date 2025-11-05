// API wrapper with fallback to mock data
import axios from 'axios';
import { mockApi } from './services/mockApi';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
// Use mock data by default (can be overridden with env var)
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

// Check if backend is available
let backendAvailable = false;
if (!USE_MOCK) {
  axiosInstance.get('/health').catch(() => {
    backendAvailable = false;
  });
}

// API wrapper with automatic fallback to mock
const API = {
  get: async (url, config) => {
    if (USE_MOCK || !backendAvailable) {
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
      try {
        return await axiosInstance.get(url, config);
      } catch (err) {
        throw err;
      }
    }
    return axiosInstance.get(url, config);
  },

  post: async (url, data, config) => {
    if (USE_MOCK || !backendAvailable) {
      const endpoint = url.replace('/api', '').replace(/^\//, '');
      if (endpoint === 'auth/login') {
        return mockApi.login(data);
      } else if (endpoint === 'auth/register') {
        return mockApi.register(data);
      } else if (endpoint.startsWith('courses')) {
        if (endpoint.includes('/enroll')) {
          // Enrollment handled in mock
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
      try {
        return await axiosInstance.post(url, data, config);
      } catch (err) {
        throw err;
      }
    }
    return axiosInstance.post(url, data, config);
  },

  put: async (url, data, config) => {
    if (USE_MOCK || !backendAvailable) {
      // Mock updates
      try {
        return await axiosInstance.put(url, data, config);
      } catch (err) {
        throw err;
      }
    }
    return axiosInstance.put(url, data, config);
  },

  delete: async (url, config) => {
    if (USE_MOCK || !backendAvailable) {
      // Mock deletes
      try {
        return await axiosInstance.delete(url, config);
      } catch (err) {
        throw err;
      }
    }
    return axiosInstance.delete(url, config);
  }
};

export default API;
