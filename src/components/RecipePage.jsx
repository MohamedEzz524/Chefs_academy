import { useEffect, useRef, useState, useCallback } from "react";
import LoadingDisplay from "./LoadingDisplay";
import ErrorDisplay from "./ErrorDisplay";
import { RecipeCard } from "./RecipeCard";
import useFavorites from "../hooks/useFavorites";
import useWindowSize from "../hooks/useWindowSize";
import Details from "./Details";
import useRecipe from "../hooks/useRecipe";

const RecipePage = ({ recipes = [], isLoading, isError }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef(null);
  const windowSize = useWindowSize();
  const { showDetails } = useRecipe();
  const { favorites, toggleFavorite } = useFavorites();

  // Calculate initial visible count based on window size
  const calculateInitialCount = useCallback(() => {
    if (!windowSize.width) return 0;

    const breakpoints = {
      default: 6,
      640: 9, // sm
      768: 18, // md
      1024: 15, // lg
      1280: 18, // xl
    };
    console.log("Recipe page");

    const closestBreakpoint = Object.keys(breakpoints)
      .sort((a, b) => b - a)
      .find((bp) => windowSize.width >= bp);

    return Math.min(
      breakpoints[closestBreakpoint] || breakpoints.default,
      recipes.length
    );
  }, [windowSize.width, recipes.length]);

  // Reset visible count when recipes change
  useEffect(() => {
    setVisibleCount(calculateInitialCount());
  }, [recipes, calculateInitialCount]);

  // Load more recipes handler
  const handleLoadMore = useCallback(() => {
    const breakpoints = {
      default: 6,
      640: 9,
      768: 18,
      1024: 15,
      1280: 18,
    };

    const closestBreakpoint = Object.keys(breakpoints)
      .sort((a, b) => b - a)
      .find((bp) => windowSize.width >= bp);

    const increment = breakpoints[closestBreakpoint] || breakpoints.default;
    const newCount = Math.min(visibleCount + increment, recipes.length);

    setVisibleCount(newCount);

    if (newCount > visibleCount) {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [visibleCount, recipes.length, windowSize.width]);

  if (isLoading) return <LoadingDisplay />;
  if (isError) return <ErrorDisplay error={isError} />;
  if (!recipes.length)
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No recipes found. Try a different search or category.
      </div>
    );

  return (
    <div className="w-full" ref={containerRef}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
        {recipes.slice(0, visibleCount).map((recipe) => (
          <RecipeCard
            key={recipe.idMeal}
            id={recipe.idMeal}
            title={recipe.strMeal}
            image={recipe.strMealThumb}
            isFavorite={favorites.includes(recipe.idMeal)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {visibleCount < recipes.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="relative px-7 py-3.5 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover:border-amber-300/50 cursor-pointer"
            aria-label="Load more recipes"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative font-medium text-gray-800 dark:text-gray-200">
              Load More
              <span className="text-amber-600 dark:text-amber-400 ml-1.5">
                ({recipes.length - visibleCount} remaining)
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
            </span>
            <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      )}

      {showDetails && <Details />}
    </div>
  );
};

export default RecipePage;
