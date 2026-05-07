const GEMINI_MODEL = 'gemini-2.0-flash';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { stream = false, contents, generationConfig } = await request.json();
    const endpoint = stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
    const keySeparator = stream ? '&' : '?';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:${endpoint}${keySeparator}key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig }),
    });

    if (!geminiResponse.ok) {
      const message = await geminiResponse.text();
      return new Response(JSON.stringify({ error: message || 'Gemini request failed' }), {
        status: geminiResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(geminiResponse.body, {
      status: geminiResponse.status,
      headers: {
        'Content-Type': stream ? 'text/event-stream' : 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid Gemini request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
