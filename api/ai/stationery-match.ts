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
    return res.status(503).json({ error: "Gemini API key is not configured" });
  }

  try {
    const { letterContent } = req.body || {};
    if (!letterContent) {
      return res.status(400).json({ error: "letterContent is required" });
    }

    const systemInstruction = `You are a bespoke Victorian stationer and calligrapher. Given the contents of a letter, suggest the most harmonious physical stationery pairing to elevate its sensory intimacy.
Return valid JSON with keys:
- paperStyle: "tea-stained" | "parchment" | "deckled-edge" | "cotton"
- sealColor: string (hex color code representing seal wax, e.g. deep burgundy #5e1914, forest #1b3d2f, navy #1b263b, brass #b38038, obsidian #222222)
- fontStyle: "cursive" | "serif" | "typewriter"
- recommendedEnclosure: string (e.g. "a sprig of dried rosemary", "a scrap of sea-smoothed sea glass", "a pressed violet petal")
- ambientSoundtrack: string (e.g. "Gentle midnight rainfall against cathedral window panes", "Distant coastal foghorn at ebb tide")
- suggestedPostageStamp: object {
    name: string (e.g. "1884 Botanical Fern 4d"),
    motif: string (e.g. "Pressed Maidenhair fern leaf with gilded border"),
    color: string (hex color code for stamp backdrop)
  }
- decorativeNote: string (poetic one-sentence explanation of why these stationery choices honor the letter's soul)`;

    const response = await callGeminiWithFallback(ai, {
      contents: `Letter content to analyze:\n\n${letterContent}`,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("AI recommend stationery error:", error);
    return res.status(500).json({ error: error.message || "Failed to recommend stationery" });
  }
}
