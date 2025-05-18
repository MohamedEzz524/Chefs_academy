import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import CategoryPage from "../components/CategoryPage";
import RecipePage from "../components/RecipePage";
import { useCategories } from "../hooks/useCategories";
import { motion } from "framer-motion";
import { TfiAngleDown } from "react-icons/tfi";
import { IoIosSearch, IoIosClose } from "react-icons/io";
import useRecipeSearch from "../hooks/useRecipeHook";

const Recipe = () => {
  // State management
  const [activeCategory, setActiveCategory] = useState("Dessert");
  const [lastActiveCategory, setLastActiveCategory] = useState("Dessert");
  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sortedActiveData, setSortedActiveData] = useState([]);
  const prevSearchQuery = useRef("");
  const prevSearchType = useRef("");

  // API hooks
  const { loading, error, data } = useCategories(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${activeCategory}`
  );

  const {
    searchResults,
    setSearchResults,
    searchLoading,
    searchError,
    searchRecipes,
  } = useRecipeSearch();

  // Track last active category
  useEffect(() => {
    if (!isSearching && activeCategory !== lastActiveCategory) {
      setLastActiveCategory(activeCategory);
    }
  }, [activeCategory, isSearching, lastActiveCategory]);

  // Memoized data processing
  const activeData = useMemo(() => {
    const newData = (data && Object.values(data)[0]) || [];
    setSortedActiveData(newData); // Initialize sorted data
    return newData;
  }, [data]);

  // Handle search input changes
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);

      // If input is cleared, return to last category
      if (!value.trim()) {
        setIsSearching(false);
        setSearchResults([]);
        setActiveCategory(lastActiveCategory);
      }
    },
    [lastActiveCategory, setSearchResults]
  );

  // Handle search submission
  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();

      // Skip if search query hasn't changed
      if (
        searchQuery.trim() === prevSearchQuery.current &&
        prevSearchType.current === searchType
      ) {
        return;
      }
      setActiveCategory("");

      prevSearchQuery.current = searchQuery.trim();
      prevSearchType.current = searchType;

      if (!searchQuery.trim()) {
        setIsSearching(false);
        setSearchResults([]);
        setActiveCategory(lastActiveCategory);
        return;
      }

      setIsSearching(true);
      await searchRecipes(searchQuery, searchType);
    },
    [
      searchQuery,
      searchType,
      searchRecipes,
      setSearchResults,
      lastActiveCategory,
    ]
  );

  // Clear search state
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
    setActiveCategory(lastActiveCategory);
    prevSearchQuery.current = "";
    prevSearchType.current = "";
  }, [lastActiveCategory, setSearchResults]);

  const clearForCategory = useCallback(
    (title) => {
      setSearchQuery("");
      setIsSearching(false);
      setSearchResults([]);
      setActiveCategory(title);
      prevSearchQuery.current = "";
      prevSearchType.current = "";
    },
    [setSearchResults]
  );

  // Sorting functionality
  const handleSort = useCallback(
    (e) => {
      const sortValue = e.target.value;
      const currentData = isSearching ? [...searchResults] : [...activeData];

      const sortedData = [...currentData].sort((a, b) => {
        switch (sortValue) {
          case "name":
            return a.strMeal.localeCompare(b.strMeal);
          case "reverse":
            return b.strMeal.localeCompare(a.strMeal);
          case "newest":
            return b.idMeal - a.idMeal;
          default:
            return 0;
        }
      });

      if (isSearching) {
        setSearchResults(sortedData);
      } else {
        setSortedActiveData(sortedData);
      }
    },
    [activeData, isSearching, searchResults, setSearchResults]
  );

  // Determine which data to display
  const displayData = isSearching ? searchResults : sortedActiveData;
  const displayLoading = isSearching ? searchLoading : loading;
  const displayError = isSearching ? searchError : error;

  return (
    <section id="recipes" className="container py-8 font-inter min-h-screen">
      {/* Optimized Navbar */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-3 px-4">
          {/* Search Section */}
          <div className="flex flex-1 items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1 min-w-0">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={
                      searchType === "name"
                        ? "Search all recipes..."
                        : searchType === "ingredient"
                          ? "Search by ingredient..."
                          : "Search by cuisine..."
                    }
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                  <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors"
                    >
                      <IoIosClose className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                  disabled={searchLoading}
                >
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {/* Search Type Dropdown (Desktop) */}
            <div className="hidden md:block relative min-w-[120px]">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full py-2 pl-3 pr-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Search By
                </option>
                <option value="name">Name</option>
                <option value="ingredient">Ingredient</option>
                <option value="area">Cuisine</option>
              </select>
              <TfiAngleDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-row md:flex-row items-stretch md:items-center gap-3">
            {/* Search Type Dropdown (Mobile) */}
            <div className="md:hidden relative w-full">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full py-2 pl-3 pr-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Search By
                </option>
                <option value="name">Name</option>
                <option value="ingredient">Ingredient</option>
                <option value="area">Cuisine</option>
              </select>
              <TfiAngleDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-auto md:min-w-[150px]">
              <select
                onChange={handleSort}
                disabled={displayData.length === 0}
                className="w-full py-2 pl-3 pr-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none disabled:opacity-50"
              >
                <option value="" disabled>
                  Sort By
                </option>
                <option value="name">A-Z</option>
                <option value="reverse">Z-A</option>
                <option value="newest">Newest</option>
              </select>
              <TfiAngleDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        <div className="lg:w-1/3 lg:sticky lg:top-20 lg:h-[calc(100vh-10rem)] space-y-4">
          <motion.h1
            className="text-2xl md:text-3xl font-bold py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 bg-clip-text text-transparent dark:from-amber-300 dark:via-amber-400 dark:to-orange-500">
              Recipe Collection
            </span>
          </motion.h1>
          <CategoryPage
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onCategoryChange={clearSearch}
            clear={clearForCategory}
          />
        </div>

        <div className="lg:w-2/3 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-5 px-2 sm:px-0">
            {/* Search Results Title - Left aligned */}
            {isSearching && searchQuery && (
              <motion.h2
                key={!isSearching ? activeCategory : "All"}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-semibold...text-gray-800 dark:text-gray-200"
              >
                Search results for
                <span className="text-amber-600 dark:text-amber-400">
                  "{searchQuery}"
                </span>
              </motion.h2>
            )}

            {/* Category/All Recipes Badge - Right aligned */}
            <div className="flex items-center gap-2 ml-auto">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                <motion.span
                  key={!isSearching ? activeCategory : "All"}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-2
          ${
            !isSearching
              ? "bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }
          transition-colors duration-200 relative
        `}
                >
                  {!isSearching ? activeCategory : "All"}
                </motion.span>
                Recipes
              </h2>
            </div>
          </div>

          {/* Recipe Page Content */}
          <RecipePage
            recipes={displayData}
            isError={displayError}
            isLoading={displayLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default Recipe;
