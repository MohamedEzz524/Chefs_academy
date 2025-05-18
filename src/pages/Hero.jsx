import { lightArr, darkArr } from "../_Data";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/Logo2.png";

const ourStats = [
  { id: "s1", title: "Recipes", value: "1000" },
  { id: "s2", title: "User Rating", value: "5" },
  { id: "s3", title: "Cuisines", value: "50" },
];

const displayArr = [
  {
    title: "Discover Delicious Recipes",
    desc: "Find meals for every mood, craving, and occasion.",
  },
  {
    title: "Cook Something New Today",
    desc: "Easy-to-follow recipes to spark your creativity.",
  },
  {
    title: "Your Next Favorite Dish Awaits",
    desc: "Browse trending recipes loved by home cooks.",
  },
  {
    title: "From Kitchen to Table",
    desc: "Step-by-step guides to help you cook with confidence.",
  },
];

const IMAGE_TRANSITION = { duration: 1, ease: "easeInOut" };
const CONTENT_TRANSITION = { duration: 0.5, ease: "easeOut" };

const Hero = ({ theme }) => {
  const [info, setInfo] = useState(ourStats.map(() => 0));
  const [reducedMotion, setReducedMotion] = useState(false);
  const [imgsArr, setImgsArr] = useState(() =>
    theme === "dark" ? darkArr : lightArr
  );
  const [fade, setFade] = useState(true);
  const [index, setIndex] = useState(0);

  // Preload images
  useEffect(() => {
    const preloadImages = [...new Set([...lightArr, ...darkArr])];
    preloadImages.forEach((src) => {
      new Image().src = src;
    }, []);
    console.log("Hero fired");

    const startTime = performance.now();
    const duration = 2000;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      setInfo(ourStats.map((e) => ~~(e.value * progress)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Handle theme changes
  useEffect(() => {
    setImgsArr(theme === "dark" ? darkArr : lightArr);
    setIndex(0);
  }, [theme]);

  // Check prefers-reduced-motion
  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Handle looping transition
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % imgsArr.length);
        setTimeout(() => setFade(true), 100);
      }, 500);
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [imgsArr, reducedMotion]);

  return (
    <div className="relative h-[100dvh] w-full flex justify-center items-center font-inter text-white overflow-hidden">
      {/* Hero Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={imgsArr[index]}
          src={imgsArr[index]}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0.9, scale: 1 }}
          transition={IMAGE_TRANSITION}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          loading={index === 0 ? "eager" : "lazy"}
          alt={`Hero image ${index + 1}`} // More descriptive alt text
          decoding="async"
          style={{
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            willChange: "transform, opacity", // Performance optimization
          }}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}

      <span className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent dark:from-black/90 dark:via-black/70 dark:to-black/30"></span>

      {/* Hero Content */}

      <div className=" relative pt-10 container z-10 flex items-start justify-center flex-col gap-10">
        {/* Logo */}
        {/* <motion.img
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          src={logo}
          alt="Logo"
          className="relative sm:mb-20 w-32 h-16 bg-black/10 dark:bg-white/10 backdrop-blur-xl rounded-sm shadow-sm"
        /> */}

        {/* Hero */}

        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: fade ? 1 : 0, y: fade ? 0 : 20 }}
          transition={{ CONTENT_TRANSITION }}
          className="max-sm:m-auto"
        >
          <h1
            className="text-[clamp(2rem,3.75vw+.4rem,4.5rem)] max-sm:text-center font-extrabold leading-[1.1] drop-shadow-lg 
            bg-gradient-to-r from-purple-800 via-pink-700 to-red-700 
          dark:from-purple-300 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent"
          >
            {displayArr[index].title}
          </h1>
          <p className="text-[clamp(1rem,1.2vw+.3rem,1.7rem)] max-sm:text-center  mt-4 max-w-2xl mx-auto md:mx-0 text-white/90 dark:text-white/80 drop-shadow-sm">
            {displayArr[index].desc}
          </p>
        </motion.div>

        {/* CTA Button */}

        {/* Optional search icon */}
        <div className="flex sm:justify-start justify-center w-full">
          <a
            href="#recipes"
            className="cursor-pointer max-sm:w-fit m-auto ring-2 mx-1 ring-pink-700 ring-offset-2 ring-offset-gray-800/40 px-6 py-3 
          bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            Explore Recipes
          </a>
        </div>

        {/* Stats */}

        <div className="mt-10 flex gap-3 sm:gap-6 flex-wrap w-full justify-center sm:justify-start">
          {ourStats.map(({ id, title }, i) => (
            <motion.div
              key={id}
              whileHover={{ y: -5 }}
              className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg p-4 rounded-xl border border-white/10 dark:border-gray-700/50 shadow-lg"
            >
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {info[i]}
                {title === "User Rating" ? (
                  <span className="text-yellow-400">★</span>
                ) : (
                  <span className="text-white">+</span>
                )}
              </p>
              <p className="text-sm text-gray-300 dark:text-gray-400 mt-1">
                {title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
