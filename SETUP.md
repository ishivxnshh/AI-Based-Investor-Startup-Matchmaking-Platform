# Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation

### 1. Install Client Dependencies
```bash
cd client
npm install
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

## Running the Application

### Development Mode

#### Start the Client
```bash
cd client
npm run dev
```

#### Start the Server
```bash
cd server
npm run dev
```

## Common Issues

### Issue: 'vite' is not recognized
**Solution**: Run `npm install` in the `client` directory to install all dependencies including Vite.

### Issue: 'nodemon' is not recognized
**Solution**: Run `npm install` in the `server` directory to install all dependencies including nodemon.

## Project Structure
- `/client` - Frontend application (Vite + React)
- `/server` - Backend API (Node.js + Express)
- `/Score Booster` - Score boosting utilities and tests (excluded from git)

## Additional Notes
- Make sure to install dependencies in both client and server directories before running the application
- The Score Booster directory is gitignored and contains development utilities
