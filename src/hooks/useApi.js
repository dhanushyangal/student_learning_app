import { useState, useEffect, useCallback } from 'react';
import API from '../api';

/**
 * Custom hook for API calls with loading and error states
 * @param {string} url - API endpoint
 * @param {object} options - Request options (method, data, immediate)
 */
export function useApi(url, options = {}) {
  const { method = 'GET', data = null, immediate = true } = options;
  
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (customData = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let res;
      const requestData = customData || data;
      
      switch (method.toUpperCase()) {
        case 'GET':
          res = await API.get(url);
          break;
        case 'POST':
          res = await API.post(url, requestData);
          break;
        case 'PUT':
          res = await API.put(url, requestData);
          break;
        case 'DELETE':
          res = await API.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      setResponse(res.data);
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, data]);

  useEffect(() => {
    if (immediate && method === 'GET') {
      execute();
    }
  }, [execute, immediate, method]);

  return { response, loading, error, execute, refetch: execute };
}

