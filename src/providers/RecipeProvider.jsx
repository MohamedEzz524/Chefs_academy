import { useState } from "react";
import RecipeContext from "../context/RecipeContext";

const RecipeProvider = ({ children }) => {
  const [recipeId, setRecipeId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  return (
    <RecipeContext.Provider
      value={{
        recipeId,
        setRecipeId,
        showDetails,
        setShowDetails,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
