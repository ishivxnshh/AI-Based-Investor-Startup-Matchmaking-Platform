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

  // AI Matchmaking Methods
  async findMatchesForStartup(startupProfile, allInvestors) {
    const prompt = this.createStartupMatchingPrompt(startupProfile, allInvestors);
    return await this.callGroqAPI(prompt);
  }

  async findMatchesForInvestor(investorProfile, allStartups) {
    const prompt = this.createInvestorMatchingPrompt(investorProfile, allStartups);
    return await this.callGroqAPI(prompt);
  }

  createStartupMatchingPrompt(startup, investors) {
    return `
As an expert investment matchmaker and startup advisor, analyze this startup profile and suggest the most compatible investors from the available pool.

## 🚀 STARTUP PROFILE TO MATCH:
**Company:** ${startup.startupName || 'Not specified'}
**Industry:** ${Array.isArray(startup.industry) ? startup.industry.join(', ') : startup.industry || 'Not specified'}
**Stage:** ${startup.startupStage || 'Not specified'}
**Funding Amount:** ${startup.fundingAmount || 'Not specified'}
**Funding Round:** ${startup.fundingRoundType || 'Not specified'}
**Location:** ${startup.headquarters || 'Not specified'}
**Operating Markets:** ${Array.isArray(startup.operatingMarkets) ? startup.operatingMarkets.join(', ') : startup.operatingMarkets || 'Not specified'}
**Business Model:** ${startup.businessModel || 'Not specified'}
**Problem Statement:** ${startup.problemStatement || 'Not specified'}
**Product Description:** ${startup.productDescription || 'Not specified'}
**Tech Stack:** ${startup.techStack || 'Not specified'}
**Team Size:** ${startup.teamSize || 'Not specified'}
**Team Skills:** ${Array.isArray(startup.teamSkills) ? startup.teamSkills.join(', ') : startup.teamSkills || 'Not specified'}
**Monthly Revenue:** ${startup.monthlyRevenue || 'Not specified'}
**Growth Rate:** ${startup.growthRate || 'Not specified'}
**Use of Funds:** ${Array.isArray(startup.useOfFunds) ? startup.useOfFunds.join(', ') : startup.useOfFunds || 'Not specified'}

## 💼 AVAILABLE INVESTORS TO ANALYZE:
${investors.map((investor, index) => `
**Investor ${index + 1}:**
- Name: ${investor.fullName || 'Not specified'}
- Organization: ${investor.organization || 'Not specified'}
- Type: ${investor.investorType || 'Not specified'}
- Preferred Industries: ${Array.isArray(investor.preferredIndustries) ? investor.preferredIndustries.join(', ') : investor.preferredIndustries || 'Not specified'}
- Preferred Stages: ${Array.isArray(investor.preferredStages) ? investor.preferredStages.join(', ') : investor.preferredStages || 'Not specified'}
- Ticket Size: ${investor.ticketSize || 'Not specified'}
- Preferred Geographies: ${Array.isArray(investor.preferredGeographies) ? investor.preferredGeographies.join(', ') : investor.preferredGeographies || 'Not specified'}
- Investment Model: ${investor.investmentModel || 'Not specified'}
- Risk Appetite: ${investor.riskAppetite || 'Not specified'}
- Investment Horizon: ${investor.investmentHorizon || 'Not specified'}
- Previous Investments: ${investor.numberOfInvestments || 'Not specified'}
- Portfolio Highlights: ${investor.portfolioHighlights || 'Not specified'}
- ESG Interest: ${investor.esgInterest || 'Not specified'}
- Co-Investment Interest: ${investor.coInvestmentInterest || 'Not specified'}
`).join('\n')}

## 📊 ANALYSIS REQUIREMENTS:

Please analyze each investor and provide a ranked list of the TOP 5 MOST COMPATIBLE matches. For each match, provide:

1. **Compatibility Score** (1-100)
2. **Match Reasoning** (detailed explanation)
3. **Key Alignment Points**
4. **Potential Concerns**
5. **Recommendation Level** (Highly Recommended / Recommended / Consider)

## 📋 OUTPUT FORMAT:

**🎯 TOP INVESTOR MATCHES FOR ${startup.startupName || 'THIS STARTUP'}**

**Match 1: [Investor Name] - Score: [X]/100**
- **Organization:** [Organization Name]
- **Investor Type:** [Type]
- **Recommendation:** [Level]
- **Why This Match Works:**
  • [Key alignment point 1]
  • [Key alignment point 2]
  • [Key alignment point 3]
- **Potential Concerns:**
  • [Concern 1 if any]
  • [Concern 2 if any]
- **Next Steps:** [Specific advice for approaching this investor]

[Repeat for top 5 matches]

**📈 OVERALL MATCHING INSIGHTS:**
- Market trends favoring this startup
- Investor landscape analysis
- Strategic recommendations for fundraising approach

Focus on practical, actionable insights that will help the startup approach the right investors with the right strategy.
`;
  }

  createInvestorMatchingPrompt(investor, startups) {
    return `
As an expert investment matchmaker and venture capital advisor, analyze this investor profile and suggest the most compatible startups from the available pool.

## 💼 INVESTOR PROFILE TO MATCH:
**Name:** ${investor.fullName || 'Not specified'}
**Organization:** ${investor.organization || 'Not specified'}
**Type:** ${investor.investorType || 'Not specified'}
**Preferred Industries:** ${Array.isArray(investor.preferredIndustries) ? investor.preferredIndustries.join(', ') : investor.preferredIndustries || 'Not specified'}
**Preferred Stages:** ${Array.isArray(investor.preferredStages) ? investor.preferredStages.join(', ') : investor.preferredStages || 'Not specified'}
**Ticket Size:** ${investor.ticketSize || 'Not specified'}
**Preferred Geographies:** ${Array.isArray(investor.preferredGeographies) ? investor.preferredGeographies.join(', ') : investor.preferredGeographies || 'Not specified'}
**Investment Model:** ${investor.investmentModel || 'Not specified'}
**Risk Appetite:** ${investor.riskAppetite || 'Not specified'}
**Investment Horizon:** ${investor.investmentHorizon || 'Not specified'}
**Previous Investments:** ${investor.numberOfInvestments || 'Not specified'}
**Portfolio Highlights:** ${investor.portfolioHighlights || 'Not specified'}
**ESG Interest:** ${investor.esgInterest || 'Not specified'}
**Co-Investment Interest:** ${investor.coInvestmentInterest || 'Not specified'}

## 🚀 AVAILABLE STARTUPS TO ANALYZE:
${startups.map((startup, index) => `
**Startup ${index + 1}:**
- Company: ${startup.startupName || 'Not specified'}
- Industry: ${Array.isArray(startup.industry) ? startup.industry.join(', ') : startup.industry || 'Not specified'}
- Stage: ${startup.startupStage || 'Not specified'}
- Funding Amount: ${startup.fundingAmount || 'Not specified'}
- Funding Round: ${startup.fundingRoundType || 'Not specified'}
- Location: ${startup.headquarters || 'Not specified'}
- Business Model: ${startup.businessModel || 'Not specified'}
- Problem: ${startup.problemStatement || 'Not specified'}
- Product: ${startup.productDescription || 'Not specified'}
- Monthly Revenue: ${startup.monthlyRevenue || 'Not specified'}
- Growth Rate: ${startup.growthRate || 'Not specified'}
- Team Size: ${startup.teamSize || 'Not specified'}
- Tech Stack: ${startup.techStack || 'Not specified'}
`).join('\n')}

## 📊 ANALYSIS REQUIREMENTS:

Please analyze each startup and provide a ranked list of the TOP 5 MOST COMPATIBLE investment opportunities. For each match, provide:

1. **Investment Score** (1-100)
2. **Investment Thesis** (detailed explanation)
3. **Key Attraction Points**
4. **Risk Assessment**
5. **Investment Recommendation** (Strong Buy / Buy / Consider / Pass)

## 📋 OUTPUT FORMAT:

**🎯 TOP STARTUP MATCHES FOR ${investor.fullName || 'THIS INVESTOR'}**

**Match 1: [Startup Name] - Score: [X]/100**
- **Industry:** [Industry]
- **Stage:** [Stage]
- **Funding Round:** [Round Type]
- **Recommendation:** [Level]
- **Investment Thesis:**
  • [Key attraction point 1]
  • [Key attraction point 2]
  • [Key attraction point 3]
- **Risk Assessment:**
  • [Risk factor 1 if any]
  • [Risk factor 2 if any]
- **Strategic Value:** [How this fits investor's portfolio]
- **Due Diligence Focus:** [Key areas to investigate]

[Repeat for top 5 matches]

**📈 PORTFOLIO STRATEGY INSIGHTS:**
- Market opportunities analysis
- Portfolio diversification benefits
- Strategic investment recommendations

Focus on investment potential, market timing, and strategic fit with the investor's portfolio and preferences.
`;
  }
}

export default new AIService();