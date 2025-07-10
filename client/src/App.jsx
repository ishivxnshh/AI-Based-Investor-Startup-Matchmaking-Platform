import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

const App = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Blurred background layer */}
      <div className="absolute inset-0 bg-[url('./src/assets/bgImage.svg')] bg-cover w-full h-full blur-md z-0"></div>
      {/* Main app content */}
      <div className="relative z-10 w-full h-full">
        <Routes>
          <Route path='/' element={<HomePage />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App