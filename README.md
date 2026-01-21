# VentureBridge - AI-Based Investor-Startup Matchmaking Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v20.x-green.svg)
![React](https://img.shields.io/badge/react-19.1.0-blue.svg)

**Connecting Innovative Startups with Visionary Investors through AI-Powered Matchmaking**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

VentureBridge is a comprehensive full-stack platform that revolutionizes the way startups connect with investors. Using advanced AI algorithms and machine learning, the platform intelligently matches startups with compatible investors based on industry, funding stage, location, and investment preferences.

### Key Highlights

- 🤖 **AI-Powered Matchmaking**: Intelligent algorithms analyze profiles and recommend optimal matches
- 💬 **Real-time Communication**: Built-in messaging system with Socket.IO
- 📊 **Dual Dashboards**: Separate, optimized interfaces for startups and investors
- 🔍 **Advanced Search**: Filter and discover opportunities based on multiple criteria
- 🎯 **AI Pitch Analysis**: Automated feedback on pitch decks and presentations
- 🔒 **Enterprise Security**: JWT authentication, rate limiting, and data sanitization
- 📱 **Progressive Web App**: Installable on mobile devices with offline support

---

## 🚀 Features

### For Startups
- Create comprehensive company profiles with funding needs
- Upload and share pitch decks
- Get AI-powered feedback on pitches
- Discover matching investors
- Track funding progress
- Real-time chat with investors

### For Investors
- Create detailed investor profiles with investment preferences
- Browse and search startup opportunities
- AI-recommended startup matches
- Investment portfolio tracking
- Direct communication with startups
- Advanced filtering and search

### Technical Features
- RESTful API architecture
- Real-time WebSocket connections
- JWT-based authentication
- Role-based access control
- File upload handling
- Rate limiting and DDoS protection
- MongoDB database with Mongoose ODM
- Comprehensive error handling
- Request validation
- API documentation

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.0 with Vite 7.0.3
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM 7.6.3
- **State Management**: React Context API
- **HTTP Client**: Axios 1.10.0
- **Animations**: Framer Motion 12.23.6
- **UI Icons**: React Icons 5.5.0
- **Notifications**: React Toastify 11.0.5
- **AI Integration**: Google GenAI 1.11.0

### Backend
- **Runtime**: Node.js with Express 4.21.2
- **Database**: MongoDB 8.16.4 with Mongoose
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Real-time**: Socket.IO 4.8.1
- **Security**: Helmet, Express Rate Limit, XSS-Clean, HPP
- **File Processing**: Multer 2.0.2, PDF Parse
- **AI**: Google Generative AI 0.21.0
- **Logging**: Winston 3.17.0
- **Testing**: Jest

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Code Quality**: ESLint
- **Environment**: dotenv

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- MongoDB (v6.0 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ishivxnshh/AI-Based-Investor-Startup-Matchmaking-Platform.git
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

   Create `.env` file in the `server` directory:
   ```bash
   cp .env.example .env
   ```

   Create `.env.local` file in the `client` directory:
   ```bash
   cp .env.example .env.local
   ```

   Update the environment variables (see [Environment Variables](#environment-variables))

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Run the application**

   **Development Mode:**
   
   Terminal 1 (Server):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Client):
   ```bash
   cd client
   npm run dev
   ```

   **Production Mode:**
   ```bash
   # Build client
   cd client
   npm run build

   # Start server
   cd ../server
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

---

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/venturebridge

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Session
SESSION_SECRET=your_session_secret_here

# AI Service (Google Gemini)
GOOGLE_API_KEY=your_google_api_key_here

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client (.env.local)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google AI
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

---

## 📁 Project Structure

```
AI-Based-Investor-Startup-Matchmaking-Platform/
├── client/                      # React frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   ├── lib/                # Utility functions
│   │   └── assets/             # Images, icons, etc.
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── config/                 # Configuration files
│   │   └── database.js         # MongoDB connection
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # Authentication
│   │   ├── errorHandler.js    # Error handling
│   │   └── notFound.js        # 404 handler
│   ├── models/                 # Mongoose models
│   │   ├── User.js            # User model
│   │   ├── Startup.js         # Startup model
│   │   ├── Investor.js        # Investor model
│   │   └── Match.js           # Match model
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User management
│   │   ├── startups.js        # Startup operations
│   │   ├── investors.js       # Investor operations
│   │   ├── matches.js         # Matchmaking
│   │   ├── chat.js            # Chat functionality
│   │   ├── ai.js              # AI features
│   │   └── upload.js          # File uploads
│   ├── utils/                  # Utility functions
│   │   └── logger.js          # Winston logger
│   ├── tests/                  # Test files
│   ├── index.js               # Server entry point
│   └── package.json
│
├── README.md                    # This file
└── LICENSE                      # MIT License
```

---

## 📚 Documentation

### API Documentation

For detailed API documentation, see [API.md](./docs/API.md)

### Key API Endpoints

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Startups**: `/api/startups/*`
- **Investors**: `/api/investors/*`
- **Matches**: `/api/matches/*`
- **Chat**: `/api/chat/*`
- **AI Features**: `/api/ai/*`
- **File Upload**: `/api/upload/*`

---

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🔒 Security

This application implements multiple security measures:

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Data Validation**: Express Validator for input validation
- **Sanitization**: MongoDB injection prevention, XSS protection
- **Rate Limiting**: Protection against brute force attacks
- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing configuration
- **HPP**: HTTP Parameter Pollution protection
- **Password Hashing**: bcrypt for secure password storage

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **VentureBridge Team** - [GitHub](https://github.com/ishivxnshh)

---

## 🙏 Acknowledgments

- Google Generative AI for AI capabilities
- Socket.IO for real-time features
- MongoDB for database solutions
- React and Express communities

---

## 📧 Contact

For questions, feedback, or support:

- **GitHub Issues**: [Create an issue](https://github.com/ishivxnshh/AI-Based-Investor-Startup-Matchmaking-Platform/issues)
- **Email**: support@venturebridge.com

---

<div align="center">

Made with ❤️ by the VentureBridge Team

⭐ Star this repository if you find it helpful!

</div>
