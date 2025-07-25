import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Import all page components
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Signup'
import StartupForm from './pages/StartupForm'
import InvestorForm from './pages/InvestorForm'
import Matches from './pages/Matches'
import ChatPage from './pages/ChatPage'
import StartupDashboard from './pages/StartupDashboard'
import InvestorDashboard from './pages/InvestorDashboard'
import StartupsSearch from './pages/StartupsSearch'
import InvestorProfileSettings from './pages/InvestorProfileSettings'
import StartupsDetails from './pages/StartupsDetails'

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/startup-form" element={<StartupForm />} />
      <Route path="/investor-form" element={<InvestorForm />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute role="startup" />}>
        <Route path="/startup-dashboard" element={<StartupDashboard />} />
      </Route>
      
      <Route element={<ProtectedRoute role="investor" />}>
        <Route path="/investor-dashboard" element={<InvestorDashboard />} />
        <Route path="/investor-profile-settings" element={<InvestorProfileSettings />} />
      </Route>
      
      {/* Common protected routes */}
      <Route path="/matches" element={<Matches />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/startupssearch" element={<StartupsSearch />} />
      <Route path="/startupsdetails/:id" element={<StartupsDetails />} />
    </Routes>
  )
}

export default Routing