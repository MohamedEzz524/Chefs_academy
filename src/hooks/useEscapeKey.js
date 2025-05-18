import { useEffect } from "react";

export const useEscapeKey = (isActive = true, handler, priority = false) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handler();
        priority === "Low" && e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleEscape, priority && true);
    return () =>
      window.removeEventListener("keydown", handleEscape, priority && true);
  }, [isActive, handler, priority]);
};
