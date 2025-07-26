// src/Routes/PrivateRoute.jsx

import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { Loader } from "../Components/Loader"; // ✅ shows loading state while checking auth

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loader />; // ⏳ Optional: Add spinner or text
  }

  if (!user) {
    // ❌ Not logged in, redirect to login and preserve location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Authenticated user, allow access
  return children;
};

export default PrivateRoute;
