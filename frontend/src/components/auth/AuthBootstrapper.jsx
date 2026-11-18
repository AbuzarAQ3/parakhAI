import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

/**
 * AuthBootstrapper Component
 * Restores session in the background on app mount without locking or blocking page rendering.
 */
export const AuthBootstrapper = ({ children }) => {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return children;
};

export default AuthBootstrapper;
