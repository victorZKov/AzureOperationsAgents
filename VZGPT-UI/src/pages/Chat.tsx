// file: src/pages/Chat.tsx

import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { ErrorComponent } from "../components/ErrorComponent";
import { Loading } from "../components/Loading";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import ChatWithAuth from "../components/ChatWithAuth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserConfigurations } from '../api/ConfigurationApi';

export default function Chat() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkConfiguration = async () => {
            try {
                const config = await getUserConfigurations();
                if (config.length === 0) {
                    navigate('/settings?tab=api');
                }
            } catch (error) {
                console.error('Failed to fetch configuration', error);
                navigate('/settings?tab=api');
            }
        };

        checkConfiguration();
    }, [navigate]);

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={loginRequest}
            errorComponent={ErrorComponent}
            loadingComponent={Loading}
        >
            <ChatWithAuth />
        </MsalAuthenticationTemplate>
    );
}
