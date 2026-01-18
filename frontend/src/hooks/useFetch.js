import { useState, useCallback } from "react";

export function useFetch() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options = {}) => {
    setData([]);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.toString());
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, data, error, fetchData, setData };
}

export default useFetch;
