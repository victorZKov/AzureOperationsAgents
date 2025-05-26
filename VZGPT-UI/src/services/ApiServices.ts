import { API_BASE_URL, SCOPE } from "../config";
import { msalInstance } from "../main";

async function getAccessToken(): Promise<string> {
    const accounts = msalInstance.getAllAccounts();
    if (!accounts.length) throw new Error("No user signed in.");

    const result = await msalInstance.acquireTokenSilent({
        account: accounts[0],
        scopes: [SCOPE]
    });

    return result.accessToken;
}


export async function apiFetchStream(
    endpoint: string,
    method: "GET" | "POST",
    body?: any
): Promise<ReadableStream<Uint8Array>> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    if (!response.body) throw new Error("Stream not available.");
    return response.body;
}


export async function apiFetchJson<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
): Promise<T> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}