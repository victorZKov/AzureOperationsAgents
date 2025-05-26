// file path: src/components/ChatWithAuth.tsx

import { useMsal } from "@azure/msal-react";
import ChatWindow from "./ChatWindow";
import {useUser} from "../contexts/UserContext";

export default function ChatWithAuth() {
    const { accounts } = useMsal();
    const userName = accounts[0]?.username || "Guest";
    //console.log("ChatWithAuth userName", userName);
    const { user } = useUser();

    //console.log(user?.email);
    //console.log(user?.roles);
    //console.log(user?.groups);
    return (
        <div className="h-full">
            <ChatWindow userName={userName} />
        </div>
    );
}
