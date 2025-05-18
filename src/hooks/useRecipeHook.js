import { useState, useCallback } from "react";

const useRecipeSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  console.log("RecipeHook");

  const searchRecipes = useCallback(async (query, type = "name") => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const endpoints = {
        name: `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
        ingredient: `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`,
        area: `https://www.themealdb.com/api/json/v1/1/filter.php?a=${query}`,
      };

      const endpoint = endpoints[type] || endpoints.name;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.meals || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError(err.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  return {
    searchResults,
    setSearchResults,
    searchLoading,
    searchError,
    searchRecipes,
  };
};

export default useRecipeSearch;
