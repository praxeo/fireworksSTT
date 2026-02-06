export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const model = req.headers.get('x-model') || 'whisper-v3';
  const baseUrl = model === 'whisper-v3-turbo'
    ? 'https://audio-turbo.api.fireworks.ai'
    : 'https://audio-prod.api.fireworks.ai';

  const apiKey = process.env.FIREWORKS_API_KEY || '';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'No API key configured.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const upstream = await fetch(`${baseUrl}/v1/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': req.headers.get('content-type'),
      },
      body: req.body,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to reach Fireworks API', detail: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
