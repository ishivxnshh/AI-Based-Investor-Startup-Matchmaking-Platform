import aiService from '../services/aiService.js';
import StartupForm from '../models/StartupForm.js';

export const analyzePitch = async (req, res) => {
  try {
    const { startupId } = req.params;

    // Get startup data from database
    const startup = await StartupForm.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    // Check if startup has a pitch deck
    if (!startup.pitchDeck) {
      return res.status(400).json({
        message: 'No pitch deck found. Please upload a pitch deck first.'
      });
    }

    // Prepare pitch deck information for analysis
    const pitchDeckInfo = {
      originalName: startup.pitchDeck.originalName,
      size: startup.pitchDeck.size,
      uploadedAt: startup.pitchDeck.uploadedAt,
      startupName: startup.startupName,
      path: startup.pitchDeck.path
    };

    // Analyze the pitch deck using AI
    const analysisResult = await aiService.analyzePitchDeck(pitchDeckInfo);

    if (!analysisResult.success) {
      return res.status(500).json({
        message: 'Failed to analyze pitch deck',
        error: analysisResult.error
      });
    }

    res.json({
      success: true,
      analysis: analysisResult.text,
      timestamp: analysisResult.timestamp,
      startupName: startup.startupName,
      pitchDeckName: startup.pitchDeck.originalName
    });

  } catch (error) {
    console.error('Pitch analysis error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, analysisContext } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get AI response
    const chatResult = await aiService.chatWithAI(message, analysisContext);
    
    if (!chatResult.success) {
      return res.status(500).json({ 
        message: 'Failed to get AI response',
        error: chatResult.error 
      });
    }

    res.json({
      success: true,
      reply: chatResult.text,
      timestamp: chatResult.timestamp
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
