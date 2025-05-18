import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RecipeCard } from "../components/RecipeCard";
import { FaHeart, FaTimes, FaRegHeart } from "react-icons/fa";
import useFavorites from "../hooks/useFavorites";
import { useEscapeKey } from "../hooks/useEscapeKey";
import LoadingDisplay from "../components/LoadingDisplay";

const Favorites = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // for Data shown

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  // hook
  const { favorites, toggleFavorite } = useFavorites();

  const fetchFavoriteRecipes = async (favoriteIds) => {
    try {
      setIsLoading(true);
      const promises = favoriteIds.map((id) =>
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
          .then((res) => res.json())
          .then((data) => data.meals?.[0])
      );

      const recipes = await Promise.all(promises);
      setFavoriteRecipes(recipes.filter((recipe) => recipe !== null));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoriteRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteRecipes(favorites);
    } else {
      setFavoriteRecipes([]);
      setIsLoading(false);
    }
  }, [favorites]);

  useEscapeKey(showFavorites, () => setShowFavorites(false));

  isLoading && <LoadingDisplay />;

  return (
    <>
      {/* Floating Button */}
      {!showFavorites && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowFavorites(true)}
          className="fixed right-6 bottom-6 bg-gradient-to-br from-rose-500 to-pink-600 hover:ring-1 hover:ring-rose-500 hover:ring-offset-2 hover:ring-offset-gray-100/80 dark:hover:ring-offset-gray-900/80 text-white p-4 rounded-full shadow-xl z-40 flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative">
            <FaHeart className="text-xl" />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-rose-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="hidden sm:inline-block text-sm font-medium ">
            My Favorites
          </span>
        </motion.div>
      )}

      {/* Side Panel - Modern Redesign */}
      {showFavorites && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFavorites(false)}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <motion.h2
                  className="text-2xl font-bold flex items-center gap-3 dark:text-gray-100 text-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FaHeart className="text-rose-500" />
                  <span>Saved Recipes</span>
                  {favorites.length > 0 && (
                    <span className="text-sm bg-rose-500 text-white px-2 py-1 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </motion.h2>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 cursor-pointer"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Content */}
              {favoriteRecipes.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {favoriteRecipes.map(
                    ({
                      idMeal,
                      strMeal,
                      strMealThumb,
                      strArea,
                      strCategory,
                      strTags,
                    }) => (
                      <RecipeCard
                        id={idMeal}
                        title={strMeal}
                        image={strMealThumb}
                        isFavorite={true}
                        toggleFavorite={toggleFavorite}
                        forFavorite={true}
                        strArea={strArea}
                        strCategory={strCategory}
                        strTags={strTags}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                    <FaRegHeart className="text-4xl text-rose-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your favorites list is empty
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Click the heart icon on recipes to save them here
                  </p>
                  <button
                    onClick={() => setShowFavorites(false)}
                    className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow cursor-pointer"
                  >
                    Browse Recipes
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default Favorites;
