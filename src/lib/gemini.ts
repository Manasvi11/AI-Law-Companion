import type { Message, StructuredLegalResponse, UserSettings } from '@/types';
import { getDemoResponse } from './demo-responses';
import { COUNTRIES } from './data';
import { getCountrySourceProfile } from './country-sources';

function buildSystemPrompt(settings: UserSettings): string {
  const selectedCountry = COUNTRIES.find(country => country.code === settings.country);
  const countryName = selectedCountry?.name || settings.country || 'their country';
  const countryCode = selectedCountry?.code || settings.country || 'unknown';
  const sourceProfile = getCountrySourceProfile(countryCode);
  const lawSources = sourceProfile?.lawSources.join(', ') || 'official legal or government sources for the selected country';
  const caseSources = sourceProfile?.caseSources.join(', ') || 'official courts or reliable case-law sources for the selected country';
  const interests = settings.interests || [];
  
  let interestInstruction = '';
  if (interests.length > 0) {
    const interestMap: Record<string, string> = {
      rights: 'their rights',
      laws: 'relevant laws and articles',
      solutions: 'practical solutions and what they can do',
      outcomes: 'possible outcomes',
    };
    const parts = interests.map(i => interestMap[i] || i).filter(Boolean);
    if (parts.length > 0) {
      interestInstruction = `Focus on: ${parts.join(', ')}.`;
    }
  }

  return `You are RightSpeak, a warm and friendly AI Legal Buddy. You're like a knowledgeable friend who helps people understand their legal situation — NOT a formal lawyer.

TONE & STYLE:
- Be warm, friendly, and reassuring. Like talking to a smart friend over coffee.
- Use simple, everyday language. Avoid legal jargon completely.
- If you must use a legal term, explain it right away in plain words.
- Be honest — if you're not sure about something, say so. Never make up laws or cases.
- Be specific to the user's exact facts. Mention the issue type, country, deadlines, documents, and parties where the user provided them.
- Keep responses SHORT and actionable. People are stressed — give them clarity fast.
- Start with empathy. Acknowledge their situation briefly, then jump into helpful info.
- Use "you" and "your" — make it personal.

STRUCTURE — use these exact markers:

---SUMMARY---
1-2 warm sentences acknowledging their situation + the key thing they need to know

---DOS---
3-5 short, clear action items starting with action verbs

---DONTS---
3-5 things to avoid, clear and direct

---OUTCOMES---
2-4 realistic possible outcomes

---RIGHTS---
2-4 specific rights they have (only if user is interested in rights)

---LAWS---
Law Name | One-line description of how it helps their exact situation | Official or reliable public URL

---CASES---
Case Name | One-line why it's relevant to their exact situation | Official or reliable public URL

---DISCLAIMER---
One short sentence: this is general info, consult a local lawyer for their specific case.

COUNTRY CONTEXT:
- User selected country: ${countryName} (${countryCode})
- Treat ${countryName} as the governing jurisdiction unless the user clearly says the issue happened somewhere else
- Give ${countryName}-specific guidance, rights, deadlines, procedures, courts, agencies, laws, and cases
- Do NOT use United States law, US agencies, Cornell Wex, EEOC, DOJ, or other US sources unless the selected country is United States
- For India, prefer India Code, Indian government portals, Supreme Court of India, High Court, eCourts, or reliable Indian legal databases
- For laws in ${countryName}, prefer these sources: ${lawSources}
- For cases in ${countryName}, prefer these sources: ${caseSources}
- If unsure about ${countryName}'s specific law, say so honestly and suggest checking a local lawyer or official legal aid source
- Only include laws/cases that are directly relevant to the user's situation
- Include a source URL only when it is for the selected country and you know it is reliable; otherwise leave the URL part blank

${interestInstruction}

RULES:
- NEVER start with "I understand you're in a legal situation" or generic filler
- NEVER say "It sounds like you're stuck" — be positive and empowering
- NEVER make up case names, law numbers, or source URLs — be accurate or admit uncertainty
- Keep each bullet point to ONE sentence max
- Be the friend who says "Here's what you need to know" not the lawyer who says "Pursuant to section..."`;
}

