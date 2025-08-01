import express from 'express';
import axios from 'axios';
import { getInvestorInsights, getMarketTrends, getPortfolioAnalytics, chatWithAI, analyzePitchDeck } from '../controllers/aiController.js';

const router = express.Router();

// Test route to verify AI routes are loaded
router.get('/test', (req, res) => {
  res.json({ message: 'AI routes are working!' });
});

// Test matches endpoint
router.get('/matches-test', (req, res) => {
  res.json({ message: 'Matches endpoint is accessible!' });
});



// AI-powered investor insights
router.post('/investor-insights', getInvestorInsights);

// Market trends analysis
router.post('/market-trends', getMarketTrends);

// Detailed market data endpoints
router.get('/market/sectors', async (req, res) => {
  try {
    const marketDataService = (await import('../services/marketDataService.js')).default;
    const sectors = await marketDataService.getSectorPerformance();
    res.json({ success: true, sectors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/market/indices', async (req, res) => {
  try {
    const marketDataService = (await import('../services/marketDataService.js')).default;
    const indices = await marketDataService.getMarketIndices();
    res.json({ success: true, indices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/market/crypto', async (req, res) => {
  try {
    const marketDataService = (await import('../services/marketDataService.js')).default;
    const crypto = await marketDataService.getCryptoMarketTrends();
    res.json({ success: true, crypto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Portfolio analytics
router.post('/portfolio-analytics', getPortfolioAnalytics);

// AI chat functionality
router.post('/chat', chatWithAI);

// Pitch deck analysis
router.post('/analyze/:startupId', analyzePitchDeck);

// AI matching for investors - SIMPLIFIED VERSION
router.post('/matches/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    console.log('AI matching requested for userId:', userId);
    
    // Return a simple response for now
    res.json({
      success: true,
      matches: [],
      totalProfilesAnalyzed: 0,
      message: 'AI matching endpoint is working!'
    });
  } catch (error) {
    console.error('AI matching error:', error);
    res.status(500).json({
      success: false,
      message: 'AI matching failed. Please try again.',
      error: error.message
    });
  }
});

export default router;
