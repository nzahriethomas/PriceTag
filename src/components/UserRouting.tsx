import React from "react";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

// Reusable component to protect routes that require authentication
export const useSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for user authentication status
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
      setUserId(session?.user.id ?? null); // stoure user ID in state for easy access across components
    });

    return () => subscription.unsubscribe();
  }, []);
  return { isAuthenticated, isLoading, userId };
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
