import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import FavoritesProvider from "./providers/FavoritesProvider.jsx";
import RecipeProvider from "./providers/RecipeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FavoritesProvider>
      <RecipeProvider>
        <App />
      </RecipeProvider>
    </FavoritesProvider>
  </StrictMode>
);
