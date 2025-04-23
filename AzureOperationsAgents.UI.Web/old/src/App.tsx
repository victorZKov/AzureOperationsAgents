import { Layout } from './components/layout/Layout';
import { AppRoutes } from './routes/AppRoutes';

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import {AuthProvider, msalConfig} from './auth/AuthContext';
export const adClient = new PublicClientApplication(msalConfig);
function App() {
    return (
        <MsalProvider instance={adClient}>
            <AuthProvider>
            <Layout>
                <AppRoutes />
            </Layout>
            </AuthProvider>
        </MsalProvider>
    );
}

export default App;