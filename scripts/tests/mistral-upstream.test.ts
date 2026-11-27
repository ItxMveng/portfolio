import assert from 'node:assert/strict';
import test from 'node:test';
import { callMistral, upstreamErrorCode } from '../../src/lib/mistral-upstream';

test('a retired configured model falls back on invalid_model 400', async () => {
  const calls: string[] = [];
  const fetchImpl = (async (_url, init) => {
    calls.push(JSON.parse(init!.body as string).model);
    return calls.length === 1
      ? Response.json({ code: 1500, type: 'invalid_model' }, { status: 400 })
      : new Response('data: [DONE]\n\n');
  }) as typeof fetch;
  const response = await callMistral({ apiKey: 'test', models: ['retired', 'working'], body: {}, fetchImpl });
  assert.equal(response?.status, 200);
  assert.deepEqual(calls, ['retired', 'working']);
});

test('auth failures and malformed payloads do not retry other models', async () => {
  for (const status of [401, 400]) {
    let calls = 0;
    const fetchImpl = (async () => { calls++; return Response.json({ message: 'error' }, { status }); }) as typeof fetch;
    const result = await callMistral({ apiKey: 'test', models: ['one', 'two'], body: {}, fetchImpl });
    assert.equal(result?.status, status);
    assert.equal(calls, 1);
  }
  assert.equal(upstreamErrorCode(401), 'UPSTREAM_AUTH');
});

test('retryable upstream failures use the next model', async () => {
  let calls = 0;
  const fetchImpl = (async () => new Response('', { status: ++calls === 1 ? 503 : 200 })) as typeof fetch;
  const result = await callMistral({ apiKey: 'test', models: ['one', 'two'], body: {}, fetchImpl });
  assert.equal(result?.status, 200);
  assert.equal(calls, 2);
});
