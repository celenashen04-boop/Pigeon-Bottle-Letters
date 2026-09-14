import { GoogleGenAI } from "@google/genai";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function callGeminiWithFallback(
  ai: GoogleGenAI,
  options: {
    contents: string;
    systemInstruction?: string;
    responseMimeType?: string;
  }
) {
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
        },
      });
      return response;
    } catch (err: any) {
      lastError = err;
    }
  }
  throw lastError;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key is not configured. Please set GEMINI_API_KEY in Vercel Environment Variables.",
    });
  }

  try {
    const { prompt, recipient, tone = "nostalgic & reflective", currentDraft = "" } = req.body || {};

    const systemInstruction = `You are a quiet, poetic letter-writing scribe for "Drift", a slow messaging app inspired by 19th-century epistolary culture, maritime bottles, and carrier pigeon post. 
Write or refine a warm, deeply human letter that feels tangible, slow, and sincere based on the user's topic or context description. Never use modern slang, emojis, or corporate phrases. Embrace atmosphere, tactile sensory details (weather, lamplight, sea air, paper, seasons), and unhurried emotional intimacy.
Return valid JSON with keys:
- suggestedLetter: string (the complete letter with salutation, evocative paragraphs, and signoff)
- poeticExcerpt: string (a one-line lyrical quote from the letter suitable for a wax envelope quote)
- stationeryAdvice: object { paperStyle: "tea-stained" | "parchment" | "deckled-edge" | "cotton", sealColor: string (hex), fontStyle: "cursive" | "serif" | "typewriter", stampTheme: string }`;

    const contents = `Prompt / Topic: ${prompt || "A contemplative note to someone I haven't seen in seasons."}
Recipient: ${recipient || "A cherished acquaintance"}
Desired Tone: ${tone}
Current partial draft (if any): "${currentDraft}"

Please craft this letter.`;

    const response = await callGeminiWithFallback(ai, {
      contents,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("AI letter help error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate letter" });
  }
}
