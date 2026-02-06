# Whisper Transcribe

A minimal web UI for audio transcription using Fireworks AI's Whisper v3 API.

## Deploy to Vercel

1. Push this folder to a GitHub repo, or deploy directly:

```bash
cd whisper-transcribe
npx vercel
```

2. Set your Fireworks API key as an environment variable in Vercel:

   - Go to your project **Settings → Environment Variables**
   - Add: `FIREWORKS_API_KEY` = `fw_...your_key...`
   - Redeploy if needed

3. That's it. Visit your deployment URL and upload audio files.

## How it works

- **Frontend**: Static HTML/CSS/JS in `public/index.html`
- **Backend**: A single serverless function at `api/transcribe.js` that proxies requests to Fireworks AI (avoids browser CORS restrictions)
- **API key**: Stored securely as a Vercel env var — never exposed to the browser

## Supported formats

MP3, WAV, FLAC, M4A, OGG, WebM — up to 1 GB.

## Configuration

The function timeout is set to 300s in `vercel.json` to handle long audio files. This requires a Vercel Pro plan for durations >60s. On the free tier, files under ~10 minutes should work fine.
