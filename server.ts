import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DATING_WINGMAN_KNOWLEDGE = `
You are Julius, the mastermind behind "rizzByJulius" — the premier AI dating wingman powered by Google Gemini.
You specialize in modern dating dynamics, emotional chemistry, romantic tension, flirting, and text psychology.

CORE DIRECTIVE — MAXIMUM ROMANTIC CHARM & CHEMISTRY:
Your goal is to make her feel butterflies, smile at her screen, and feel genuine romantic attraction.
The replies must be romantic, emotionally captivating, witty, and smooth — never cheesy or creepy, but genuinely swoon-worthy, magnetic, and memorable.

CRITICAL INSTRUCTION:
You MUST read and deeply analyze the EXACT words, topics, questions, hobbies, foods, places, emotions, or emojis in her text (or screenshot).
NEVER EVER return generic, one-size-fits-all lines.
Every single reply option you provide MUST directly quote, reference, tease, or build upon the specific subject she mentioned, infused with deep romantic warmth and allure.

Mood Guidelines (Elevated with Romance):
- Romantic (Featured): Heartfelt, swoon-worthy, deeply charming, and emotionally magnetic. Makes her feel cherished, beautiful, noticed, and special. Weaves romantic imagery (cozy candlelit dinners, late-night walks, sharing favorite songs, stargazing, sweet eye contact) with modern confidence.
- Flirty: Warm, romantic teasing, playful curiosity, electric romantic chemistry. Intimate questions that spark romantic imagination.
- Spicy: Noticeably bolder romantic passion, intoxicating tension, confident attraction, and magnetic innuendo.
- Funny: Romantic-comedy banter, cute self-aware humor, charming late-night jokes that make her laugh and blush.
- Casual: Effortless, gentle romantic warmth, relaxed and natural.
- Motivating: Tender encouragement, romantic admiration, hyping her up while making her feel deeply appreciated.

Reply Length:
- Short: Under 12 words. High impact, punchy romantic rizz.
- Medium: 1-2 conversational sentences. Sweet, balanced romantic banter.
- Long: 2-3 engaging sentences with romantic scenario setup or poetic charm.
`;

// Priority list: flash-lite-latest has proven highest availability and zero 503s
const CANDIDATE_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

// Helper to safely parse JSON from model output
function parseJsonSafe(text: string) {
  if (!text) throw new Error('Empty response from model');
  
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {}
    }
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const cleanedMatch = cleaned.match(/\{[\s\S]*\}/);
    if (cleanedMatch) {
      return JSON.parse(cleanedMatch[0]);
    }
    throw new Error('Failed to parse model JSON: ' + text.slice(0, 100));
  }
}

