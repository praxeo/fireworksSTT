export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read the raw body as a buffer
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);

  // Extract model from a custom header to pick the right endpoint
  const model = req.headers['x-model'] || 'whisper-v3';
  const baseUrl = model === 'whisper-v3-turbo'
    ? 'https://audio-turbo.api.fireworks.ai'
    : 'https://audio-prod.api.fireworks.ai';

  // Use the API key from env, or allow override from header (for flexibility)
  const apiKey = process.env.FIREWORKS_API_KEY || req.headers['x-api-key'] || '';

  if (!apiKey) {
    return res.status(401).json({ error: 'No API key configured. Set FIREWORKS_API_KEY env var.' });
  }

  try {
    const upstream = await fetch(`${baseUrl}/v1/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': req.headers['content-type'],
      },
      body: body,
    });

    const contentType = upstream.headers.get('content-type') || 'application/json';
    const responseBody = await upstream.text();

    res.status(upstream.status);
    res.setHeader('Content-Type', contentType);
    res.send(responseBody);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({ error: 'Failed to reach Fireworks API', detail: err.message });
  }
}
