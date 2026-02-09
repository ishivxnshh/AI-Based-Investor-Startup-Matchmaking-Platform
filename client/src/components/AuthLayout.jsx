import React from 'react'
import assets from '../assets/assets'

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Foreground Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col px-4 py-10">
        {/* Left Side – Logo */}
        <img src={assets.logo} alt="Logo" className="w-[min(50vw,450px)]" />

        {/* Right Side – Auth Form */}
        <div className="glass-premium p-6 flex flex-col gap-6 rounded-2xl w-full max-w-md text-[var(--color-text-primary)] transition-colors duration-300">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout