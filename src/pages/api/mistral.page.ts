import type { NextApiRequest, NextApiResponse } from 'next';
import { getAssistantSystemPrompt } from '../../lib/assistant-context';

// Clé strictement serveur : jamais de variante NEXT_PUBLIC_/VITE_ (elles sont exposées au navigateur).
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY ?? '';
const MISTRAL_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions';

// Le modèle « large » n'est plus inclus dans l'abonnement : on essaie les modèles
// dans l'ordre et on bascule sur le suivant en cas de 403 (tier) / 429 (quota).
const MODEL_CHAIN = [
  process.env.MISTRAL_MODEL,
  'mistral-small-latest',
  'open-mistral-nemo',
].filter((model, index, list): model is string => Boolean(model) && list.indexOf(model) === index);

const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1500;
const MAX_TOKENS = 600;

// Limitation best-effort par IP (mémoire d'instance serverless).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 25;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export const config = {
  api: {
    bodyParser: { sizeLimit: '32kb' },
    responseLimit: false,
  },
};

type ChatRole = 'user' | 'assistant';

function getClientIp(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (rateBuckets.size > 5000) {
      rateBuckets.forEach((entry, key) => {
        if (entry.resetAt < now) rateBuckets.delete(key);
      });
    }
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_MAX_REQUESTS;
}

function isSameOrigin(req: NextApiRequest) {
  const origin = req.headers.origin;
  if (!origin) return true; // requêtes non-navigateur : couvertes par le rate limit
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function sanitizeMessages(input: unknown): { role: ChatRole; content: string }[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const messages = input
    .slice(-MAX_MESSAGES)
    .filter(
      (message): message is { role: ChatRole; content: string } =>
        Boolean(message) &&
        typeof message === 'object' &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.trim().length > 0,
    )
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, MAX_MESSAGE_CHARS),
    }));

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') return null;
  return messages;
}

async function callUpstream(body: Record<string, unknown>) {
  let lastResponse: Response | null = null;

  for (const model of MODEL_CHAIN) {
    const response = await fetch(MISTRAL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({ ...body, model }),
    });

    if (response.ok) return response;

    lastResponse = response;
    if (![403, 404, 429, 500, 502, 503].includes(response.status)) break;
    console.warn(`[assistant] modèle ${model} indisponible (${response.status}), bascule.`);
  }

  return lastResponse;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: 'Origine non autorisée.' });
  }

  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({ error: 'Trop de messages, réessayez dans quelques minutes.' });
  }

  if (!MISTRAL_API_KEY) {
    console.error('[assistant] MISTRAL_API_KEY manquante.');
    return res.status(503).json({ error: 'Assistant indisponible.' });
  }

  const messages = sanitizeMessages((req.body as { messages?: unknown } | undefined)?.messages);
  if (!messages) {
    return res.status(400).json({ error: 'Requête invalide.' });
  }

  let systemPrompt: string;
  try {
    systemPrompt = await getAssistantSystemPrompt();
  } catch (error) {
    console.error('[assistant] contexte:', error);
    return res.status(503).json({ error: 'Assistant indisponible.' });
  }

  const upstream = await callUpstream({
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: MAX_TOKENS,
    temperature: 0.6,
    stream: true,
  });

  if (!upstream || !upstream.ok || !upstream.body) {
    const status = upstream?.status ?? 502;
    console.error('[assistant] Mistral:', status, upstream ? await upstream.text() : 'no response');
    return res
      .status(status === 429 ? 429 : 502)
      .json({ error: status === 429 ? 'Assistant très sollicité, réessayez dans un instant.' : 'Assistant indisponible.' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(decoder.decode(value, { stream: true }));
  }

  res.end();
}
