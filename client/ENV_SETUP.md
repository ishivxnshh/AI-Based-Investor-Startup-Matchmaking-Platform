# Environment Variables Setup

## Overview
This project uses environment variables to securely store API keys and configuration settings. The sensitive information is stored in a `.env` file that is not committed to version control.

## Setup Instructions

### 1. Create Environment File
Copy the example environment file and add your actual API keys:

```bash
cp .env.example .env
```

### 2. Configure API Keys
Edit the `.env` file and replace the placeholder values with your actual API keys:

```env
# Groq API Configuration
GROQ_API_KEY=your_actual_groq_api_key_here
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
```

### 3. Get Your Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## Security Notes

- **Never commit the `.env` file to version control**
- The `.env` file is already added to `.gitignore`
- Use `.env.example` to document required environment variables
- Keep your API keys secure and don't share them

## Dependencies

The following package is required for environment variable support:
- `dotenv`: Loads environment variables from `.env` file

## Usage in Code

Environment variables are loaded automatically in the AI service:

```javascript
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
```

## Troubleshooting

If you encounter issues with environment variables:

1. **Check file location**: Ensure `.env` file is in the `client/` directory
2. **Check file format**: Ensure no spaces around the `=` sign
3. **Check file encoding**: Use UTF-8 encoding
4. **Restart server**: Restart the development server after changing `.env`

## File Structure

```
client/
├── .env                 # Your actual environment variables (not in git)
├── .env.example         # Template for environment variables (in git)
├── server/
│   └── services/
│       └── aiService.js # Uses environment variables
└── ENV_SETUP.md         # This documentation
```
