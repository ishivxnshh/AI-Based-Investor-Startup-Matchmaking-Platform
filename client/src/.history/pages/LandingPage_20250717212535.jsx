import React from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src={assets.logo} alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold">Chatiao</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button onClick={() => navigate('/login')} className="hover:text-purple-300 cursor-pointer">Login</button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-violet-600 px-4 py-2 rounded-md text-white cursor-pointer"
            >
              Get Started
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-24 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Connecting Innovative Startups <br /> with Visionary Investors
          </h1>
          <p className="mt-6 text-gray-300 text-lg">
            Discover funding opportunities or invest in groundbreaking ideas through our intelligent matchmaking platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-3 rounded-md font-medium"
            >
              Join Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border border-gray-400 px-6 py-3 rounded-md font-medium"
            >
              Login
            </button>
            <a
              href="#contact-team"
              className="border border-purple-500 text-purple-300 px-6 py-3 rounded-md font-medium hover:bg-purple-500 hover:text-white transition"
            >
              Contact
            </a>
          </div>
        </section>

        {/* AI-based Investor & Startup Previous Meet Section */}
        <section className="flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">AI-Powered Investor & Startup Connections</h2>
          <p className="text-gray-300 text-center mb-6 max-w-2xl">
            Our platform has already facilitated impactful meetings between visionary investors and innovative startups. Here’s a glimpse of how AI brings people together for the future of entrepreneurship.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-center w-full">
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt="AI-based Investor and Startup Meeting"
                className="rounded-lg shadow-lg w-full max-w-xs border-4 border-purple-500"
                style={{objectFit: 'cover', height: '220px'}}
              />
              <span className="text-xs text-gray-400 mt-2">Investor and Startup handshake (AI-generated)</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://img.freepik.com/premium-photo/diverse-business-team-collaborating-modern-office_875825-52442.jpg"
                alt="Startup Team Collaboration"
                className="rounded-lg shadow-lg w-full max-w-xs border-4 border-purple-500"
                style={{objectFit: 'cover', height: '220px'}}
              />
              <span className="text-xs text-gray-400 mt-2">Startup team collaborating with investor </span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
                alt="Pitch Presentation"
                className="rounded-lg shadow-lg w-full max-w-xs border-4 border-purple-500"
                style={{objectFit: 'cover', height: '220px'}}
              />
              <span className="text-xs text-gray-400 mt-2">Pitching ideas to investors</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80"
                alt="Investor Discussion"
                className="rounded-lg shadow-lg w-full max-w-xs border-4 border-purple-500"
                style={{objectFit: 'cover', height: '220px'}}
              />
              <span className="text-xs text-gray-400 mt-2">Investors discussing with startup founders </span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 py-20 flex justify-center">
          <div className="max-w-4xl w-full text-center">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              Our platform bridges the gap between visionaries with brilliant startup ideas and investors
              who are looking to fund the next big innovation. With an intuitive AI-based matchmaking system,
              Chatiao personalizes connections and accelerates the startup journey.
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="px-4 py-20 flex justify-center">
          <div className="max-w-6xl w-full text-center">
            <h2 className="text-3xl font-bold mb-10">What People Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500">
                <p className="text-md">🚀 "Chatiao helped me find investors in just weeks. It’s like magic!"</p>
                <p className="mt-4 font-semibold text-right">— Ananya, Startup Founder</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500">
                <p className="text-md">💼 "Perfect for discovering promising startups aligned with my interests."</p>
                <p className="mt-4 font-semibold text-right">— Ravi, Angel Investor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-4 py-20 flex justify-center">
          <div className="max-w-3xl w-full text-center">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded bg-white/10 border border-gray-500 text-white focus:outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded bg-white/10 border border-gray-500 text-white focus:outline-none"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full p-3 rounded bg-white/10 border border-gray-500 text-white focus:outline-none"
              />
              <button type="submit" className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-3 rounded-md">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Contact Team Section */}
        <section id="contact-team" className="px-4 py-20 flex justify-center bg-black/60">
          <div className="max-w-5xl w-full text-center">
            <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="https://i.ibb.co/PzgvcL73/IMG-20250717-WA0017.jpg" alt="Aditya Verma" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Aditya Verma</h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Great Leader with Visionary Entrepreneur, Passionate about AI and Startups and 😎Here working as Backend Developer.</p>
                <a href="mailto:9905adityaverma@gmail.com" className="text-purple-400 hover:underline mt-2 block">9905adityaverma@gmail.com</a>
                <a href="https://www.linkedin.com/in/aditya-verma-2a3915289/" className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Shivansh Mittal" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Shivansh Mittal</h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Tech visionary turning bold ideas into scalable products</p>
                <a href="mailto:shivanshmittalsde@gmail.com" className="text-purple-400 hover:underline mt-2 block">shivanshmittalsde@gmail.com</a>
                <a href="https://www.linkedin.com/in/ishivxnshh " className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Vijay K.S" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Vijay K.S</h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Command, Creater, Conquer.</p>
                <a href="mailto:ksvijay2005@gmail.com" className="text-purple-400 hover:underline mt-2 block">ksvijay2005@gmail.com</a>
                <a href="https://www.linkedin.com/in/vj-ks/" className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="https://randomuser.me/api/portraits/men/77.jpg" alt="Dikshant Raj" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Dikshant Raj</h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Frontend developer with a passion for scalable systems.</p>
                <a href="mailto:rajdikshant07@gmail.com" className="text-purple-400 hover:underline mt-2 block">rajdikshant07@gmail.com</a>
                <a href="http://www.linkedin.com/in/dikshant-raj" className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="Surya Pranav SR " className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Surya Pranav SR </h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Handling Frontend and Building strong connections with Team</p>
                <a href="mailto:suryapranav.official@gmail.com" className="text-purple-400 hover:underline mt-2 block">suryapranav.official@gmail.com</a>
                <a href="http://www.linkedin.com/in/surya-pranav-2k5" className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  )
}

export default LandingPage