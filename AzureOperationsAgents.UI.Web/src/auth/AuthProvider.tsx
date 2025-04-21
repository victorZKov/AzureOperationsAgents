// src/auth/AuthProvider.tsx
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';
import React, { useEffect, useState } from 'react';

const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        msalInstance
            .handleRedirectPromise()
            .finally(() => setIsInitialized(true));
    }, []);

    if (!isInitialized) {
        return null; // O algún <LoadingScreen />
    }

    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};