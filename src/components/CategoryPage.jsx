import { memo } from "react";
import { motion } from "framer-motion";
import ErrorDisplay from "./ErrorDisplay";
import LoadingDisplay from "./LoadingDisplay";
import { useCategories } from "../hooks/useCategories";
import { FaAngleRight } from "react-icons/fa";

const Categories = memo(({ activeCategory, clear }) => {
  // Loading and error states
  const {
    loading,
    error,
    data: categories,
  } = useCategories("/Chefs_academy/categories.json");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="h-full font-inter">
      {/* Animated header underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="relative h-1 mb-4 w-full rounded-md bg-gradient-to-r from-amber-400 to-orange-500"
      />
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 gap-3 w-full sm:p-4 py-2 lg:max-h-[80%] 
        overflow-y-auto rounded-xl bg-transparent sm:bg-white/70 sm:dark:bg-gray-900/90 
        sm:border border-gray-200/90 dark:border-gray-700/60 shadow-xl backdrop-blur-lg"
      >
        {categories.map((category, i) => (
          <CategoryCard
            key={category.idCategory}
            id={category.idCategory}
            thumb={category.strCategoryThumb}
            title={category.strCategory}
            active={activeCategory}
            clear={clear}
            i={i}
          />
        ))}
      </div>
    </div>
  );
});

export default Categories;

const CategoryCard = memo(({ id, thumb, title, i, active, clear }) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        delay: 0.01 * i,
      }}
      onClick={() => clear(title)}
      className={`group relative overflow-hidden sm:border lg:w-full border mx-0.5 my-0.5
        ${
          active === title
            ? " bg-amber-50/80 dark:bg-amber-400/80 ring-1 ring-amber-300/50 dark:ring-amber-400/80 pointer-events-none"
            : " border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-gray-700/50 hover:shadow-md"
        } 
        sm:rounded-xl p-1 md:px-2  flex md:justify-center lg:justify-start items-center gap-0.5 cursor-pointer`}
    >
      {/* Gradient overlay - more visible on active */}

      <div
        className={`absolute z-0 inset-0 bg-gradient-to-r from-transparent via-amber-100/40 to-transparent transition-opacity duration-500
          ${
            active === title
              ? "opacity-100 dark:via-amber-900/20"
              : "opacity-0 group-hover:opacity-100"
          }`}
      />

      {/* Category image with shine effect */}
      <div className="relative z-10 flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 rounded-lg overflow-hidden shadow-inner">
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Category name */}
      <h3
        className={`truncate z-10 font-medium ${active === title ? "text-gray-900 dark:text-gray-200" : "text-gray-800 dark:text-gray-200  group-hover:text-amber-700 group-hover:tracking-wide dark:group-hover:text-amber-400"}  transition-all `}
        title={title}
      >
        {title}
      </h3>

      {/* Chevron (desktop only) */}
      <FaAngleRight
        className={`
        hidden lg:block w-4 h-4 ml-2 flex-shrink-0 transition-all duration-300
        ${
          active === title
            ? "text-amber-600 dark:text-amber-400"
            : "text-gray-400 dark:text-gray-500 group-hover:text-amber-500 dark:group-hover:text-amber-400"
        }
      `}
      />
    </motion.div>
  );
});
