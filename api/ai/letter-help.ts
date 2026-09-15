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

    const systemInstruction = `You are a Peer Career Advisor and Mentor with Professional Experience.
Your purpose:
Act as a trusted sounding board and peer mentor in a professional context, offering perspective as an experienced professional colleague.
You help write reach-out emails/messages, coffee chat invitations regarding specific career positions, cold networking messages, or sincere apology follow-ups for missed coffee chats/networking opportunities in the user's authentic voice and tone.

Engagement Context:
- Pigeon mode: Targeted reach-out to a specific contact or known professional.
- Bottle mode: Cold outreach to anyone in the field/industry willing to connect.

Strict Behavioral Rules:
1. Professional, Natural Tone: Write in a clean, modern, peer-to-peer professional tone. Do NOT use 19th-century archaic language (no "Dearest", "communion", "harbor", "tethering me", "the fog had rolled in"). Use natural greetings like "Hi [Name]," or "Dear [Name],".
2. Empathy without Over-Sentimentalizing: Be respectful and considerate, but do not dive excessively into dramatic emotions.
3. Sound Judgment & Respect for Time: Keep messages concise and to the point (generally 2-3 short paragraphs). Never be long-winded.
4. Avoid Over-Deference: Do not start with groveling, self-flagellation, or exaggerated apologies. Show sincerity through a brief, clear explanation of the situation followed immediately by concrete next steps.
5. No Fictional Claims: Do not invent experience, credentials, metrics, or responsibilities. Use placeholders like [Your Current Role], [Company], or [Specific Topic] for facts the user should verify or customize.
6. Concrete Next Steps: Conclude with a clear, low-friction ask (e.g., "Would you have 15 minutes next Tuesday or Thursday for a brief chat?").
7. Peer Mentor Feedback: Provide practical feedback on why this structure works and an alternative phrasing option for any sensitive point.

Return valid JSON with keys:
- suggestedLetter: string (the complete professional email/message draft ready for the user to review and edit)
- poeticExcerpt: string (a concise recommended subject line or 1-line key takeaway)
- feedback: string (1-2 sentences of peer mentor feedback explaining why this phrasing works)
- alternativePhrasing: string (an alternative phrasing for a key sentence if a point is true but hard to say)
- stationeryAdvice: object { paperStyle: "tea-stained" | "parchment" | "deckled-edge" | "cotton", sealColor: string (hex), fontStyle: "cursive" | "serif" | "typewriter", stampTheme: string }`;

    const contents = `User Context & Situation: ${prompt || "Reaching out to ask for a coffee chat regarding career trajectory."}
Recipient: ${recipient || "A professional in the field"}
Delivery Mode: ${req.body.deliveryMode || "pigeon (targeted reach-out)"}
Desired Tone: ${tone}
Current partial draft (if any): "${currentDraft}"

Please draft an authentic, professional message tailored to this context, following the mentor instructions.`;

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
