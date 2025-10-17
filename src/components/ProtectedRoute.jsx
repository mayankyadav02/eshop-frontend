// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isLoggedIn } = useAuth(); // Custom Hook

  if (!isLoggedIn) {
    // User logged out → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    // User logged in but not admin → redirect to home
    return <Navigate to="/" replace />;
  }

  // User logged in & authorized
  return children;
};

export default ProtectedRoute;
