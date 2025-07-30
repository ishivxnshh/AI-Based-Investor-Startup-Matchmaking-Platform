import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the client directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

// Validate that required environment variables are loaded
if (!GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in environment variables');
}

class AIService {
  async callGroqAPI(prompt) {
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          }
        }
      );

      return {
        success: true,
        text: response.data.choices[0].message.content,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Failed to get AI response',
        message: error.message
      };
    }
  }

  async extractPDFText(filePath) {
    return new Promise((resolve) => {
      try {
        console.log(`Attempting to extract text from PDF: ${filePath}`);

        // Resolve the absolute path to ensure we're accessing the correct file
        const absolutePath = path.resolve(filePath);
        console.log(`Resolved absolute path: ${absolutePath}`);

        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
          console.error(`PDF file not found: ${absolutePath}`);
          resolve(null);
          return;
        }

        // Dynamic import to avoid module loading issues
        import('pdfreader').then((module) => {
          const PdfReader = module.PdfReader;

          let extractedText = '';
          let currentPage = 0;

          new PdfReader().parseFileItems(absolutePath, (err, item) => {
            if (err) {
              console.error('Error parsing PDF:', err);
              resolve(null);
              return;
            }

            if (!item) {
              // End of file
              console.log(`PDF text extracted successfully, length: ${extractedText.length} characters`);
              if (extractedText.trim().length > 0) {
                resolve(extractedText.trim());
              } else {
                console.log('PDF appears to contain no extractable text');
                resolve(null);
              }
              return;
            }

            if (item.page && item.page !== currentPage) {
              currentPage = item.page;
              extractedText += `\n--- PAGE ${currentPage} ---\n`;
            }

            if (item.text) {
              extractedText += item.text + ' ';
            }
          });
        }).catch((error) => {
          console.error('Error importing pdfreader:', error);
          resolve(null);
        });

      } catch (error) {
        console.error('Error extracting PDF text:', error);
        resolve(null);
      }
    });
  }

  async extractPowerPointText(filePath) {
    try {
      console.log(`Attempting to extract text from PowerPoint: ${filePath}`);

      // Resolve the absolute path to ensure we're accessing the correct file
      const absolutePath = path.resolve(filePath);
      console.log(`Resolved absolute path: ${absolutePath}`);

      // Check if file exists
      if (!fs.existsSync(absolutePath)) {
        console.error(`PowerPoint file not found: ${absolutePath}`);
        return null;
      }

      // Dynamic import to avoid module loading issues
      const pptx2json = (await import('pptx2json')).default;

      // Extract text using pptx2json
      const result = await pptx2json.toJson(absolutePath);
      console.log(`PowerPoint data extracted successfully`);

      // Extract text from slides
      let extractedText = '';
      if (result && result.slides) {
        result.slides.forEach((slide, index) => {
          extractedText += `\n--- SLIDE ${index + 1} ---\n`;
          if (slide.content) {
            slide.content.forEach(item => {
              if (item.text) {
                extractedText += item.text + '\n';
              }
            });
          }
        });
      }

      if (extractedText.trim().length > 0) {
        console.log(`PowerPoint text extracted successfully, length: ${extractedText.length} characters`);
        return extractedText.trim();
      } else {
        console.log('PowerPoint appears to contain no extractable text');
        return null;
      }
    } catch (error) {
      console.error('Error extracting PowerPoint text:', error);
      return null;
    }
  }

  async analyzePitchDeck(pitchDeckInfo) {
    let extractedText = '';

    console.log(`Analyzing pitch deck for startup: ${pitchDeckInfo.startupName}`);
    console.log(`File path: ${pitchDeckInfo.path}`);
    console.log(`Original name: ${pitchDeckInfo.originalName}`);

    if (pitchDeckInfo.path) {
      // Normalize path separators and resolve absolute path to ensure we're accessing the correct user's file
      const normalizedPath = pitchDeckInfo.path.replace(/\\/g, '/');
      const absolutePath = path.resolve(normalizedPath);
      console.log(`Resolved absolute path: ${absolutePath}`);

      if (fs.existsSync(absolutePath)) {
        const fileName = pitchDeckInfo.originalName.toLowerCase();

        if (fileName.endsWith('.pdf')) {
          console.log('Extracting text from PDF file...');
          extractedText = await this.extractPDFText(absolutePath);
        } else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
          console.log('Extracting text from PowerPoint file...');
          extractedText = await this.extractPowerPointText(absolutePath);
        } else {
          console.log('Unsupported file format for text extraction');
        }
      } else {
        console.error(`Pitch deck file not found at: ${absolutePath}`);
      }
    } else {
      console.error('No file path provided for pitch deck analysis');
    }

    const analysisPrompt = this.createPitchDeckAnalysisPrompt(pitchDeckInfo, extractedText);
    return await this.callGroqAPI(analysisPrompt);
  }

  createPitchDeckAnalysisPrompt(pitchDeckInfo, extractedText) {
    if (extractedText && extractedText.trim().length > 0) {
      return `
As an expert startup pitch deck analyst and seasoned investor, please analyze this actual pitch deck content.

**Pitch Deck File Details:**
- File Name: ${pitchDeckInfo.originalName || 'Not specified'}
- Startup Name: ${pitchDeckInfo.startupName || 'Not specified'}

**ACTUAL PITCH DECK CONTENT EXTRACTED FROM FILE:**
${extractedText}

Based on the actual content extracted from this pitch deck file, please provide a detailed analysis. Focus ONLY on what is actually present in the content above. Do not make assumptions about missing information.

## 🎯 PITCH DECK CONTENT ANALYSIS

### 📋 Content Structure Analysis
- What slides/sections are present in this deck?
- Is the flow logical and compelling?
- Are there any missing essential elements?

### ✅ Strengths of This Pitch Deck
- What does this pitch deck do well?
- Which sections are most compelling?
- What evidence of traction/validation is presented?

### ⚠️ Areas for Improvement
- What specific content needs strengthening?
- Which slides need more detail or clarity?
- What claims need better support/evidence?

### 💰 Financial Analysis
- What financial information is provided?
- Are the projections realistic and well-supported?
- Is the funding ask clear and justified?

### 🎯 Market & Competition Analysis
- How well does the deck address market opportunity?
- Is the competitive landscape adequately covered?
- Is the target market clearly defined?

### 👥 Team Presentation
- How is the team presented?
- Are credentials and experience highlighted effectively?
- Is there evidence of execution capability?

### 🚨 Red Flags & Concerns
- What potential concerns might investors have?
- Are there any inconsistencies or weak arguments?
- What questions will investors likely ask?

### 📈 Investment Recommendation
- Based on this pitch deck content, what's your investment recommendation?
- What's the overall quality score (1-10)?
- What are the key factors influencing this assessment?

### 🔧 Specific Improvement Recommendations
- What specific changes should be made to each section?
- How can the storytelling be improved?
- What additional information should be included?

Be specific and reference actual content from the pitch deck in your analysis.
`;
    } else {
      return `
As an expert startup pitch deck analyst, I attempted to analyze the pitch deck file but could not extract readable text content.

**File Information:**
- File Name: ${pitchDeckInfo.originalName || 'Not specified'}
- File Type: ${pitchDeckInfo.originalName ? pitchDeckInfo.originalName.split('.').pop().toUpperCase() : 'Unknown'}
- Startup Name: ${pitchDeckInfo.startupName || 'Not specified'}

**Analysis Limitation:**
I cannot provide specific content analysis because:
${pitchDeckInfo.originalName?.toLowerCase().endsWith('.pdf') ?
  '- The PDF file may be image-based or encrypted, preventing text extraction' :
  '- PowerPoint files require different extraction methods not currently supported'}

## 🎯 RECOMMENDATIONS FOR ANALYSIS

To get a detailed analysis of your actual pitch deck content:

### 📋 For PDF Files:
- Ensure your PDF is text-searchable (not just images)
- If created from PowerPoint, export as "PDF with text"
- Avoid password protection or encryption

### 📋 For PowerPoint Files:
- Consider converting to PDF format first
- Ensure text is selectable in the final format
- Use clear, readable fonts

### 💡 Alternative Approach:
If technical extraction continues to fail, you can:
1. Copy and paste key slide content into our chat
2. Share the main points from each slide
3. Describe your pitch structure and I'll provide targeted feedback

Would you like to try sharing some key content from your pitch deck directly so I can provide specific analysis?
`;
    }
  }

  async chatWithAI(message, analysisContext = null) {
    let prompt = message;

    if (analysisContext) {
      prompt = `
You are an AI startup advisor who has just analyzed a startup pitch deck. Here's the context of your previous analysis:

${analysisContext}

The founder is now asking: "${message}"

Please provide a helpful, specific response related to their pitch deck or general startup/investment advice. Keep your response conversational and actionable.
`;
    } else {
      prompt = `
You are an AI startup advisor. A founder is asking: "${message}"

Please provide helpful startup and investment advice. Keep your response conversational and actionable.
`;
    }

    return await this.callGroqAPI(prompt);
  }
}

export default new AIService();