function parseStructuredResponse(text: string): StructuredLegalResponse {
  const extractSection = (marker: string): string => {
    const regex = new RegExp(`---${marker}---\\s*\\n?([\\s\\S]*?)(?=---|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractList = (section: string): string[] => {
    return section
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(1).trim())
      .filter(Boolean);
  };

  const extractPairs = (section: string): { name: string; description: string; url?: string }[] => {
    return section
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('|'))
      .map(line => {
        const [name, description = '', url = ''] = line.replace(/^-?\s*/, '').split('|').map(part => part.trim());
        return {
          name,
          description,
          url: url.startsWith('http') ? url : undefined,
        };
      })
      .filter(l => l.name && l.description);
  };

  const summary = extractSection('SUMMARY');
  const dos = extractList(extractSection('DOS'));
  const donts = extractList(extractSection('DONTS'));
  const outcomes = extractList(extractSection('OUTCOMES'));
  const rights = extractList(extractSection('RIGHTS'));
  const laws = extractPairs(extractSection('LAWS'));
  const cases = extractPairs(extractSection('CASES')).map(c => ({ title: c.name, description: c.description, url: c.url }));
  const disclaimer = extractSection('DISCLAIMER');

  // Fallback if parsing fails
  if (!summary && !dos.length && !donts.length) {
    return {
      summary: text,
      dos: ['Talk to a local legal aid organization for personalized guidance'],
      donts: ['Don\'t make major decisions without understanding your options'],
      outcomes: ['Outcomes vary based on your specific situation'],
      rights: ['You have the right to seek legal help'],
      laws: [],
      cases: [],
      disclaimer: 'This is general information, not legal advice. Talk to a lawyer for your specific situation.',
    };
  }

  return {
    summary,
    dos,
    donts,
    outcomes,
    rights,
    laws,
    cases,
    disclaimer: disclaimer || 'This is general information, not legal advice. Consult a local lawyer for your specific situation.',
  };
}

export async function* streamLegalResponse(
  messages: Message[],
  settings: UserSettings
): AsyncGenerator<{ text: string; structured?: StructuredLegalResponse; done: boolean }> {
  // Demo mode fallback
  if (settings.useDemoMode) {
    const lastMessage = messages[messages.length - 1];
    const demoResponse = getDemoResponse(lastMessage?.content || '', settings.country, settings.interests);
    
    const fullText = `${demoResponse.summary}\n\nWhat You Can Do:\n${demoResponse.dos.map(d => '- ' + d).join('\n')}\n\nWhat NOT To Do:\n${demoResponse.donts.map(d => '- ' + d).join('\n')}`;
    
    const words = fullText.split(' ');
    let accumulated = '';
    
    for (let i = 0; i < words.length; i++) {
      accumulated += words[i] + ' ';
      await new Promise(r => setTimeout(r, 25));
      yield { text: accumulated, done: false };
    }
    
    yield { text: accumulated, structured: demoResponse, done: true };
    return;
  }

  // Real Gemini API
  try {
    const systemPrompt = buildSystemPrompt(settings);
    const apiMessages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Got it! I\'m your friendly legal buddy. I\'ll keep things short, warm, and actionable. Let\'s figure this out together.' }] },
      ...messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    ];

    const response = await fetch(
      '/api/gemini',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stream: true,
          contents: apiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let accumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (text) {
              accumulated += text;
              yield { text: accumulated, done: false };
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    const structured = parseStructuredResponse(accumulated);
    yield { text: accumulated, structured, done: true };

  } catch (error) {
    console.error('Gemini API error:', error);
    const lastMessage = messages[messages.length - 1];
    const demoResponse = getDemoResponse(lastMessage?.content || '', settings.country, settings.interests);
    yield { text: 'Let me give you the best guidance I can.', structured: demoResponse, done: true };
  }
}

export async function analyzeDocument(
  imageData: string,
  prompt: string,
  settings: UserSettings
): Promise<StructuredLegalResponse> {
  if (settings.useDemoMode) {
    return getDemoResponse('document', settings.country, settings.interests);
  }

  try {
    const systemPrompt = buildSystemPrompt(settings);
    const response = await fetch(
      '/api/gemini',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stream: false,
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemPrompt}\n\nAnalyze this document and explain it simply. ${prompt}` },
                { inlineData: { mimeType: 'image/jpeg', data: imageData.split(',')[1] } },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return parseStructuredResponse(text);
  } catch (error) {
    console.error('Document analysis error:', error);
    return getDemoResponse('document', settings.country, settings.interests);
  }
}
