export async function sendMessageToOllama(
    prompt: string,
    onComplete: (fullResponse: string) => void,
    selectedModel: string
) {
    const response = await fetch('/api/GenerateFromOllama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt,
            model: selectedModel
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to generate response: ${response.statusText}`);
    }

    const result = await response.json();

    if (result?.response) {
        onComplete(result.response);
    } else {
        onComplete(result);
    }
}
