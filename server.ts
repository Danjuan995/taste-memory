import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully on server-side.");
  } else {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
} catch (err) {
  console.error("Failed to initialize GoogleGenAI:", err);
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Culinary Analysis API Endpoint
app.post("/api/ai-analyze", async (req, res) => {
  try {
    const { dishName, mealType, notes } = req.body;
    if (!dishName) {
      return res.status(400).json({ error: "Dish name is required" });
    }

    if (!ai) {
      console.warn("GEMINI_API_KEY is missing. Providing mock gourmet feedback.");
      // Provide high-quality localized mock answers when API key is missing to keep user feedback premium and fluid
      const fallbackAppreciations = [
        "汤汁在微火慢吞中收至醇厚，香气在盛盘的那一刻绽放，令人不由自主沉浸于人间烟火。每一口都流露出对风味的精准把控，让人感到如家般的无比安心与抚慰。",
        "色彩温润和谐，火候恰如其分，锁住了食材最本真的鲜灵。香辛的风味层次在齿颊间柔和舒展，看似平常却展现出极具灵性的厨艺造诣。",
        "食材的软糯与脆爽相得益彰，天然的甘甜被恰到好处的酱汁点化。入口即是一段温柔的饮食叙事，既有生活的从容，也有对风物的诚挚敬意。"
      ];
      const fallbackSuggestions = [
        "可以在快出锅时点入两滴陈醋或几滴柠檬汁，它那微不可察的酸度能瞬间激发整体风味的立体感与清新度。",
        "建议下一次在爆香基底时加入少许碾碎的青花椒或一小瓣陈皮，能让香气的前调呈现出更有深度的古典质感。",
        "慢煮前可尝试用大火少油两面微煎食材外部，使其产生美拉德反应，不仅能锁住内里肉汁，也让汤底色泽更显金黄透亮。"
      ];
      const selectedIndex = Math.floor(Math.random() * fallbackAppreciations.length);
      return res.json({
        appreciation: fallbackAppreciations[selectedIndex],
        suggestions: fallbackSuggestions[selectedIndex],
        simulated: true
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please write a professional, warm, poetic culinary appreciation and cooking suggestions in Simplified Chinese for the following user entry:
Dish Name: ${dishName}
Meal Category/Type: ${mealType || "美食"}
User's Cooking Notes/Comment: ${notes || "None provided"}`,
      config: {
        systemInstruction: "You are a professional Michelin-star food critic, private chef advisor, and culinary poet. Write elegant, literary appreciation and helpful, detailed kitchen improvement advice in simplified Chinese. Your tone must be soulful, deeply warm, aesthetic, yet highly professional and clear.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appreciation: {
              type: Type.STRING,
              description: "Poetic, warm, and highly visual culinary critique and appreciation of the meal. Highlight its comfort and flavor notes in Chinese.",
            },
            suggestions: {
              type: Type.STRING,
              description: "One or two short, clever, specific professional culinary techniques or seasoning tips to improve the dish next time in Chinese.",
            },
          },
          required: ["appreciation", "suggestions"],
        },
      },
    });

    const text = response.text?.trim() || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze food record" });
  }
});

// Start server with Vite or Static Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tastebuds Memory server successfully online on http://0.0.0.0:${PORT}`);
  });
}

startServer();
