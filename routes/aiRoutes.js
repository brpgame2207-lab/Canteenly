const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const router = express.Router();

// AI Recommendation Endpoint
router.post('/recommendations', async (req, res) => {
  try {
    const { userPrefs, currentMenu } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key missing' });
    }

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `As a smart canteen assistant, recommend 3 food items from this menu based on user preferences.
    User Preferences: ${JSON.stringify(userPrefs)}
    Menu: ${JSON.stringify(currentMenu)}
    Return only a JSON array of item IDs.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Basic extraction logic
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    const recommendedIds = JSON.parse(text.substring(jsonStart, jsonEnd));
    
    res.json({ recommendedIds });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;
