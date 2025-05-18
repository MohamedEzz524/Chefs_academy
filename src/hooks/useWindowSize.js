import { useState, useEffect } from "react";

const useWindowSize = (throttleDelay = 100) => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const throttle = (func, delay) => {
    let lastCall = 0; // Tracks the last execution time
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) return; // Skip if delay hasn't passed
      lastCall = now;
      func.apply(this, args);
    };
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, throttleDelay);

    // Initial set
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [throttleDelay]);

  return windowSize;
};

export default useWindowSize;
