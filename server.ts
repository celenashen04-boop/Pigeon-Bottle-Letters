import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini AI client
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

// Helper for calling Gemini with model fallback (3.1-flash-lite preferred for stability and speed)
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
      console.warn(`Model ${model} request failed, attempting alternative:`, err?.message || err);
    }
  }
  throw lastError;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({ status: "ok", aiConfigured: hasKey });
});

// AI 1: Letter Writing Assistant
app.post("/api/ai/letter-help", async (req, res) => {
  try {
    const { prompt, recipient, tone = "concise & professional", currentDraft = "", deliveryMode = "pigeon" } = req.body;
    const isBottle = deliveryMode === "bottle" || (typeof deliveryMode === "string" && deliveryMode.toLowerCase().includes("bottle"));
    const ai = getGeminiClient();

    if (!ai) {
      // Atmospheric fallback when no key is set yet
      if (isBottle) {
        return res.json({
          suggestedLetter: `Hello,\n\nI am casting this message into the world hoping it reaches someone navigating similar tides in our field. Over the past few seasons, I've been reflecting on our craft and where the industry is heading next.\n\nIf this note happens to wash ashore on your sands and resonates with your own work, I would welcome the chance to exchange thoughts or hear a brief word about your journey.\n\nWishing you fair winds and steady horizons,\nA Fellow Explorer`,
          poeticExcerpt: "An open dispatch cast into the tides for whoever may find it.",
          feedback: "In bottle outreach, the greeting remains warm and universal without assuming the recipient's identity, inviting open serendipity.",
          alternativePhrasing: "If you ever have a few minutes to share your perspective, I would love to hear your thoughts.",
          stationeryAdvice: {
            paperStyle: "ocean-drift",
            sealColor: "#0284c7",
            fontStyle: "serif",
          },
        });
      }

      const recipientName = recipient || "a colleague in the field";
      return res.json({
        suggestedLetter: `Hi ${recipientName},\n\nI hope your week is going well. I've been closely following your work and would love to connect briefly.\n\nWould you have 15 minutes in the coming week or two for a brief chat about your experience in the field?\n\nBest regards,\nA Fellow Colleague`,
        poeticExcerpt: "Brief reach-out to connect on shared interests.",
        feedback: "A direct, low-friction request that respects the recipient's schedule.",
        alternativePhrasing: "If your schedule allows for a brief 15-minute chat, I would welcome the opportunity to connect.",
        stationeryAdvice: {
          paperStyle: "parchment",
          sealColor: "#7c2d12",
          fontStyle: "serif",
        },
      });
    }

    const systemInstruction = `You are a Peer Career Advisor and Mentor with Professional Experience.
Your purpose:
Act as a trusted sounding board and peer mentor in a professional context, offering perspective as an experienced professional colleague.
You help write reach-out emails/messages, coffee chat invitations regarding specific career positions, cold networking messages, or sincere apology follow-ups for missed coffee chats/networking opportunities in the user's authentic voice and tone.

Engagement Context:
- Pigeon mode: Targeted reach-out to a specific contact or known professional.
- Bottle mode: Cold outreach cast into the sea / drift.

CRITICAL REQUIREMENT FOR BOTTLE MODE:
When deliveryMode is "bottle":
- You DO NOT know who will pick up or find the bottle.
- You MUST NEVER address a specific person by name or placeholder! NEVER write "[Name]", "Dear [Name]", "Hi [Name]", specific person names, or personalized titles.
- You MUST use an open, welcoming salutation, such as "Hello,", "Greetings,", "To whoever finds this letter,", or "Hello to whoever unseals this bottle,".
- Frame the body as an open letter/inquiry to any practitioner or explorer in the field who discovers it.
- For Pigeon mode only: You may use targeted greetings like "Hi [Name]," or "Dear [Name],".

Strict Behavioral Rules:
1. Professional, Natural Tone: Write in a clean, modern, peer-to-peer professional tone. Do NOT use 19th-century archaic language (no "Dearest", "communion", "harbor", "the fog had rolled in"). Use natural modern professional greetings.
2. Empathy without Over-Sentimentalizing: Be respectful and considerate, but do not dive excessively into dramatic emotions.
3. Sound Judgment & Respect for Time: Keep messages concise and to the point (generally 2-3 short paragraphs). Never be long-winded.
4. Avoid Over-Deference: Do not start with groveling, self-flagellation, or exaggerated apologies.
5. No Fictional Claims: Do not invent credentials. Use placeholders like [Your Current Role], [Company], or [Topic of Interest] for user-specific facts.
6. Concrete Next Steps: Conclude with a clear, low-friction invitation to connect.
7. Peer Mentor Feedback: Provide practical feedback on why this structure works.

Return valid JSON with keys:
- suggestedLetter: string (the complete message draft ready for the user to review and edit)
- poeticExcerpt: string (a concise recommended subject line or 1-line key takeaway)
- feedback: string (1-2 sentences of peer mentor feedback explaining why this phrasing works)
- alternativePhrasing: string (an alternative phrasing for a key sentence if a point is true but hard to say)
- stationeryAdvice: { paperStyle: 'parchment' | 'tea-stained' | 'linen' | 'midnight-vellum' | 'botanical-pressed' | 'ocean-drift' | 'sea-mist', sealColor: string (hex), fontStyle: 'serif' | 'typewriter' | 'cursive' }`;

    const contents = isBottle
      ? `Delivery Mode: Bottle (Unaddressed oceanic drift letter cast into tides to an unknown finder).
User Context & Situation: ${prompt || "Open reflection and invitation to connect regarding work in this field."}
Desired Tone: ${tone}
Current partial draft (if any): "${currentDraft}"

CRITICAL MANDATORY RULE: Because this is Bottle mode, DO NOT address any specific person. DO NOT use "[Name]" or any individual's name. Use an open greeting like "Hello," or "To whoever finds this letter,".`
      : `Delivery Mode: Pigeon (Targeted reach-out to a specific contact).
Recipient: ${recipient || "A professional in the field"}
User Context & Situation: ${prompt || "Reaching out to ask for a coffee chat regarding career trajectory."}
Desired Tone: ${tone}
Current partial draft (if any): "${currentDraft}"

Please draft an authentic, professional message tailored to this context, following the mentor instructions.`;

    const response = await callGeminiWithFallback(ai, {
      contents,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    
    // Extra safety guard for bottle mode: strip any accidental personal name salutations
    if (isBottle && parsed.suggestedLetter) {
      parsed.suggestedLetter = parsed.suggestedLetter
        .replace(/^(Dear|Hi|Hello|Greetings)\s+(\[Name\]|\[Recipient\]|\[Recipient's Name\]|[A-Z][a-z]+(\s+[A-Z][a-z]+)?),?/im, "Hello,")
        .replace(/^To\s+(\[Name\]|\[Recipient\]),?/im, "To whoever finds this letter,");
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("AI letter help error:", error);
    res.status(500).json({ error: error.message || "Failed to craft letter" });
  }
});

// AI 2: Poetic Formatting & Stationery Styler
app.post("/api/ai/poetic-format", async (req, res) => {
  try {
    const { letterContent } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        formattedLetter: letterContent,
        stationery: {
          paperStyle: "tea-stained",
          fontStyle: "serif",
          sealColor: "#831843",
          inkColor: "#292524",
          borderStyle: "flourish",
        },
        decorativeNote: "Best suited for aged tea-stained parchment with a rose-wax seal and deep sepia ink.",
      });
    }

    const systemInstruction = `Analyze the emotional cadence, themes, and mood of the provided letter. Suggest the ideal classical stationery aesthetics and format the line breaks poetically.
Return JSON with:
- formattedLetter: string (letter with refined spacing, stanza-like pauses, and balanced visual cadence)
- stationery: {
    paperStyle: "parchment" | "tea-stained" | "linen" | "midnight-vellum" | "botanical-pressed",
    fontStyle: "cursive" | "serif" | "typewriter",
    sealColor: string (hex color matching mood, e.g. #7c2d12, #1e3a8a, #064e3b, #701a75, #b45309),
    inkColor: string (hex color for ink e.g. #1c1917, #312e81, #3f2e1a),
    borderStyle: "deckled" | "flourish" | "celestial" | "minimal-rule"
  }
- decorativeNote: string (poetic one-sentence explanation of why these stationery choices honor the letter's soul)`;

    const response = await callGeminiWithFallback(ai, {
      contents: `Letter content to analyze:\n\n${letterContent}`,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI poetic format error:", error);
    res.status(500).json({ error: error.message || "Failed to style stationery" });
  }
});

// AI 3: Translate Letters with Emotional Cadence Preservation
app.post("/api/ai/translate", async (req, res) => {
  try {
    const { letterContent, targetLanguage = "French" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        translatedLetter: `[Letter translated into ${targetLanguage} with preserved romantic cadence]\n\n${letterContent}`,
        poeticNotes: "Rendered with attention to classical rhythm, epistolary courtesy, and melodic pauses.",
      });
    }

    const systemInstruction = `You are a master translator of classical epistolary literature (Rilke, Woolf, Neruda, Tagore).
Translate the letter into ${targetLanguage}. Do not translate mechanically word-for-word; preserve the delicate emotional cadence, sensory metaphors, and quiet nostalgia of slow letter correspondence.
Return JSON with:
- translatedLetter: string
- poeticNotes: string (a short note on the linguistic choices and atmosphere retained)`;

    const response = await callGeminiWithFallback(ai, {
      contents: `Translate this letter into ${targetLanguage}:\n\n${letterContent}`,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI translate error:", error);
    res.status(500).json({ error: error.message || "Failed to translate letter" });
  }
});

// AI 4: Correspondence History Summarizer / Chronicle
app.post("/api/ai/correspondence-summary", async (req, res) => {
  try {
    const { letters, correspondents } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        title: `Chronicle of Letters: ${correspondents || "Two Wandering Souls"}`,
        epistolarySummary: "Across changing seasons and drifting ocean miles, these letters reflect an enduring dialogue of quiet reflection, shared solace, and patience in an accelerated world.",
        keyThemes: ["Patience across distance", "Observations of changing weather", "Quiet companionship"],
        emotionalArc: "Beginning with tentative greetings, softening into deep mutual vulnerability.",
      });
    }

    const systemInstruction = `You are a digital archivist and epistolary historian.
Summarize this correspondence archive into an evocative chronicle of their shared history.
Return JSON with:
- title: string (poetic title for this correspondence bundle)
- epistolarySummary: string (2-3 lyrical paragraphs recounting how their dialogue unfolded across time)
- keyThemes: string[] (3-5 emotional themes)
- emotionalArc: string (a sensitive summary of the bond forged across distance)`;

    const response = await callGeminiWithFallback(ai, {
      contents: `Correspondents: ${correspondents}\n\nLetters:\n${JSON.stringify(letters, null, 2)}`,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI summary error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize correspondence" });
  }
});

// AI 5: Journey Storyteller (for Pigeon Flights and Ocean Bottles)
app.post("/api/ai/journey-story", async (req, res) => {
  try {
    const { itemType, origin, destination, daysPassed, weatherHistory, status } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      if (itemType === "pigeon") {
        return res.json({
          title: "The Flight Across the Lowlands",
          story: `The bird flew beneath slate-grey cloud banks, banking southward along river valleys. On the third twilight, it rested atop an ancient bell tower while bells tolled for evening vespers. Through damp headwinds and sudden star-lit clearings, the message remained secured under its wing.`,
          milestones: [
            "Crossed the river bar at dusk",
            "Sheltered from an Atlantic squall beneath a cedar eave",
            "Rode a high thermals updraft over the pine ridge",
          ],
        });
      } else {
        return res.json({
          title: "Drifting on the North Atlantic Gyre",
          story: `The glass bottle caught the equatorial drift, its wax seal smoothed by salty waves and sun. Schools of flying fish occasionally darted alongside the bottle in bioluminescent night waters. It drifted through quiet calms and violent swells, carrying a stranger's unburdened thoughts.`,
          milestones: [
            "Cast into the coastal surf at ebb tide",
            "Carried 180 nautical miles by the clockwise current",
            "Gently pushed by onshore breakers toward an empty shell beach",
          ],
        });
      }
    }

    const systemInstruction = `You are an imaginative nature chronicler for "Drift".
Write a short, evocative travel chronicle for a carrier pigeon flight or an ocean drift bottle.
Incorporate weather phenomena, wildlife, ocean currents, landscapes, night skies, and the poignant fragility of physical mail.
Return JSON with:
- title: string
- story: string (2 rich, sensory paragraphs describing the journey)
- milestones: string[] (3 specific, poetic waypoint events)`;

    const contents = `Item Type: ${itemType}
Origin: ${origin}
Destination / Shoreline: ${destination || "Open Ocean Waters"}
Days / Time in transit: ${daysPassed}
Weather conditions encountered: ${JSON.stringify(weatherHistory || [])}
Status: ${status}`;

    const response = await callGeminiWithFallback(ai, {
      contents,
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI journey story error:", error);
    res.status(500).json({ error: error.message || "Failed to generate journey chronicle" });
  }
});

// Vite middleware & static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Drift server listening on port ${PORT}`);
  });
}

startServer();
