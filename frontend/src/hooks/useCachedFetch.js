import { useState, useEffect, useRef } from "react";
import http from "../../lib/axios";

// Global cache object
const cache = new Map();

/**
 * Custom hook to fetch data with caching to prevent unnecessary re-fetches
 * across route navigations.
 * 
 * @param {string} url - The API endpoint to fetch
 * @param {object} options - Optional configuration
 * @param {number} options.ttl - Time to live in ms (default: 5 minutes)
 * @param {boolean} options.enabled - Whether to fetch automatically (default: true)
 */
export const useCachedFetch = (url, options = {}) => {
  const { ttl = 300000, enabled = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const fetchData = async (force = false) => {
    if (!url || !enabled) return;

    const now = Date.now();
    const cachedItem = cache.get(url);

    if (!force && cachedItem && (now - cachedItem.timestamp < ttl)) {
      setData(cachedItem.data);
      return;
    }

    setLoading(true);
    try {
      const res = await http.get(url);
      const resData = res?.data || res;
      cache.set(url, { data: resData, timestamp: Date.now() });
      if (mounted.current) {
        setData(resData);
        setError(null);
      }
    } catch (err) {
      if (mounted.current) {
        setError(err.response?.data?.message || err.message || "Failed to fetch data");
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchData();
    return () => {
      mounted.current = false;
    };
  }, [url, enabled]);

  // Method to manually invalidate cache for this url
  const invalidate = () => {
    cache.delete(url);
    fetchData(true);
  };

  return { data, loading, error, refetch: () => fetchData(true), invalidate };
};

// Expose global clear if needed
export const clearApiCache = () => cache.clear();
