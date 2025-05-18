const LoadingDisplay = () => {
  return (
    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full mb-4  border-l-4 animate-spin shadow-2xl border-current"></div>
        <p>Loading properties...</p>
      </div>
    </div>
  );
};

export default LoadingDisplay;
