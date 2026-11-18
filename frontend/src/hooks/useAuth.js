/**
 * `useAuth` custom hook
 * Convenience hook exposing auth state and actions across the application.
 */

import { useAuthStore } from "../store/auth";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const status = useAuthStore((state) => state.status);
  const pendingFlows = useAuthStore((state) => state.pendingFlows);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const authConfig = useAuthStore((state) => state.authConfig);

  const login = useAuthStore((state) => state.login);
  const supervisorLogin = useAuthStore((state) => state.supervisorLogin);
  const guestLogin = useAuthStore((state) => state.guestLogin);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const fetchConfig = useAuthStore((state) => state.fetchConfig);
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const setPendingFlows = useAuthStore((state) => state.setPendingFlows);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const isSupervisor = user?.role === "supervisor" || user?.is_supervisor === true;
  const isGuest = user?.is_guest === true || token?.startsWith("guest_sih_") || token?.startsWith("guest_session_");

  return {
    user,
    token,
    status,
    isAuthenticated,
    isLoading,
    isSupervisor,
    isGuest,
    pendingFlows,
    pendingEmail,
    authConfig,
    login,
    supervisorLogin,
    guestLogin,
    signup,
    logout,
    restoreSession,
    fetchConfig,
    requestPasswordReset,
    resetPassword,
    setPendingFlows,
    setPendingEmail,
  };
};

export default useAuth;
