import { ReactNode } from "react";
import {SelectionProvider} from "./SelectionContext";
import { UserProvider } from "./UserContext";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <SelectionProvider>
            <UserProvider> 
             
                {children}
             
             </UserProvider> 
        </SelectionProvider>
    );
}