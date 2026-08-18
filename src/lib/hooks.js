/**
 * Custom React hooks for API data fetching.
 * Provides loading, error, data states with auto-refresh and cache.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic data-fetching hook.
 * @param {Function} fetchFn - async function that returns data
 * @param {Array} deps - dependencies that trigger re-fetch
 * @param {Object} options - { immediate, onError, onSuccess }
 */
export function useApiData(fetchFn, deps = [], options = {}) {
  const { immediate = true, onError, onSuccess } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'Unknown error');
        onError?.(err);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) execute();
    return () => {
      mountedRef.current = false;
    };
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
}

/**
 * Mutation hook for POST/DELETE operations.
 * Returns { mutate, loading, error, data }
 */
export function useApiMutation(mutationFn, options = {}) {
  const { onSuccess, onError } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(...args);
      setData(result);
      onSuccess?.(result);
      return { success: true, data: result };
    } catch (err) {
      const message = err.message || 'Operation failed';
      setError(message);
      onError?.(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [mutationFn]); // eslint-disable-line react-hooks/exhaustive-deps

  return { mutate, loading, error, data };
}
