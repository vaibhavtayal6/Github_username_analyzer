import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

interface LocationState {
  message?: string;
  returnPath?: string;
}

const NotFound = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    console.error(
      "404 Error:",
      state?.message || `User attempted to access non-existent route: ${location.pathname}`
    );
  }, [location.pathname, state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          {state?.message || "Oops! Page not found"}
        </p>
        <Link 
          to={state?.returnPath || "/"} 
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
