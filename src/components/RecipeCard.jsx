import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaClock, FaUtensils } from "react-icons/fa";
import useRecipe from "../hooks/useRecipe";

export const RecipeCard = ({
  id,
  title,
  image,
  isFavorite,
  toggleFavorite,
  forFavorite,
  strArea,
  strCategory,
  strTags, // Added for tags display
}) => {
  const { setRecipeId, setShowDetails } = useRecipe();

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => {
        setShowDetails(true);
        setRecipeId(id);
      }}
      className={`group w-full cursor-pointer relative overflow-hidden rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-colors duration-300 hover:ring-1 hover:ring-amber-400 hover:ring-offset-2 hover:ring-offset-gray-800/80
        ${forFavorite ? "border border-gray-200 dark:border-gray-700" : ""}`}
    >
      {/* Favorite Icon */}
      <motion.button
        className={`absolute top-3 right-3 p-2 z-10 rounded-full backdrop-blur-sm cursor-pointer ${
          forFavorite
            ? "bg-white/90 dark:bg-gray-800/90 shadow-lg"
            : "bg-gray-200/40"
        }`}
        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        title={isFavorite ? "Remove favorite" : "Add favorite"}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(id);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isFavorite ? (
          <FaHeart className="text-lg text-pink-600" />
        ) : (
          <FaRegHeart className="text-lg text-gray-700 dark:text-gray-300" />
        )}
      </motion.button>

      {/* Image Container */}
      <div
        className={`relative overflow-hidden ${
          forFavorite ? "aspect-video" : "aspect-[4/3]"
        }`}
      >
        <motion.img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          whileHover={{ scale: 1.05 }}
        />
        <div className="absolute group-hover:inset-full inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent " />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {strTags
            ?.split(",")
            .slice(0, 2)
            .map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-full shadow-sm"
              >
                {tag.trim()}
              </span>
            ))}
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
          <div className="flex gap-2">
            {strArea && (
              <span className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                <FaUtensils className="text-amber-500" size={10} />
                {strArea}
              </span>
            )}
            {strCategory && (
              <span className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full shadow-sm">
                {strCategory}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate">
          {title}
        </h3>

        {/* Additional Info Line */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {forFavorite ? "Saved recipe" : "Try this recipe"}
          </span>
          {forFavorite && isFavorite && (
            <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
              ★ Favorite
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
