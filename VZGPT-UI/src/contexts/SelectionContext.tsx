import { createContext, useContext, useState, ReactNode } from "react";
import { Project } from "../types/Project";
import { ChatHeader } from "../types/Chat";
import { useNavigate } from "react-router-dom";

type SelectionContextType = {
    selectedProject: Project | null;
    selectedChat: ChatHeader | null;
    selectProject: (project: Project) => void;
    selectChat: (chat: ChatHeader) => void;
    setProjects: (projects: Project[]) => void;
    projects: Project[];
    reloadSidebarData: () => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedChat, setSelectedChat] = useState<ChatHeader | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const navigate = useNavigate();
    
    const reloadSidebarData = () => {
        if (typeof window !== "undefined" && window.dispatchEvent) {
            window.dispatchEvent(new Event("refresh-sidebar"));
        }
    };
    const selectProject = (project: Project) => {
        setSelectedProject(project);
        setSelectedChat(null);
    };

    const selectChat = (chat: ChatHeader) => {
        setSelectedChat(chat);

        if (chat.ProjectId) {
            const fullProject = projects.find(p => p.Id === chat.ProjectId);
            if (fullProject) {
                setSelectedProject(fullProject);
            } else {
                // fallback parcial si no está cargado aún
                setSelectedProject({ Id: chat.ProjectId, Name: "(unknown)", UserId: "", CreatedAt: "" });
            }
        } else {
            setSelectedProject(null);
        }
        
        // Always navigate to the chat page when a chat is selected
        navigate('/chat');
    };

    return (
        <SelectionContext.Provider value={{
            selectedProject,
            selectedChat,
            selectProject,
            selectChat,
            setProjects,
            projects,
            reloadSidebarData
        }}>
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection() {
    const context = useContext(SelectionContext);
    if (!context) throw new Error("useSelection must be used within a SelectionProvider");
    return context;
}

