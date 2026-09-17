const ASSISTANT_ENDPOINT = '/api/mistral';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class AssistantError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function extractDeltaContent(parsed: unknown): string {
  if (!parsed || typeof parsed !== 'object') return '';

  const choices = (parsed as { choices?: unknown[] }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return '';

  const delta = (choices[0] as { delta?: { content?: unknown } }).delta;
  const content = delta?.content;

  if (typeof content === 'string') return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (
          part &&
          typeof part === 'object' &&
          'text' in part &&
          typeof (part as { text?: unknown }).text === 'string'
        ) {
          return (part as { text: string }).text;
        }
        return '';
      })
      .join('');
  }

  return '';
}

function parseSseEvent(event: string, onText: (text: string) => void) {
  const lines = event
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('data: '));

  for (const line of lines) {
    const data = line.slice(6).trim();
    if (!data || data === '[DONE]') continue;

    try {
      const text = extractDeltaContent(JSON.parse(data));
      if (text) onText(text);
    } catch {
      // Ignore malformed partial SSE chunks.
    }
  }
}

/**
 * Envoie l'historique au proxy serveur, qui injecte lui-même le contexte du portfolio,
 * et stream la réponse morceau par morceau.
 */
export async function callAssistant(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
): Promise<string> {
  const response = await fetch(ASSISTANT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok || !response.body) {
    let message = 'Assistant indisponible.';
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // Réponse non JSON.
    }
    throw new AssistantError(message, response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';
  const handleText = (text: string) => {
    fullText += text;
    onChunk(text);
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';
    events.forEach((event) => parseSseEvent(event, handleText));
  }

  if (buffer.trim()) parseSseEvent(buffer, handleText);

  return fullText;
}
