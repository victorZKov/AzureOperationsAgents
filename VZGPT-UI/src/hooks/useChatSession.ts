import { useSelection } from "../contexts/SelectionContext";
import {
    createChat,
    addChatMessage,
    streamChatResponse // Import streamChatResponse
} from "../api/ChatApi";
import {ChatHeader} from "../types/Chat";

/**
 * Extrae hasta 15 palabras para generar el título del chat.
 */
function extractTitle(text: string): string {
    return text.split(/\s+/).slice(0, 15).join(" ");
}

export function useChatSession() {
    const { selectedChat, selectChat } = useSelection();

    async function ensureChatSession(firstUserMessage: string): Promise<ChatHeader> {
        if (selectedChat) return selectedChat;

        const title = extractTitle(firstUserMessage);
        const newChat = await createChat(title);
        selectChat(newChat);

        // Do not add the first user message here, it will be added by the component that calls stream
        // await addChatMessage(newChat.Id, "user", firstUserMessage);

        return newChat;
    }

    async function streamMessage(chatId: number, prompt: string, onData: (chunk: string) => void): Promise<void> {
        // Retrieve engine and model from local storage
        const engineName = localStorage.getItem('selectedEngine');
        const modelName = localStorage.getItem('selectedModel');

        if (!engineName || !modelName) {
            console.error("Engine or model not selected. Please select them in settings.");
            // Optionally, call onData with an error message or throw an error
            onData("Error: Engine or model not selected. Please select them in settings."); 
            return;
        }

        // Add user's message to chat history before streaming starts
        await addChatMessage(chatId, "user", prompt);
        const language = localStorage.getItem('selectedLanguage') || 'en'; // Default to English if not set
        await streamChatResponse(prompt, engineName, modelName, language, onData);
    }

    async function addAssistantMessage(chatId: number, message: string, engineName: string, modelName: string): Promise<void> {
        await addChatMessage(chatId, "assistant", message, engineName, modelName );
    }

    return {
        selectedChat,
        ensureChatSession,
        addAssistantMessage,
        streamMessage // Expose streamMessage
    };
}

