import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { msalInstance } from "../main";
import {User, UserContextType} from "../types/User";



const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            const account = accounts[0];

            const claims = account.idTokenClaims as {
                email?: string;
                roles?: string[];
                groups?: string[];
                _claim_names?: { [key: string]: string };
            };

            const hasGroups = !claims._claim_names?.groups;

            setUser({
                name: account.name || "Guest",
                username: account.username,
                email: claims.email || "",
                roles: claims.roles || [],
                groups: hasGroups ? (claims.groups || []) : []
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
}