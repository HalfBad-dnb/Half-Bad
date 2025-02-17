import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode the token to get user role (assuming it's a JWT token)
  const userRole = JSON.parse(atob(token.split('.')[1])).role; // This decodes the JWT to get the role

  // If the role is not admin, redirect to unauthorized page or another appropriate page
  if (userRole !== "ADMIN") {
    return <Navigate to="/unauthorized" />;
  }

  // If the user is an admin, render the children (the protected page)
  return children;
};

export default PrivateRoute;
