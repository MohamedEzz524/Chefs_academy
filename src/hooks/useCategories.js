import { useState, useEffect } from "react";

export const useCategories = (api) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(api);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataJson = await response.json();

        setData(dataJson);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, [api]);

  return { data, loading, error };
};
