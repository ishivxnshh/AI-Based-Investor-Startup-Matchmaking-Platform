# VentureBridge Client - AI-Powered Investor-Startup Matchmaking Platform

A modern, responsive React application that connects innovative startups with visionary investors through AI-powered matchmaking.

## 🚀 Features

### Core Functionality
- **AI-Powered Matchmaking**: Intelligent algorithm matches startups with compatible investors
- **Dual User Types**: Separate dashboards for startups and investors
- **Real-time Chat**: Built-in messaging system for communication
- **Profile Management**: Comprehensive profile creation and management
- **AI Pitch Feedback**: AI analysis of pitch decks and presentations
- **Search & Discovery**: Advanced search and filtering capabilities

### Technical Features
- **Progressive Web App (PWA)**: Installable on mobile devices
- **Responsive Design**: Optimized for all screen sizes
- **Dark Theme**: Modern dark UI with glassmorphism effects
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loaders and smooth transitions
- **Form Validation**: Real-time validation with custom hooks
- **State Management**: Context API for global state
- **Performance Optimized**: Lazy loading and code splitting
- **Accessibility**: WCAG compliant with keyboard navigation

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0, Vite 7.0.3
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM 7.6.3
- **State Management**: React Context API
- **HTTP Client**: Axios 1.10.0
- **Animations**: Framer Motion 12.23.6
- **Icons**: React Icons 5.5.0
- **Notifications**: React Toastify 11.0.5
- **AI Integration**: Google GenAI 1.11.0 (for AI features)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Based-Investor-Startup-Matchmaking-Platform/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables in `.env.local`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
client/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── favicon.svg            # App icon
├── src/
│   ├── components/            # Reusable components
│   │   ├── AuthLayout.jsx     # Authentication layout
│   │   ├── ErrorBoundary.jsx  # Error boundary component
│   │   ├── LoadingSpinner.jsx # Loading spinner
│   │   ├── LazyWrapper.jsx    # Lazy loading wrapper
│   │   ├── MemoWrapper.jsx    # Memoization wrapper
│   │   ├── Navbar.jsx         # Navigation component
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   ├── SkeletonLoader.jsx # Skeleton loading
│   │   └── Toast.jsx          # Toast notifications
│   ├── context/
│   │   └── AppContext.jsx     # Global state management
│   ├── hooks/
│   │   ├── useApi.js          # API calls hook
│   │   ├── useFormValidation.js # Form validation hook
│   │   └── usePerformance.js  # Performance monitoring
│   ├── pages/                 # Page components
│   │   ├── LandingPage.jsx    # Home page
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Registration page
│   │   ├── StartupDashboard.jsx # Startup dashboard
│   │   ├── InvestorDashboard.jsx # Investor dashboard
│   │   └── ...                # Other pages
│   ├── assets/                # Static assets
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   ├── Routing.jsx            # Route configuration
│   └── index.css              # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8b5cf6) to Violet (#a855f7)
- **Secondary**: Indigo (#6366f1)
- **Background**: Dark gradient (purple-900 to black)
- **Text**: White with gray variants
- **Accent**: Green for success, Red for errors, Yellow for warnings

### Typography
- **Font Family**: Inter (primary), Outfit (fallback)
- **Headings**: Bold weights (600-900)
- **Body**: Regular weight (400-500)
- **Responsive**: Fluid typography with clamp()

### Components
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with validation states
- **Navigation**: Sticky header with smooth transitions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run start` - Start with backend server

## 🚀 Performance Optimizations

### Code Splitting
- Lazy loading for all pages and heavy components
- Dynamic imports for better bundle splitting
- Route-based code splitting

### Memoization
- React.memo for expensive components
- useMemo for computed values
- useCallback for event handlers

### Caching
- Service worker for offline functionality
- Browser caching for static assets
- API response caching

### Bundle Optimization
- Tree shaking for unused code
- Minification and compression
- Image optimization

## ♿ Accessibility Features

### WCAG Compliance
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Keyboard Navigation
- Tab order management
- Focus indicators
- Escape key handling
- Arrow key navigation

### Screen Reader Support
- Alt text for images
- Descriptive labels
- Live regions for updates
- Skip links for navigation

## 📱 PWA Features

### Installation
- Add to home screen on mobile
- Desktop installation support
- Offline functionality
- Background sync

### Performance
- Fast loading with service worker
- Cached resources
- Network-first strategy
- Fallback pages

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

## 🔒 Security Features

### Input Validation
- Client-side validation
- XSS prevention
- CSRF protection
- SQL injection prevention

### Authentication
- JWT token management
- Secure storage
- Session management
- Role-based access control

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Performance Metrics

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Bundle Size
- Initial bundle: < 200KB
- Total bundle: < 1MB
- Gzipped: < 300KB

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t venturebridge-client .
docker run -p 3000:3000 venturebridge-client
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- Core functionality implemented
- PWA features added
- Performance optimizations
- Accessibility improvements

---

**Built with ❤️ by the VentureBridge Team**
