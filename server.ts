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
    const { prompt, recipient, tone = "nostalgic and poetic", currentDraft = "" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Atmospheric fallback when no key is set yet
      const recipientName = recipient || "an old friend across the sea";
      return res.json({
        suggestedLetter: `Dearest ${recipientName},\n\nThe fog has rolled in over the harbour tonight, softening the edge of the world until only the lantern on the pier remains. I found myself thinking of the unhurried hours we once shared, before the rush of everyday life drew its invisible borders between us.\n\nI am entrusting these words to the wind and wings of a traveler. May it find you when the evening is quiet, perhaps with tea cooling beside your window. Remember that distance is only the silence between two musical notes—necessary, and full of quiet grace.\n\nYours in slow wanderlust,\nA Wandering Pen`,
        poeticExcerpt: "Distance is only the silence between two notes—necessary, and full of quiet grace.",
        stationeryAdvice: {
          paperStyle: "parchment",
          sealColor: "#7c2d12",
          fontStyle: "cursive",
          stampTheme: "migratory-swallow",
        },
      });
    }

    const systemInstruction = `You are a quiet, poetic letter-writing scribe for "Drift", a slow messaging app inspired by 19th-century epistolary culture, maritime bottles, and carrier pigeon post. 
Write or refine a warm, deeply human letter that feels tangible, slow, and sincere based on the user's topic or context description. Never use modern slang, emojis, or corporate phrases. Embrace atmosphere, tactile sensory details (weather, lamplight, sea air, paper, seasons), and unhurried emotional intimacy.
Return valid JSON with keys:
- suggestedLetter: string (the complete letter with salutation, evocative paragraphs, and signoff)
- poeticExcerpt: string (a one-line lyrical quote from the letter suitable for a wax envelope quote)
- stationeryAdvice: { paperStyle: 'parchment' | 'tea-stained' | 'linen' | 'midnight-vellum' | 'botanical-pressed', sealColor: string (hex), fontStyle: 'cursive' | 'serif' | 'typewriter', stampTheme: string }`;

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
