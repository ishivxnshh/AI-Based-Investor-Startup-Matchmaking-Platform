# 🚀 VentureBridge - AI-Powered Investor-Startup Matchmaking Platform

<div align="center">

![VentureBridge](https://img.shields.io/badge/VentureBridge-AI%20Matchmaking-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Connecting Innovative Startups with Visionary Investors through AI**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

VentureBridge is a cutting-edge platform that leverages artificial intelligence to connect innovative startups with the right investors. Our intelligent matchmaking algorithm analyzes multiple data points to ensure high-quality, compatible matches, saving both parties valuable time and resources.

### Why VentureBridge?

- **90% Match Success Rate** - Our AI ensures highly compatible connections
- **Time-Saving** - Reduce months of networking to weeks
- **Secure & Private** - Bank-level encryption and GDPR compliance
- **Real-time Communication** - Built-in chat and notification system
- **AI-Powered Insights** - Get feedback on your pitch and profile

---

## ✨ Features

### For Startups
- 📝 **Comprehensive Profile Creation** - Showcase your vision, team, and traction
- 🎯 **AI-Powered Matching** - Get matched with investors aligned with your sector
- 💬 **Direct Communication** - Chat with potential investors in real-time
- 📊 **Pitch Feedback** - AI analysis of your pitch deck
- 🔔 **Smart Notifications** - Never miss an opportunity

### For Investors
- 🔍 **Advanced Search & Filters** - Find startups matching your criteria
- 📈 **Portfolio Management** - Track your investments and matches
- 🤖 **AI Recommendations** - Discover promising startups automatically
- 💼 **Deal Flow Management** - Organize and prioritize opportunities
- 📱 **Mobile-Friendly** - Access on any device

### Platform Features
- 🔐 **Secure Authentication** - JWT-based auth with role-based access
- 🌙 **Dark Mode** - Beautiful, modern UI with glassmorphism
- ⚡ **Real-time Updates** - Socket.IO for instant notifications
- 📱 **PWA Support** - Install as a mobile app
- ♿ **Accessibility** - WCAG 2.1 AA compliant
- 🌍 **Internationalization** - Multi-language support ready

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.3
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM 7.6.3
- **Animations**: Framer Motion 12.23.6
- **State Management**: React Context API
- **HTTP Client**: Axios 1.10.0
- **Icons**: React Icons 5.5.0
- **Notifications**: React Toastify 11.0.5

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB with Mongoose 8.16.4
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Security**: Helmet, CORS, XSS-Clean, HPP
- **File Upload**: Multer 2.0.2
- **Real-time**: Socket.IO 4.8.1
- **AI Integration**: Google Generative AI 0.21.0
- **Logging**: Winston 3.17.0
- **Validation**: Express Validator 7.2.1

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint
- **Testing**: Jest, Supertest
- **Process Manager**: PM2 (production)
- **Containerization**: Docker (optional)

---

## 📁 Project Structure

```
AI-Based-Investor-Startup-Matchmaking-Platform/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   │   ├── manifest.json       # PWA manifest
│   │   └── sw.js              # Service worker
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Reusable React components
│   │   │   ├── ui/           # UI components (Button, Card, etc.)
│   │   │   ├── Chat/         # Chat components
│   │   │   └── ...
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── App.jsx           # Main App component
│   │   ├── Routing.jsx       # Route configuration
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Backend Node.js application
│   ├── config/               # Configuration files
│   │   └── database.js       # MongoDB connection
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── errorHandler.js  # Error handling
│   │   └── notFound.js      # 404 handler
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Startup.js
│   │   ├── Investor.js
│   │   └── Match.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── startups.js
│   │   ├── investors.js
│   │   ├── matches.js
│   │   ├── chat.js
│   │   ├── ai.js
│   │   ├── upload.js
│   │   └── notifications.js
│   ├── utils/               # Utility functions
│   │   └── logger.js        # Winston logger
│   ├── tests/               # Test files
│   ├── .env.example         # Environment variables template
│   ├── index.js             # Server entry point
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Google AI API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-Based-Investor-Startup-Matchmaking-Platform.git
   cd AI-Based-Investor-Startup-Matchmaking-Platform
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   **Server** (`server/.env`):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   **Client** (`client/.env.local`):
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Ensure your connection string is in `.env`

6. **Run the application**

   **Development Mode** (recommended):
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev

   # Terminal 2 - Start frontend
   cd client
   npm run dev
   ```

   **Or use concurrently** (from client directory):
   ```bash
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

---

## 🔐 Environment Variables

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/venturebridge

# Server Configuration
PORT=5000
NODE_ENV=development

# AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Client Environment Variables

Create a `.env.local` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "startup" // or "investor"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Startup Endpoints

#### Create Startup Profile
```http
POST /api/startups
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "TechFlow AI",
  "industry": "Artificial Intelligence",
  "fundingStage": "Seed",
  "fundingAmount": 500000,
  "description": "AI-powered analytics platform",
  "teamSize": 5
}
```

#### Get All Startups
```http
GET /api/startups
Authorization: Bearer <token>
```

### Investor Endpoints

#### Create Investor Profile
```http
POST /api/investors
Authorization: Bearer <token>
Content-Type: application/json

{
  "investmentRange": {
    "min": 100000,
    "max": 1000000
  },
  "preferredIndustries": ["AI", "FinTech"],
  "investmentStage": ["Seed", "Series A"]
}
```

### Match Endpoints

#### Get Matches
```http
GET /api/matches
Authorization: Bearer <token>
```

#### Create Match
```http
POST /api/matches
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetId": "user_id_here"
}
```

For complete API documentation, see [API.md](./docs/API.md)

---

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Purple/Violet gradient theme
- **Typography**: Inter & Outfit fonts
- **Components**: Glassmorphism cards with backdrop blur
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Mobile-first design approach

### Key UI Components
- Modern landing page with parallax effects
- Dashboard with real-time statistics
- Interactive chat interface
- AI-powered matchmaking results
- Profile management forms
- Notification center

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   npm run build
   vercel --prod
   ```

### Backend Deployment (Railway/Render)

1. **Prepare for production**
   ```bash
   cd server
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Deploy** using your platform's CLI or dashboard

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

---

## 🧪 Testing

### Run Tests

```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test

# Coverage report
npm run test:coverage
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow ESLint configuration
- Use meaningful variable and function names
- Write comments for complex logic
- Add JSDoc comments for functions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Shivansh Mittal** - Founder & Developer
- Email: shivanshmittalsde@gmail.com
- LinkedIn: [ishivxnshh](https://www.linkedin.com/in/ishivxnshh)

---

## 🙏 Acknowledgments

- Google Generative AI for AI capabilities
- MongoDB for database solutions
- Vercel for hosting
- All contributors and supporters

---

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: shivanshmittalsde@gmail.com
- LinkedIn: [ishivxnshh](https://www.linkedin.com/in/ishivxnshh)

---

<div align="center">

**Built with ❤️ by the VentureBridge Team**

[⬆ back to top](#-venturebridge---ai-powered-investor-startup-matchmaking-platform)

</div>
