// file: src/pages/Chat.tsx

import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { ErrorComponent } from "../components/ErrorComponent";
import { Loading } from "../components/Loading";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import ChatWithAuth from "../components/ChatWithAuth";

export default function Chat() {
    //console.log("Chat component loaded");
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
