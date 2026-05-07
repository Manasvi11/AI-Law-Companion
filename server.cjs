require('dotenv').config();
const express = require('express');
const cors = require('cors');

const GEMINI_MODEL = 'gemini-2.0-flash';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const { stream = false, contents, generationConfig } = req.body;
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
      return res.status(geminiResponse.status).json({ error: message || 'Gemini request failed' });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      
      const reader = geminiResponse.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        return res.status(500).json({ error: 'No reader available' });
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
      res.end();
    } else {
      const data = await geminiResponse.json();
      res.json(data);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(400).json({ error: 'Invalid Gemini request' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});