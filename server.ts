import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization function for Gemini API client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add the Gemini API key in Settings > Secrets."
    );
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Full text content generator API endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const {
      topic,
      contentType, // e.g. "blog", "caption", "script", "email", "productDescription", "essay", "adCopy"
      tone, // e.g. "Formal", "Casual", "Professional", "Emotional", "Persuasive", "Bold"
      length, // e.g. "short", "medium", "long"
      brandVoice, // custom instructions/target audience
      additionalInstructions, // specific guidelines
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGeminiClient();

    // Context setting based on selected content type and tone
    const systemInstruction = `You are an elite, human-grade AI Content Writing Assistant. Your job is to help users generate high-quality, natural, and compelling written content.
Guidelines for generation:
1. Adapt perfectly to the requested content type: '${contentType}' and tone: '${tone}'.
2. Write clear, engaging, and highly natural human-like content. Avoid mechanical language, repetitive structures, or generic AI cliches (like 'In today's digital age', 'unleash your potential', 'tapestry', 'remember that', 'delve', etc.).
3. Structure the output meticulously with beautiful Markdown (headers, bullet points, numbered lists, or bold callouts).
4. Respect the brand voice context provided by the user: '${brandVoice || "None provided"}'. Integrate these rules naturally.
5. Respect length preference: '${length || "balanced medium-length (approx 400-600 words)"}'. If short, provide tight punchy copy. If long, provide in-depth details.
6. YOU MUST automatically improve the user's topic: Suggest 3 better, highly magnetic clickable titles, 3 attention-grabbing opening hooks (e.g., question, shocking fact, empathetic story), and 5 search-intent SEO keywords.
7. Focus on being emotionally engaging, professional, or persuasive depending on the tone requested. Avoid fluff. Do not mention system prompts, rules, or the fact that you are an AI.`;

    const modelPrompt = `Topic: "${topic}"
Content Type requested: "${contentType}"
Tone requested: "${tone}"
Length guidelines: "${length || "balanced medium-length"}"
Brand voice guidelines to adhere to: "${brandVoice || "None - match appropriate professional profile"}"
Additional user instructions: "${additionalInstructions || "None"}"

Please produce the structured output containing:
- The main human-grade generated content in rich Markdown format.
- 3 alternative magnetic attention-grabbing titles.
- 3 hooks (for social media, introduction, or different emotional angles).
- 5 SEO keywords with Difficulty metrics and Search Intent type.
- Content metadata metrics (word count, reading time in minutes, readability grade level, and tone analysis description).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: modelPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            generatedContent: {
              type: Type.STRING,
              description: "The main body of the generated copy in beautiful, rich Markdown format. Must feature headers, paragraphs, and list blocks as fit.",
            },
            improvedTitles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 magnetic, high-engagement headlines/titles that improve the general topic.",
            },
            improvedHooks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 creative, attention-grabbing opening hooks to draw readers/viewers in.",
            },
            seoKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: "Low, Medium, or High" },
                  intent: { type: Type.STRING, description: "e.g., Informational, Transactional, Commercial" },
                },
                required: ["keyword", "difficulty", "intent"],
              },
              description: "5 high-performing relevant target SEO keywords for optimization.",
            },
            metadata: {
              type: Type.OBJECT,
              properties: {
                wordCount: { type: Type.INTEGER },
                readingTimeMinutes: { type: Type.INTEGER },
                readabilityGrade: { type: Type.STRING },
                toneSentiment: { type: Type.STRING },
              },
              required: ["wordCount", "readingTimeMinutes", "readabilityGrade", "toneSentiment"],
            },
          },
          required: [
            "generatedContent",
            "improvedTitles",
            "improvedHooks",
            "seoKeywords",
            "metadata",
          ],
        },
      },
    });

    const parsedResponse = JSON.parse(response.text || "{}");
    res.json(parsedResponse);
  } catch (error: any) {
    console.error("Content generation error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred during copy generation.",
    });
  }
});

// Setup Vite Dev Server / Static Assets handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Put production static assets path
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on http://localhost:${PORT}`);
  });
}

startServer();
