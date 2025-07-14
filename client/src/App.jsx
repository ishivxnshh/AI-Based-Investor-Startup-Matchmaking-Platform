import { Routes, Route } from 'react-router-dom'

// Import pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import StartupForm from './pages/StartupForm'
import InvestorForm from './pages/InvestorForm'
import Matches from './pages/Matches'
import ChatPage from './pages/ChatPage'
import StartupDashboard from './pages/StartupDashboard'
import InvestorDashboard from './pages/InvestorDashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/startup-form" element={<StartupForm />} />
      <Route path="/investor-form" element={<InvestorForm />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/startup-dashboard" element={<StartupDashboard />} />
      <Route path="/investor-dashboard" element={<InvestorDashboard />} />
    </Routes>
  )
}

export default App