import { apiFetchJson, apiFetchStream } from "../services/ApiServices";
import {ChatDetail, ChatHeader} from "../types/Chat";

export async function streamChatResponse(
    prompt: string,
    model: string, // model parameter might still be useful for the endpoint, but not for parsing logic
    onData: (chunk: string) => void
): Promise<void> {
    const endpoint = `/api/chat/${model.toLowerCase()}`;
    const stream = await apiFetchStream(endpoint, "POST", { prompt });
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
                console.log(`API [${model}]: Processing line: [${line}]`); // Log model and line
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.done === true) { // Check for done explicitly being true
                        console.log(`API [${model}]: Parsed 'done:true' chunk. Line: [${line}]`);
                        // If it's a final chunk with done:true, we might not expect a 'response' or want to send it.
                        // If there's a response field even when done:true, and it should be processed, adjust this logic.
                        // For now, if done is true, we assume this chunk's primary purpose is the done signal.
                    } else {
                        const content = parsed.response;
                        if (typeof content === 'string') {
                            console.log(`API [${model}]: Extracted content: ['${content}'], calling onData.`);
                            onData(content);
                        } else {
                            console.warn(`API [${model}]: Parsed JSON, but 'response' field is not a string or is undefined. Content:`, content, `Line: [${line}]`);
                        }
                    }
                } catch (err) {
                    console.warn(`API [${model}]: Skipping invalid JSON line: [${line}]`, "Error:", err);
                }
            }
        }
    }
    // Handle any remaining data in the buffer
    if (buffer.trim()) {
        const line = buffer.trim();
        console.log(`API [${model}]: Processing remaining buffer: [${line}]`);
        try {
            const parsed = JSON.parse(line);
            if (parsed.done === true) {
                console.log(`API [${model}]: Parsed 'done:true' chunk from remaining buffer. Line: [${line}]`);
            } else {
                const content = parsed.response;
                if (typeof content === 'string') {
                    console.log(`API [${model}]: Extracted content from remaining buffer: ['${content}'], calling onData.`);
                    onData(content);
                } else {
                    console.warn(`API [${model}]: Parsed JSON from remaining buffer, but 'response' field is not a string or is undefined. Content:`, content, `Line: [${line}]`);
                }
            }
        } catch (err) {
            console.warn(`API [${model}]: Skipping invalid JSON in remaining buffer: [${line}]`, "Error:", err);
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
    message: string
): Promise<ChatDetail> {
    return await apiFetchJson(`/api/chats/${chatId}/messages`, "POST", { sender, message });
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

