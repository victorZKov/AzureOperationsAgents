import { apiFetchJson, apiFetchStream } from "../services/ApiServices";
import {ChatDetail, ChatHeader} from "../types/Chat";

export async function streamChatResponse(
    prompt: string,
    engineName: string, // Changed from model to engineName
    modelName: string,  // Added modelName
    language: string = "en", // Default language is English
    onData: (chunk: string) => void
): Promise<void> {
    const endpoint = `/api/chat/conversation/`; // Endpoint is now generic
    // Pass engineName and modelName in the request body
    const stream = await apiFetchStream(endpoint, "POST", { prompt, engineName, modelName, language });
    const reader = (stream as ReadableStream<Uint8Array>).getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);

            if (line) {
                // Log with engine and model for clarity
                console.log(`API [${engineName}/${modelName}]: Processing line: [${line}]`);
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.done === true) {
                        console.log(`API [${engineName}/${modelName}]: Parsed 'done:true' chunk. Line: [${line}]`);
                    } else {
                        const content = parsed.response;
                        if (typeof content === 'string') {
                            console.log(`API [${engineName}/${modelName}]: Extracted content: ['${content}'], calling onData.`);
                            onData(content);
                        } else {
                            console.warn(`API [${engineName}/${modelName}]: Parsed JSON, but 'response' field is not a string or is undefined. Content:`, content, `Line: [${line}]`);
                        }
                    }
                } catch (err) {
                    console.warn(`API [${engineName}/${modelName}]: Skipping invalid JSON line: [${line}]`, "Error:", err);
                }
            }
        }
    }
    // Handle any remaining data in the buffer
    if (buffer.trim()) {
        const line = buffer.trim();
        console.log(`API [${engineName}/${modelName}]: Processing remaining buffer: [${line}]`);
        try {
            const parsed = JSON.parse(line);
            if (parsed.done === true) {
                console.log(`API [${engineName}/${modelName}]: Parsed 'done:true' chunk from remaining buffer. Line: [${line}]`);
            } else {
                const content = parsed.response;
                if (typeof content === 'string') {
                    console.log(`API [${engineName}/${modelName}]: Extracted content from remaining buffer: ['${content}'], calling onData.`);
                    onData(content);
                } else {
                    console.warn(`API [${engineName}/${modelName}]: Parsed JSON from remaining buffer, but 'response' field is not a string or is undefined. Content:`, content, `Line: [${line}]`);
                }
            }
        } catch (err) {
            console.warn(`API [${engineName}/${modelName}]: Skipping invalid JSON in remaining buffer: [${line}]`, "Error:", err);
        }
    }
}

export async function getChats(): Promise<ChatHeader[]> {
    return await apiFetchJson("/api/chats", "GET");
}

export async function createChat(title: string): Promise<ChatHeader> {
    return await apiFetchJson("/api/chats", "POST", { title });
}

export async function getChatMessages(chatId: number): Promise<ChatDetail[]> {
    return await apiFetchJson(`/api/chats/${chatId}/messages`, "GET");
}

export async function addChatMessage(
    chatId: number,
    sender: string,
    message: string,
    engineName?: string | null, // Allow engineName to be null
    modelName?: string | null, // Allow modelName to be null
    
): Promise<ChatDetail> {
    return await apiFetchJson(`/api/chats/${chatId}/messages`, "POST", { sender, message, engineName, modelName });
}

export async function deleteChat(chatId: number): Promise<void> {
    await apiFetchJson(`/api/chats/${chatId}`, "DELETE");
}

export async function assignChatToProject(chatId: number, projectId: number): Promise<void> {
    await apiFetchJson(`/api/chats/${chatId}/assign`, "POST", { projectId });
}

export async function deAssignChatToProject(chatId: number): Promise<void> {
    await apiFetchJson(`/api/chats/${chatId}/deassign`, "PUT");
}

