import React from "react";

const ErrorDisplay = ({ error }) => {
  return (
    <div className="text-center py-20 text-red-500 dark:text-red-400">
      <div className="flex flex-col items-center">
        <span className="text-4xl mb-3">⚠️</span>
        <p>Error loading data:</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