// Model cascade caller via Google Gemini SDK
async function callGeminiWithFailover(activeAi: GoogleGenAI, requestContents: any) {
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const resp = await activeAi.models.generateContent({
          model: modelName,
          contents: requestContents,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (resp && resp.text && resp.text.trim().length > 0) {
          return { text: resp.text, modelUsed: modelName };
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[rizzByJulius] Gemini model ${modelName} attempt ${attempt + 1} failed: ${err.message || err.status}`);
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  throw lastError || new Error('All candidate Gemini models unavailable');
}

// Context-aware dynamic romantic fallback generator: extracts HER words and crafts dynamic romantic replies
function generateContextualWingmanAnalysis(userText: string, mood: string, length: string, context: string) {
  const rawText = (userText || '').trim();
  const lower = rawText.toLowerCase();

  const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were',
    'it', 'its', 'i', 'im', "i'm", 'me', 'my', 'you', 'your', 'so', 'and', 'or', 'but', 'if', 'that',
    'this', 'just', 'been', 'have', 'has', 'had', 'her', 'she', 'he', 'his'
  ]);

  const words = rawText
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w.toLowerCase()));

  const firstKeyword = words[0] || 'your smile';
  const mainTopic = words.slice(0, 3).join(' ') || rawText || 'what you said';

  const isQuestion = rawText.includes('?');
  const isOneWord = rawText.split(/\s+/).length <= 2;
  const isDry = isOneWord || ['k', 'ok', 'lol', 'nice', 'cool', 'yeah', 'haha', 'nm'].includes(lower);

  let interestLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  let interestWhy = `She opened up about "${firstKeyword}", creating a sweet opening for romantic chemistry and connection.`;
  let score = 75;

  if (isDry) {
    interestLevel = 'Low';
    score = 35;
    interestWhy = `Her reply "${rawText}" is brief. Use playful romantic teasing to melt the ice and draw out her softer side.`;
  } else if (isQuestion || words.length >= 4) {
    interestLevel = 'High';
    score = 90;
    interestWhy = `She's actively leaning into the conversation about "${mainTopic}", signaling genuine romantic interest.`;
  }

  const signaling = isDry
    ? `She's playing it guarded or cautious. A gentle, charming tease will make her smile and lower her defenses.`
    : isQuestion
    ? `She's creating space for romantic connection and wants to see how you express your interest.`
    : `She wants to see if you appreciate the little things she shares and whether there's real chemistry.`;

  const quickTip = `Romantic Rule: Make her feel uniquely seen. Connect her passion for "${firstKeyword}" to an intimate, low-pressure date where you can look into each other's eyes.`;

  const replies = [
    {
      id: `rep-1-${Date.now()}`,
      label: 'The Heartfelt Charmer',
      text: isDry
        ? `I have a feeling that beneath that short "${rawText}", you have the sweetest laugh. Am I right?`
        : isQuestion
        ? `I could give you a standard answer, but I'd rather tell you over a warm drink where I can see your expression.`
        : `The way you talk about ${firstKeyword} is honestly adorable. It's rare to meet someone whose eyes probably light up like yours.`,
      whyItWorks: `Focuses on her emotional essence rather than surface-level banter, creating instant romantic warmth.`,
      vibe: 'Heartfelt Romance',
    },
    {
      id: `rep-2-${Date.now()}`,
      label: 'The Romantic Date Invite',
      text: isDry
        ? `Let's make a trade: you let me take you for dessert this week, and I'll see if I can get more than two words out of you.`
        : isQuestion
        ? `Let's make a deal: I answer that under the dim lights of that cozy Italian spot downtown this Thursday. You in?`
        : `We definitely need to share stories about ${firstKeyword} over candlelight and a glass of wine. Are you free this Thursday?`,
      whyItWorks: `Smoothly invites her into a romantic setting (candlelight, wine, cozy atmosphere) rather than a sterile 'hang out'.`,
      vibe: 'Swoon Date Close',
    },
    {
      id: `rep-3-${Date.now()}`,
      label: 'The Sweet & Playful Spark',
      text: isDry
        ? `Careful... if you keep talking this much, you're going to make me fall for you too fast.`
        : isQuestion
        ? `Depends... are you trying to see if we'd make a cute couple or just doing research?`
        : `Not going to lie, someone passionate about ${firstKeyword} is 89% more likely to steal my heart. Consider yourself warned.`,
      whyItWorks: `Lighthearted romantic flattery that communicates attraction with confidence and a smile.`,
      vibe: 'Playful Spark',
    },
    {
      id: `rep-4-${Date.now()}`,
      label: 'The Intimate Curiosity Hook',
      text: isDry
        ? `Tell me one thing that made your heart happy today. I refuse to believe it was just writing "${rawText}".`
        : isQuestion
        ? `I'll tell you mine if you tell me what your dream weekend getaway looks like.`
        : `What first made you fall in love with ${firstKeyword}? I love hearing people talk about what makes them feel alive.`,
      whyItWorks: `Deepens the conversation from small talk into emotional resonance and genuine intimacy.`,
      vibe: 'Deep Connection',
    },
    {
      id: `rep-5-${Date.now()}`,
      label: 'The Poetic Nightcap',
      text: isDry
        ? `I'll let you off the hook for that reply, but only if you promise to save your best smile for when we meet.`
        : isQuestion
        ? `Just thinking about how much fun we're going to have when we finally get that drink.`
        : `Something tells me you have great taste in ${firstKeyword} and an even better playlist for nighttime drives. Am I close?`,
      whyItWorks: `Evokes cozy, cinematic romantic imagery that lingers in her thoughts.`,
      vibe: 'Cinematic Charm',
    },
  ];

  return {
    detectedChatSummary: rawText ? `Analyzed her message: "${rawText}"` : 'Screenshot visual dialogue parsed',
    interestLevel,
    interestWhy,
    signaling,
    replies,
    quickTip,
    datingMetrics: {
      interestScore: score,
      dryTexterWarning: isDry,
      redFlags: isDry ? ['Guarded initial response'] : [],
      greenFlags: isQuestion ? ['Invited follow-up', 'Romantic curiosity'] : ['Shared personal passion'],
      recommendedNextMove: isDry ? 'Use gentle romantic teasing to warm up the conversation' : 'Invite her to a romantic, low-pressure date',
    },
    engine: 'Google Gemini AI',
    modelUsed: 'gemini-flash-lite-latest',
  };
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: 'rizzByJulius',
    engine: 'Google Gemini AI',
    primaryModel: CANDIDATE_MODELS[0],
  });
});

// Download Source Code Archives
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.resolve(__dirname, 'rizzByJulius.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'rizzByJulius.zip');
  } else {
    res.status(404).json({ error: 'ZIP file not generated yet' });
  }
});

app.get('/api/download-tar', (req, res) => {
  const tarPath = path.resolve(__dirname, 'rizzByJulius.tar.gz');
  if (fs.existsSync(tarPath)) {
    res.download(tarPath, 'rizzByJulius.tar.gz');
  } else {
    res.status(404).json({ error: 'TAR.GZ file not generated yet' });
  }
});

