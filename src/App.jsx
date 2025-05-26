import { useEffect, useState } from "react";
import ThemeProvider from "./components/ThemeProvider";
import Hero from "./pages/Hero";
import Recipe from "./pages/Recipe";
import Favorites from "./pages/Favorites";
import { Toaster } from "react-hot-toast";
import logo from "./assets/images/Logo2.png";
import { motion } from "framer-motion";



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
    <div className="relative bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-amber-50 to-orange-50 ">
      <Toaster position="bottom-center" />

      {/* Logo */}
      <div className="container absolute top-4 left-0 z-10">
      <motion.img
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          src={logo}
          alt="Logo"
          className="relative w-24 h-24 sm:w-28 sm:h-28 bg-black/10 dark:bg-white/10 backdrop-blur-xl rounded-sm shadow-sm"
      />
      </div>

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
