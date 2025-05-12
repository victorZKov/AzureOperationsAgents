import { useState, useEffect, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { LoadingScreen } from "../components/loading-screen";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isAuthenticated, isInitialized, doLogin } = useAuthContext();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const handleLogin = async () => {
      setIsLoggingIn(true);
      try {
        if (!user) {
          await doLogin();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoggingIn(false);
      }
    };

    if (!user && !isLoggingIn) {
      if (pathname !== requestedLocation) {
        setRequestedLocation(pathname);
      }
      handleLogin();
    }
  }, [user, pathname, requestedLocation, doLogin, isLoggingIn]);

  if (!isInitialized || isLoggingIn) {
    return <LoadingScreen />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}