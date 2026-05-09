import React from "react";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

// Reusable component to protect routes that require authentication
const useSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for user authentication status
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };
    checkSession();
  }, []);
  return { isAuthenticated, isLoading };
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useSession();
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/profile" />;
  }
};
