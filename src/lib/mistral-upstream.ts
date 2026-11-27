type UpstreamOptions = {
  apiKey: string;
  models: string[];
  body: Record<string, unknown>;
  fetchImpl?: typeof fetch;
};

export async function callMistral({ apiKey, models, body, fetchImpl = fetch }: UpstreamOptions) {
  let lastResponse: Response | null = null;
  // One shared deadline prevents model retries from multiplying the wait.
  const signal = AbortSignal.timeout(20_000);
  for (const model of models) {
    const response = await fetchImpl('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ ...body, model }),
      signal,
    });
    if (response.ok) return response;

    let invalidModel = false;
    if (response.status === 400) {
      const detail = await response.clone().json().catch(() => null);
      const error = detail?.error ?? detail;
      invalidModel = error?.code === 1500 || error?.type === 'invalid_model';
    }
    lastResponse = response;
    if (!invalidModel && ![403, 404, 429, 500, 502, 503, 504].includes(response.status)) break;
    console.warn(`[assistant] model unavailable: ${model} (${response.status})`);
  }
  return lastResponse;
}

export function upstreamErrorCode(status: number) {
  if (status === 401) return 'UPSTREAM_AUTH';
  if (status === 403) return 'UPSTREAM_ACCESS';
  if (status === 402) return 'UPSTREAM_BILLING';
  if (status === 429) return 'UPSTREAM_QUOTA';
  if (status === 400 || status === 404 || status === 422) return 'UPSTREAM_REQUEST';
  return 'UPSTREAM_UNAVAILABLE';
}
