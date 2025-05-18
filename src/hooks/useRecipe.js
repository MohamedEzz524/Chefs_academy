import { useContext } from "react";
import RecipeContext from "../context/RecipeContext";

const useRecipe = () => {
  const recipeContext = useContext(RecipeContext);
  if (!recipeContext) {
    throw new Error("useRecipe must be used within a Recipe Provider");
  }
  return recipeContext;
};

export default useRecipe;
