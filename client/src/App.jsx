import { Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
// Add other page imports as needed
// import LandingPage from './pages/LandingPage'

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<LandingPage />} /> */}
      <Route path="/chat" element={<ChatPage />} />
      {/* Add other routes here like /login, /startup, /investor, etc */}
    </Routes>
  )
}

export default App