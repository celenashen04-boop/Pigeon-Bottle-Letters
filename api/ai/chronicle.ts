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
    const { correspondents, letters } = req.body || {};
    if (!letters || !Array.isArray(letters)) {
      return res.status(400).json({ error: "letters array is required" });
    }

    const systemInstruction = `You are a chronicler of historic epistolary archives. Analyze this ongoing correspondence between two souls.
Provide sensitive literary commentary on:
- chronicleSummary: string (a paragraph about the texture and rhythm of their exchange)
- keyThemes: string[] (3-5 emotional themes)
- emotionalArc: string (a sensitive summary of the bond forged across distance)`;

    const response = await callGeminiWithFallback(ai, {
      contents: `Correspondents: ${correspondents}\n\nLetters:\n${JSON.stringify(letters, null, 2)}`,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("AI correspondence chronicle error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze chronicle" });
  }
}
