// src/auth/RequireAuth.tsx
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Navigate } from 'react-router-dom';
import { JSX } from 'react';
import { LoadingScreen } from '../components/shared/LoadingScreen';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useIsAuthenticated();
    const { inProgress } = useMsal();

    if (inProgress !== InteractionStatus.None) {
        return <LoadingScreen />;
    }

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};