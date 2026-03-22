import type { NextApiRequest, NextApiResponse } from 'next';

const MISTRAL_API_KEY =
  process.env.MISTRAL_API_KEY ??
  process.env.NEXT_PUBLIC_MISTRAL_API_KEY ??
  process.env.VITE_MISTRAL_API_KEY ??
  '';
const MISTRAL_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions';

export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
    externalResolver: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!MISTRAL_API_KEY) {
    return res.status(500).json({ error: 'Mistral API key is missing.' });
  }

  const {
    model = 'mistral-large-latest',
    messages = [],
    max_tokens = 800,
    temperature = 0.7,
    stream = true,
  } = (req.body ?? {}) as {
    model?: string;
    messages?: unknown;
    max_tokens?: number;
    temperature?: number;
    stream?: boolean;
  };

  const upstream = await fetch(MISTRAL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
      'HTTP-Referer': req.headers.origin ?? '',
      'X-Title': 'Portfolio Assistant',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens,
      temperature,
      stream,
    }),
  });

  if (!upstream.ok) {
    const errorText = await upstream.text();
    return res.status(upstream.status).send(errorText);
  }

  if (!stream || !upstream.body) {
    const text = await upstream.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(text);
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
