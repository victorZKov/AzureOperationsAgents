// file: src/main.tsx

import { PublicClientApplication, EventType } from "@azure/msal-browser";
import type { EventMessage, AuthenticationResult } from "@azure/msal-browser";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";


import { msalConfig } from "./authConfig";
import { App } from "./App";

import "./index.css";
import "./i18n";
import {MsalProvider} from "@azure/msal-react"; 
import { AppProviders } from './contexts/AppProviders';

export const msalInstance = new PublicClientApplication(msalConfig);

const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        msalInstance.setActiveAccount(payload.account);
    }
});

createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <MsalProvider instance={msalInstance}>
            <BrowserRouter>
                <AppProviders>
                    <App />
                </AppProviders>
            </BrowserRouter>
        </MsalProvider>
    </StrictMode>
);
