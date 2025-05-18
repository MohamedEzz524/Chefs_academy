import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaYoutube, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import useFavorites from "../hooks/useFavorites";
import useRecipe from "../hooks/useRecipe";
import { useEscapeKey } from "../hooks/useEscapeKey";
import toast from "react-hot-toast";
import { useRef } from "react";

const DetailsCard = ({ item }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(item.idMeal);

  const ingredientsCopyRef = useRef(null);
  const instructionsCopyRef = useRef(null);

  const { setShowDetails } = useRecipe();

  // Split instructions into steps
  const instructions = item.strInstructions
    ?.split("\r\n")
    .filter((step) => step.trim() !== "");

  const copyToClipboard = async (text, buttonRef) => {
    try {
      await navigator.clipboard.writeText(text);

      // Store original content
      const originalContent = buttonRef.current.innerHTML;

      // Update button to show success state
      buttonRef.current.innerHTML = `
        <div class="flex items-center gap-1 text-green-600 dark:text-green-400">
          ✓ Copied!
        </div>
      `;

      // Revert after 2 seconds
      setTimeout(() => {
        buttonRef.current.innerHTML = originalContent;
      }, 2000);

      toast.success("Copied to clipboard!", {
        duration: 1500,
        position: "bottom-center",
        style: {
          background: "rgba(255, 255, 255, 0.9)",
          color: "#1F2937",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
    } catch (err) {
      toast.error(`Failed to copy : ${err}`, {
        duration: 1500,
        position: "bottom-center",
      });
    }
  };

  const copyIngredients = () => {
    const ingredients = [...Array(20)]
      .map((_, i) => {
        const ing = item[`strIngredient${i + 1}`];
        const measure = item[`strMeasure${i + 1}`];
        return ing && measure ? `${measure} ${ing}` : null;
      })
      .filter(Boolean)
      .join("\n");

    copyToClipboard(ingredients, ingredientsCopyRef);
  };

  const copyInstructions = () => {
    copyToClipboard(item.strInstructions, instructionsCopyRef);
  };

  // Handle Escape key press
  useEscapeKey(true, () => setShowDetails(false), "Low");

  return (
    <AnimatePresence>
      {/* Overlay with fade effect */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4"
        onClick={() => setShowDetails(false)}
      >
        {/* Modal card (stops click propagation) */}
        <motion.div
          initial={{ scale: 0.5, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}

          <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 z-10">
            {/* Title */}

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              <span className="text-rose-600 text-3xl">{item.strMeal[0]}</span>
              {item.strMeal.slice(1)}
            </h2>
            <button
              onClick={() => setShowDetails(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <FaTimes className="text-gray-500 dark:text-gray-400 " />
            </button>
          </div>

          {/* Content */}

          <div className="p-6 grid md:grid-cols-2 gap-8">
            {/* Left Column - Image & Basic Info */}

            <div className="md:sticky md:top-24 h-fit">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-md group">
                <img
                  src={item.strMealThumb}
                  alt={item.strMeal}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Tags */}

                <div className="absolute top-4 left-2 flex items-center gap-2">
                  {item.strTags?.split(",").map((tag) => (
                    <span className="text-gray-800 dark:text-white bg-white dark:bg-gray-800 p-1 px-2 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Favorite button */}

                <button
                  onClick={() => toggleFavorite(item.idMeal)}
                  className="absolute top-3 right-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500" />
                  )}
                </button>
              </div>

              <div className="flex justify-between flex-wrap mb-4 items-start">
                {/* Tags */}

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.strArea && (
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                      {item.strArea}
                    </span>
                  )}
                  {item.strCategory && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      {item.strCategory}
                    </span>
                  )}
                </div>

                {/* YouTube Link */}

                {item.strYoutube && (
                  <a
                    href={item.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 px-2 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-fit"
                  >
                    <FaYoutube />
                    Watch on YouTube
                  </a>
                )}
              </div>

              {/* Ingredients */}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 pb-2 text-gray-800 dark:text-white  ">
                  <h3 className="text-xl font-semibold ">Ingredients</h3>

                  {/* Copy Ingredients */}

                  <div
                    ref={ingredientsCopyRef}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    title="Copy to clipboard"
                    onClick={copyIngredients}
                  >
                    <FiCopy className="text-amber-500" />
                    <span>Copy</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {[...Array(20)].map((_, i) => {
                    const ingredient = item[`strIngredient${i + 1}`];
                    const measure = item[`strMeasure${i + 1}`];
                    return (
                      ingredient &&
                      measure && (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>
                            {measure} {ingredient}
                          </span>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Instructions */}
              <div>
                <div className="flex items-center justify-between mb-2 pb-2 text-gray-800 dark:text-white  ">
                  <h3 className="text-xl font-semibold ">Instructions</h3>

                  {/* Copy Instruction */}

                  <div
                    ref={instructionsCopyRef}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    title="Copy to clipboard"
                    onClick={copyInstructions}
                  >
                    <FiCopy className="text-amber-500" />
                    <span>Copy</span>
                  </div>
                </div>
                <ol className="space-y-4">
                  {instructions?.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      {/* Step number with custom styling */}
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 mt-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium text-sm group-hover:bg-amber-500/20 transition-colors">
                        {i + 1}
                      </span>

                      {/* Step content with animated border */}
                      <div className="flex-1 pb-4 border-b border-gray-200/40 dark:border-gray-700/60 group-hover:border-amber-400/30 transition-colors">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailsCard;
