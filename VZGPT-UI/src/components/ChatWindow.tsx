import { useState, useEffect, useRef, useCallback } from "react";
import {
    Box,
    Divider,
    CircularProgress,
    Typography,
    Paper,
} from "@mui/material";
import {
    streamChatResponse,
    createChat,
    addChatMessage,
    getChatMessages,
    assignChatToProject
} from "../api/ChatApi";
import { useSelection } from "../contexts/SelectionContext";
import { getProjects, createProject } from "../api/ProjectsApi";
import { useTranslation } from "react-i18next";
import AssignProjectDialog from "./AssignProjectDialog";
import ChatPrompt from "./ChatPrompt";
import ChatMessages from "./ChatMessages";
import { Message, Sender } from "../types/Chat";
import { Project } from "../types/Project";

interface ChatWindowProps {
    userName?: string; // Make userName optional since it's not used
}

export default function ChatWindow({ userName }: ChatWindowProps) {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false); 

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);

    // Use useRef to maintain a stable reference to projects that survives rerenders
    const projectsRef = useRef<Project[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [currentChatHeader, setCurrentChatHeader] = useState<any>(null);

    // Stable function reference for setNewProjectName using useCallback
    const [newProjectName, setNewProjectNameState] = useState("");
    const setNewProjectName = useCallback((name: string) => {
        console.log("ChatWindow: setNewProjectName called with:", name);
        setNewProjectNameState(name);
    }, []);

    const { selectProject, selectedChat, reloadSidebarData } = useSelection();
    
    // Reset messages when the component mounts or when navigating between pages
    useEffect(() => {
        console.log("ChatWindow mounted or selectedChat changed - resetting messages");
        setMessages([]);
        setIsLoadingMessages(false);
        
        // If we have a selected chat, load its messages immediately
        if (selectedChat) {
            console.log("Selected chat detected on mount/navigation:", selectedChat.Id);
            loadChatMessages(selectedChat.Id);
        }
    }, []);
    
    // Function to load chat messages
    const loadChatMessages = async (chatId: number) => {
        console.log("Loading messages for chat:", chatId);
        setIsLoadingMessages(true);
        try {
            const result = await getChatMessages(chatId);
            
            // Create properly typed messages with explicit type casting
            const typedMessages: Message[] = result.map(m => {
                // Validate the sender is one of the accepted values
                const validSender: Sender = (m.Sender === "user" || m.Sender === "assistant")
                    ? (m.Sender as Sender)
                    : "assistant";
                    
                // Return a properly typed Message object
                return {
                    sender: validSender,
                    text: m.Message,
                    complete: true
                };
            });
            
            setMessages(typedMessages);
        } catch (error) {
            console.error("Error loading messages:", error);
            setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }
    };
    
    // Watch for changes to selectedChat
    useEffect(() => {
        if (selectedChat) {
            console.log("Selected chat changed:", selectedChat.Id);
            loadChatMessages(selectedChat.Id);
        }
    }, [selectedChat]);

    // Update the ref whenever projects state changes
    useEffect(() => {
        projectsRef.current = projects;
        console.log("ChatWindow: Updated projectsRef with new projects array, length:", projects.length);
    }, [projects]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const result = await getProjects();
                console.log("ChatWindow: Projects loaded in useEffect:", result); // Added log
                setProjects(result);
            } catch (error) {
                console.warn("No se pudieron cargar los proyectos:", error);
            } finally {
                setLoadingProjects(false);
            }
        };
        loadProjects();
    }, []);

    const handleSend = async (message: string, model: string) => {
        if (!message.trim()) return;

        const userMessage: Message = {
            sender: "user",
            text: message
        };
        setMessages(prev => [...prev, userMessage]);

        let chatHeader = currentChatHeader;

        if (!chatHeader) {
            const title = message.trim().split(" ").slice(0, 15).join(" ");
            try {
                const created = await createChat(title);
                setCurrentChatHeader(created);
                chatHeader = created;
                await addChatMessage(chatHeader.Id, "user", message);
                reloadSidebarData();
            } catch (error) {
                console.error("Failed to create chat or save first user message:", error);
                setMessages(prev => prev.filter(m => m !== userMessage)); // Remove user message from UI
                return; 
            }
        } else {
            try {
                await addChatMessage(chatHeader.Id, "user", message);
            } catch (error) {
                console.error("Failed to save user message to existing chat:", error);
                // Optionally, provide feedback to the user. For now, we'll let the assistant try to respond.
            }
        }

        if (!chatHeader) {
            console.error("Chat header is still missing after attempting to create/load. Cannot proceed.");
            return;
        }

        const assistantPlaceholderMessage: Message = {
            sender: "assistant",
            text: "",
            interactive: true,
            complete: false
        };
        setMessages(prev => [...prev, assistantPlaceholderMessage]);

        let accumulatedAssistantText = "";
        let streamErrorOccurred = false;

        try {
            // The 'chunk' parameter from streamChatResponse is now always the pre-extracted string content
            // Read engine and model from localStorage for API call
            const savedEngine = localStorage.getItem('selectedEngine') || '';
            const savedModel = localStorage.getItem('selectedModel') || '';
            const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
            await streamChatResponse(message, savedEngine, savedModel, savedLanguage, (chunkContent) => {
                // console.log(`ChatWindow [${model}]: Received content chunk: ['${chunkContent}']`);
                
                // No model-specific parsing needed here anymore, as ChatApi.ts handles it.
                const newContent = chunkContent; 

                if (newContent) {
                    accumulatedAssistantText += newContent;
                    // console.log(`ChatWindow [${model}]: Accumulated text: ['${accumulatedAssistantText}']`);
                    setMessages(prevMessages => {
                        const updatedMessages = [...prevMessages];
                        const lastMessageIndex = updatedMessages.length - 1;
                        
                        if (lastMessageIndex >= 0 && 
                            updatedMessages[lastMessageIndex].sender === "assistant" &&
                            updatedMessages[lastMessageIndex].complete === false) {
                            
                            const currentAssistantMessage = updatedMessages[lastMessageIndex];
                            updatedMessages[lastMessageIndex] = {
                                ...currentAssistantMessage,
                                text: accumulatedAssistantText,
                            };
                        }
                        return updatedMessages;
                    });
                } else {
                    // This might happen if ChatApi.ts sends an empty string from a chunk's 'response' field.
                    // console.log(`ChatWindow [${model}]: Received empty or undefined content chunk from onData.`);
                }
            });
        } catch (error) {
            console.error("Error during streamChatResponse:", error);
            accumulatedAssistantText = "[Error receiving response]"; 
            streamErrorOccurred = true;
        }

        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const lastMessageIndex = updatedMessages.length - 1;
            if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].sender === "assistant") {
                updatedMessages[lastMessageIndex] = {
                    ...updatedMessages[lastMessageIndex],
                    text: accumulatedAssistantText,
                    complete: true,
                    interactive: !streamErrorOccurred, // Only interactive if no error
                };
            }
            return updatedMessages;
        });

        if (accumulatedAssistantText.trim() && !streamErrorOccurred) {
            try {
                await addChatMessage(chatHeader.Id, "assistant", accumulatedAssistantText);
            } catch (error) {
                console.error("Failed to save assistant message:", error);
            }
        } else if (!accumulatedAssistantText.trim() && !streamErrorOccurred) {
            console.warn("Assistant message was empty, not saving to DB.");
            // Optionally remove the placeholder if it's empty and not an error
            // setMessages(prev => prev.filter(msg => msg !== assistantPlaceholderMessage || msg.text.trim() !== ""));
        }
    };

    const handleLike = (index: number) => {
        console.log("👍 Me gusta:", messages[index].text);
    };

    const handleDislike = (index: number) => {
        console.log("👎 No me gusta:", messages[index].text);
    };

    const handleAddToProject = (index: number) => {
        setSelectedMessageIndex(index);
        // Force reload projects before opening dialog if they're not already loaded
        if (projects.length === 0 || !Array.isArray(projects)) {
            const loadProjects = async () => {
                try {
                    setLoadingProjects(true);
                    const result = await getProjects();
                    console.log("ChatWindow: Projects loaded in handleAddToProject:", result);
                    setProjects(result);
                } catch (error) {
                    console.warn("No se pudieron cargar los proyectos:", error);
                } finally {
                    setLoadingProjects(false);
                    // Only open dialog after projects are loaded
                    setDialogOpen(true);
                }
            };
            loadProjects();
        } else {
            // Log current state before opening dialog
            console.log("ChatWindow: Opening AssignProjectDialog. Projects:", projects, "Loading:", loadingProjects, "NewProjectName:", newProjectName);
            console.log("ChatWindow: setNewProjectName exists:", typeof setNewProjectName === 'function'); // Debug setNewProjectName
            setDialogOpen(true);
        }
    };

    // Add a useEffect to monitor newProjectName changes in ChatWindow
    useEffect(() => {
        console.log("ChatWindow: newProjectName state changed to:", newProjectName);
    }, [newProjectName]);

    const handleProjectSelect = (project: Project) => {
        selectProject(project);
        setDialogOpen(false);
        console.log(t("messageAddedToProject"), messages[selectedMessageIndex!].text);
    };

    const handleCreateNewProject = async (projectName: string) => {
        try {
            const created = await createProject(projectName.trim());
            selectProject(created);
            setDialogOpen(false);
            setNewProjectName(""); // Clear the state in parent
            setProjects(prev => [...prev, created]);

            if (currentChatHeader) {
                try {
                    await assignChatToProject(currentChatHeader.Id, created.Id);
                    console.log(`Chat ${currentChatHeader.Id} asignado al nuevo proyecto ${created.Id}`);
                } catch (err) {
                    console.error(t("errorAssigningChatToProject"), err);
                }
            }

            console.log(t("newProjectCreated"), messages[selectedMessageIndex!].text);
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };
    console.log("ChatWindow: Rendering. Current projects count:", projects.length, "Loading:", loadingProjects, "Dialog open:", dialogOpen); // Log on render
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box flex={1} p={2} overflow="auto">
                {isLoadingMessages ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : (
                    <ChatMessages 
                        messages={messages} 
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onAddToProject={handleAddToProject}
                    />
                )}
            </Box>

            <Divider />
            
            <ChatPrompt onSend={handleSend} />
            
            
            <AssignProjectDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSelect={handleProjectSelect}
                projects={projectsRef.current.length > 0 ? projectsRef.current : projects}
                loading={loadingProjects}
                onCreateProject={handleCreateNewProject}
                newProjectName={newProjectName}
                setNewProjectName={setNewProjectName}
            />
        </Box>
    );
}