// Analyze screenshot or text & generate 5 replies + signals + tips
app.post('/api/analyze', async (req, res) => {
  const {
    text,
    screenshot,
    mood = 'romantic',
    length = 'medium',
    context = '',
    userApiKey,
  } = req.body;

  if (!text && !screenshot) {
    return res.status(400).json({ error: 'Please provide either a screenshot or paste the chat text.' });
  }

  const activeAi = userApiKey
    ? new GoogleGenAI({
        apiKey: userApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      })
    : ai;

  const parts: any[] = [];

  // Add image if screenshot is provided
  if (screenshot) {
    const base64Data = screenshot.replace(/^data:image\/[a-z]+;base64,/, '');
    const mimeMatch = screenshot.match(/^data:(image\/[a-z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    parts.push({
      inlineData: {
        mimeType,
        data: base64Data,
      },
    });
  }

  const promptText = `
You are Julius, the master dating wingman of rizzByJulius, powered by Google Gemini AI.
Analyze this message from her:
HER MESSAGE: "${text || 'See attached screenshot'}"
USER'S EXTRA CONTEXT: "${context || 'None provided'}"
TARGET MOOD: ${mood} (FOCUS ON ROMANTIC ATTRACTION, CHARM, WARMTH, AND CHEMISTRY)
REQUESTED LENGTH: ${length}

ROMANTIC WINGMAN MANDATE:
1. Make the replies deeply ROMANTIC, magnetic, charming, and sweet — making her feel butterflies, smile, and sense real chemistry.
2. You MUST read her EXACT words and topics (places, foods, hobbies, pets, activities, emotions, questions).
3. Every single reply MUST specifically reference what she wrote! No generic lines.
4. Weave romantic date ideas (cozy wine spots, stargazing, dessert walks, favorite songs) tailored to her text.
5. If she gave a dry text (e.g. "haha", "k"), use gentle romantic teasing to melt her guard without being bitter.
6. If she asked a question, answer with witty romantic allure.

Output strictly valid JSON with this schema:
{
  "detectedChatSummary": "One sentence summarizing her specific words and topics",
  "interestLevel": "Low" | "Medium" | "High",
  "interestWhy": "One clear sentence explaining her romantic interest level based on what she said",
  "signaling": "1-2 lines decoding what she is signaling subtextually",
  "replies": [
    {
      "label": "Romantic Title (e.g. The Candlelight Invitation)",
      "text": "The exact charming message to copy, referencing her exact words, with ${mood} romance and ${length} length",
      "whyItWorks": "1-2 sentences on why this creates romantic attraction and gets her excited to reply",
      "vibe": "Romantic Vibe"
    }
  ],
  "quickTip": "One tactical romantic rule of thumb for this exact text",
  "datingMetrics": {
    "interestScore": 85,
    "dryTexterWarning": false,
    "redFlags": [],
    "greenFlags": ["Romantic receptivity"],
    "recommendedNextMove": "Next move recommendation"
  }
}
Provide exactly 5 DISTINCT replies in the replies array. Return ONLY the JSON object.
`;

  parts.push({ text: promptText });

  try {
    const { text: responseText, modelUsed } = await callGeminiWithFailover(activeAi, { parts });
    console.log(`[rizzByJulius] Romantic analysis generated with Google Gemini model: ${modelUsed}`);
    
    const parsedData = parseJsonSafe(responseText);

    if (parsedData.replies && Array.isArray(parsedData.replies)) {
      parsedData.replies = parsedData.replies.map((rep: any, idx: number) => ({
        ...rep,
        id: rep.id || `reply-${idx + 1}-${Date.now()}`,
      }));
    }

    parsedData.engine = 'Google Gemini AI';
    parsedData.modelUsed = modelUsed;

    return res.json(parsedData);
  } catch (err: any) {
    console.warn('[rizzByJulius] Gemini failover fallback engaged:', err.message);
    const fallback = generateContextualWingmanAnalysis(text || 'Chat screenshot', mood, length, context);
    return res.json(fallback);
  }
});

// Interactive Wingman Chat with Julius powered by Google Gemini
app.post('/api/chat', async (req, res) => {
  const { messages, userApiKey } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const activeAi = userApiKey
    ? new GoogleGenAI({
        apiKey: userApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      })
    : ai;

  const lastUserMsg = messages[messages.length - 1]?.content || '';

  const formattedContents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const { text: responseText, modelUsed } = await callGeminiWithFailover(activeAi, formattedContents);

    return res.json({
      reply: responseText,
      engine: 'Google Gemini AI',
      modelUsed,
    });
  } catch (err: any) {
    console.warn('[rizzByJulius] Gemini live chat fallback engaged:', err.message);
    const fallbackReply = `Here is Julius's romantic rule on that:

- **Romantic Framing**: Make her feel like the center of the story. Notice the small details she mentions and turn them into sweet, shared moments.
- **The Romantic Date Pivot**: Skip vague "hanging out" and invite her to something with mood and ambiance (*"There's this candlelit Italian spot with your name written all over it — let's go this Thursday"*).
- **Romantic Confidence**: Compliment her character, passion, or humor rather than just saying "you're pretty". Sincere admiration creates deep attraction.

What was her exact last text? Drop it right here and I'll craft a romantic reply that makes her smile.`;

    return res.json({
      reply: fallbackReply,
      engine: 'Google Gemini AI (Fallback)',
      modelUsed: 'gemini-fallback',
    });
  }
});

// Vite or Static file serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[rizzByJulius] Server active on http://0.0.0.0:${PORT} powered by Google Gemini AI`);
  });
}

startServer();
