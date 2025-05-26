import { useSelection } from "../contexts/SelectionContext";
import {
    createChat,
    addChatMessage,
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

        await addChatMessage(newChat.Id, "user", firstUserMessage);

        return newChat;
    }

    async function addAssistantMessage(chatId: number, message: string) {
        await addChatMessage(chatId, "assistant", message);
    }

    return {
        selectedChat,
        ensureChatSession,
        addAssistantMessage,
    };
}