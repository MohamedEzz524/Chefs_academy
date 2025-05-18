import LoadingDisplay from "../components/LoadingDisplay";
import ErrorDisplay from "../components/ErrorDisplay";
import { useEffect, useState } from "react";
import DetailsCard from "./DetailsCard";
import useRecipe from "../hooks/useRecipe";

const Details = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState({});

  const { recipeId, showDetails } = useRecipe();

  // Estimated Calories

  useEffect(() => {
    const fetchActiveDetails = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataJson = await response.json();
        setActiveItem(dataJson?.meals[0]);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDetails();
  }, [recipeId]);

  return (
    <>
      {loading && <LoadingDisplay />}
      {error && <ErrorDisplay error={error} />}
      {activeItem.strMeal && showDetails && <DetailsCard item={activeItem} />}
    </>
  );
};

export default Details;
