import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// AI Recommendation Endpoint
app.post("/api/ai/recommendations", async (req, res) => {
  try {
    const { userPrefs, currentMenu } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API Key missing" });
    }

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `As a smart canteen assistant, recommend 3 food items from this menu based on user preferences.
    User Preferences: ${JSON.stringify(userPrefs)}
    Menu: ${JSON.stringify(currentMenu)}
    Return only a JSON array of item IDs.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const recommendedIds = JSON.parse(text.substring(jsonStart, jsonEnd));
    
    res.json({ recommendedIds });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// Mock Data Endpoints
app.get("/api/menu", (req, res) => {
  res.json([
    { id: "1", name: "Spicy Paneer Wrap", price: 120, category: "Fast Food", rating: 4.8, image: "https://images.unsplash.com/photo-1626700051175-656fc74e0b63?w=800&auto=format&fit=crop", calories: 350, description: "Grilled paneer with spicy mayo" },
    { id: "2", name: "Avocado Toast", price: 180, category: "Healthy", rating: 4.9, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop", calories: 280, description: "Fresh avocado on sourdough" },
    { id: "3", name: "Double Cheese Burger", price: 220, category: "Fast Food", rating: 4.7, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop", calories: 550, description: "Beef patty with extra cheddar" },
    { id: "4", name: "Greek Salad", price: 150, category: "Healthy", rating: 4.6, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop", calories: 120, description: "Cucumber, olives, and feta" },
  ]);
});

export default app;
