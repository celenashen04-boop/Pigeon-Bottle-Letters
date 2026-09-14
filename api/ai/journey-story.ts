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
    const { letterTitle, deliveryMethod, weatherHistory, status } = req.body || {};

    const systemInstruction = `You are the captain and flight logger of the slow post network. Generate a poetic travel log entry detailing the route, weather encounters, cloud formations, ocean currents, and atmosphere of this letter's voyage.
Return valid JSON with keys:
- travelChronicle: string (a 2-3 sentence evocative narrative of the pigeon's flight or the bottle's voyage across coordinates)
- encounterHighlight: string (a poetic detail like "Rested atop the mast of the schooner Mary Rose during sea mist" or "Navigated through cedar smoke over the northern ridge")
- transitObservation: string`;

    const contents = `Letter: "${letterTitle || "Untitled letter"}"
Method: ${deliveryMethod || "carrier pigeon"}
Weather conditions encountered: ${JSON.stringify(weatherHistory || [])}
Status: ${status}`;

    const response = await callGeminiWithFallback(ai, {
      contents,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("AI journey story error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate journey chronicle" });
  }
}
