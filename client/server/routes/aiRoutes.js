import express from 'express';
import { analyzePitch, chatWithAI } from '../controllers/aiController.js';

const router = express.Router();

// Test AI connection
router.get('/test', async (req, res) => {
  try {
    const aiService = (await import('../services/aiService.js')).default;
    const result = await aiService.callGeminiAPI('Hello, this is a test. Please respond with "AI is working!"');
    res.json({ success: true, response: result.text });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze pitch deck
router.post('/analyze/:startupId', analyzePitch);

// Chat with AI
router.post('/chat', chatWithAI);

export default router;
