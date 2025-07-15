import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'

const InvestorProfileSettings = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    bio: '',
    interests: '',
    location: '',
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || '',
        bio: user.bio || '',
        interests: user.interests || '',
        location: user.location || '',
      })
    }
  }, [])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSave = (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const updatedUser = { ...user, ...profile }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    alert('Profile updated!')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={assets.logo} alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold">Chatiao</span>
          </div>
        </header>
        <section className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2">Profile Settings</h1>
          <p className="mt-2 text-gray-300 text-lg">Update your investor profile details below.</p>
        </section>
        <section className="max-w-3xl mx-auto bg-white/10 rounded-xl p-8 border border-gray-700 shadow-lg mb-16">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Full Name</label>
                <input type="text" name="fullName" value={profile.fullName} onChange={handleProfileChange} className="w-full p-2 rounded bg-white/20 border border-gray-500 text-white focus:outline-none" required />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Email</label>
                <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="w-full p-2 rounded bg-white/20 border border-gray-500 text-white focus:outline-none" required />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Company</label>
                <input type="text" name="company" value={profile.company} onChange={handleProfileChange} className="w-full p-2 rounded bg-white/20 border border-gray-500 text-white focus:outline-none" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Phone</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full p-2 rounded bg-white/20 border border-gray-500 text-white focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Location</label>
              <input type="text" name="location" value={profile.location} onChange={handleProfileChange} className="w-full p-2 rounded bg-white/20 border border-gray-500 text-white focus:outline-none" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Interests</label>
              <input type="text" name="interests" value={profile.interests} onChange={handleProfileChange} className="w-full p-2 rounded bg-white/20 border border-gray-500 text-white focus:outline-none" placeholder="e.g. AI, Fintech, Healthcare" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Bio</label>
              <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className="w-full p-2 rounded bg-white/20 border border-gray-500 text-white focus:outline-none" rows={3} />
            </div>
            <button type="submit" className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-2 rounded-md font-medium mt-2">Save Profile</button>
          </form>
        </section>
      </div>
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  )
}

export default InvestorProfileSettings 