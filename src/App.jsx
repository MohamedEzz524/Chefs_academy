import { useEffect, useState } from "react";
import ThemeProvider from "./components/ThemeProvider";
import Hero from "./pages/Hero";
import Recipe from "./pages/Recipe";
import Favorites from "./pages/Favorites";
import { Toaster } from "react-hot-toast";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const preferredTheme = window.matchMedia("(prefers-color-schema: dark)");
    return savedTheme ? savedTheme : preferredTheme ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  console.log("app fired");

  return (
    <div className="bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-amber-50 to-orange-50 ">
      <Toaster position="bottom-center" />
      {/* Theme */}
      <ThemeProvider theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <Hero theme={theme} />

      {/* Main App */}
      <Recipe />

      {/* Favorites */}
      <Favorites />
    </div>
  );
}

export default App;
