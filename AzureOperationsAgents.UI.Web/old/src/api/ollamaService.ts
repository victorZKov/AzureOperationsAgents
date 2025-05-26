import { HOST_API } from "src/config-global.local";
import { endpoints, fetcher, IResult } from "src/utils/axios";


export async function sendMessageToOllama(
  prompt: string,
  onChunk: (chunk: string) => void,
  model: string,
  agent: string
) {
    const URL = HOST_API + '/api' + endpoints.ollama.generate;
  const response = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model, agent })
  });

  if (!response.ok || !response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Divide por líneas completas (una por JSON)
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Deja la última línea incompleta en el buffer

    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.response) {
          onChunk(obj.response);
        }
      } catch (e) {
        console.warn('Invalid JSON line:', line);
      }
    }
  }
}