# AI-Based Investor-Startup Matchmaking Platform

A sophisticated platform that leverages artificial intelligence to connect startups with the right investors, streamlining the fundraising process and improving match quality.

## 🚀 Features

- **Smart Matching Algorithm**: AI-powered system to match startups with compatible investors
- **Comprehensive Profiles**: Detailed startup and investor profiles with key metrics
- **Real-time Analytics**: Dashboard with insights and performance metrics
- **Secure Communication**: Built-in messaging system for seamless interaction
- **Document Management**: Upload and share pitch decks, financials, and other documents
- **Score Boosting Tools**: Utilities to enhance profile scores and visibility

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Modern CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (assumed)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ishivxnshh/AI-Based-Investor-Startup-Matchmaking-Platform.git
   cd AI-Based-Investor-Startup-Matchmaking-Platform
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000` (or configured port)

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:5173`

### Production Build

```bash
# Build the client
cd client
npm run build

# Start the server in production mode
cd ../server
npm start
```

## 📁 Project Structure

```
AI-Based-Investor-Startup-Matchmaking-Platform/
├── client/                 # Frontend application
│   ├── src/               # Source files
│   ├── public/            # Static assets
│   └── package.json       # Client dependencies
├── server/                # Backend application
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── controllers/       # Route controllers
│   └── package.json       # Server dependencies
├── Score Booster/         # Development utilities (gitignored)
├── .gitignore            # Git ignore rules
├── LICENSE               # Project license
├── SETUP.md              # Detailed setup instructions
└── README.md             # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Shivansh** - [@ishivxnshh](https://github.com/ishivxnshh)

## 🐛 Troubleshooting

### Common Issues

**Issue**: `'vite' is not recognized`  
**Solution**: Run `npm install` in the client directory

**Issue**: `'nodemon' is not recognized`  
**Solution**: Run `npm install` in the server directory

For more detailed setup instructions, see [SETUP.md](SETUP.md)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

⭐ If you find this project useful, please consider giving it a star!
