import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'

const LandingPage = () => {
  const navigate = useNavigate()
  const bgRef = useRef(null)
  const impactRef = useRef(null)
  const [hasCounted, setHasCounted] = useState(false)
  const [counts, setCounts] = useState({ startups: 0, investors: 0, success: 0, sectors: 0 })

  const testimonials = useMemo(() => ([
    { text: '🚀 "VentureBridge helped me find investors in just weeks. It’s like magic!"', author: '— Ananya, Startup Founder' },
    { text: '💼 "Perfect for discovering promising startups aligned with my interests."', author: '— Ravi, Angel Investor' },
    { text: '🤝 "The matching quality is impressive. Saved us months of outreach."', author: '— Priya, Founder' }
  ]), [])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const faqs = useMemo(() => ([
    { q: 'How does AI matchmaking work?', a: 'We analyze profiles, preferences, and outcomes to recommend high-probability matches.' },
    { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption and never share data without consent.' },
    { q: 'Can I switch roles later?', a: 'You can update your profile anytime; switching roles is supported.' }
  ]), [])
  const [openFaq, setOpenFaq] = useState(null)

  // Subtle parallax background motion
  useEffect(() => {
    const handleMove = (e) => {
      const el = bgRef.current
      if (!el) return
      const { innerWidth, innerHeight } = window
      const moveX = ((e.clientX / innerWidth) - 0.5) * 10
      const moveY = ((e.clientY / innerHeight) - 0.5) * 10
      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // Animated counters when in view
  useEffect(() => {
    if (!impactRef.current || hasCounted) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasCounted) {
          const targets = { startups: 500, investors: 200, success: 90, sectors: 50 }
          const duration = 1200
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1)
            setCounts({
              startups: Math.floor(targets.startups * p),
              investors: Math.floor(targets.investors * p),
              success: Math.floor(targets.success * p),
              sectors: Math.floor(targets.sectors * p)
            })
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          setHasCounted(true)
          observer.disconnect()
        }
      })
    }, { threshold: 0.3 })
    observer.observe(impactRef.current)
    return () => observer.disconnect()
  }, [hasCounted])

  // Auto-rotate testimonials
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTestimonial((i) => (i + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(id)
  }, [testimonials.length])

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col">
      {/* Background Layer */}
      <div ref={bgRef} className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75 will-change-transform transition-transform duration-100"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src={assets.logo} alt="VentureBridge Logo" className="h-16" />
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => navigate('/login')}
              className="hover:text-purple-300 cursor-pointer"
            >
              Login
            </button>
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
          <div className="animate-fade-in-up">
            <h1 className="text-responsive-xl font-bold leading-tight text-gradient mb-6">
              Connecting Innovative Startups <br /> with Visionary Investors
            </h1>
            <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover funding opportunities or invest in groundbreaking ideas
              through our intelligent AI-powered matchmaking platform.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slide-in-right">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary hover-lift"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Join Now
              </span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-outline hover-lift"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </span>
            </button>
            <a
              href="#contact"
              className="btn-secondary hover-lift"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </span>
            </a>
          </div>
        </section>

        {/* Impact Numbers */}
        <section ref={impactRef} className="px-4 py-20 flex justify-center bg-black/60">
          <div className="max-w-6xl w-full text-center">
            <h2 className="text-3xl font-bold mb-10 animate-fade-in-up">Our Impact</h2>
            <div className="grid sm:grid-cols-4 gap-8">
              <div className="card card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl font-bold text-purple-400 mb-2">{counts.startups}+</div>
                <div className="text-sm text-gray-300">Startups Registered</div>
                <div className="w-full bg-purple-500/20 rounded-full h-1 mt-3">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="card card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold text-purple-400 mb-2">{counts.investors}+</div>
                <div className="text-sm text-gray-300">Active Investors</div>
                <div className="w-full bg-purple-500/20 rounded-full h-1 mt-3">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="card card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-4xl font-bold text-purple-400 mb-2">{counts.success}%</div>
                <div className="text-sm text-gray-300">Success Match Rate</div>
                <div className="w-full bg-purple-500/20 rounded-full h-1 mt-3">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="card card-hover animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-4xl font-bold text-purple-400 mb-2">{counts.sectors}+</div>
                <div className="text-sm text-gray-300">Sectors Covered</div>
                <div className="w-full bg-purple-500/20 rounded-full h-1 mt-3">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI-based Investor & Startup Previous Meet Section */}
        <section className="flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">AI-Powered Investor & Startup Connections</h2>
          <p className="text-gray-300 text-center mb-6 max-w-2xl">
            Our platform has already facilitated impactful meetings between visionary investors and innovative startups. Here’s a glimpse of how AI brings people together for the future of Entrepreneurship.
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

        {/* How It Works */}
        <section
          id="how-it-works"
          className="px-4 py-20 flex justify-center bg-black/50"
        >
          <div className="max-w-5xl w-full text-center">
            <h2 className="text-3xl font-bold mb-6 animate-fade-in-up">How VentureBridge Works</h2>
            <div className="grid sm:grid-cols-3 gap-8 text-left">
              <div className="card card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">
                    Create Your Profile
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Startups and Investors sign up and build detailed profiles,
                  including sectors, funding needs, or investment interests.
                </p>
                <div className="mt-4 flex items-center text-purple-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quick & Easy Setup
                </div>
              </div>
              <div className="card card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">
                    AI Matchmaking
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Our AI recommends best-fit matches based on preferences,
                  industry verticals, and funding stages.
                </p>
                <div className="mt-4 flex items-center text-purple-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Smart Algorithm
                </div>
              </div>
              <div className="card card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">
                    Connect & Grow
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Connect through secure channels, schedule meetings, and begin
                  collaborative innovation.
                </p>
                <div className="mt-4 flex items-center text-purple-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Build Relationships
                </div>
              </div>
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
              VentureBridge personalizes connections and accelerates the startup journey.
            </p>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="px-4 py-20 flex justify-center">
          <div className="max-w-6xl w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Latest from Our Blog
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white/10 p-4 rounded-lg border border-gray-500">
                <h3 className="text-lg font-semibold mb-2">
                  Why AI is Changing the Funding Game
                </h3>
                <p className="text-gray-300 text-sm">
                  Explore how artificial intelligence is transforming
                  early-stage startup investment with precision matchmaking.
                </p>
                <a
                  href="#"
                  className="text-purple-300 text-sm hover:underline mt-2 block"
                >
                  Read more →
                </a>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-gray-500">
                <h3 className="text-lg font-semibold mb-2">
                  Top 10 Sectors for 2025
                </h3>
                <p className="text-gray-300 text-sm">
                  From DeepTech to BioTech, find out which industries are
                  getting the most investor attention.
                </p>
                <a
                  href="#"
                  className="text-purple-300 text-sm hover:underline mt-2 block"
                >
                  Read more →
                </a>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-gray-500">
                <h3 className="text-lg font-semibold mb-2">
                  Investor Tips for First-Time Founders
                </h3>
                <p className="text-gray-300 text-sm">
                  Avoid common pitfalls and make your pitch irresistible to
                  angel investors.
                </p>
                <a
                  href="#"
                  className="text-purple-300 text-sm hover:underline mt-2 block"
                >
                  Read more →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section (Carousel) */}
        <section id="testimonials" className="px-4 py-20 flex justify-center">
          <div className="max-w-3xl w-full text-center">
            <h2 className="text-3xl font-bold mb-10">What People Say</h2>
            <div className="relative bg-white/10 p-6 rounded-lg border border-gray-500 overflow-hidden">
              <div className="transition-all duration-500">
                <p className="text-md min-h-[3rem]">{testimonials[currentTestimonial].text}</p>
                <p className="mt-4 font-semibold text-right">{testimonials[currentTestimonial].author}</p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <button aria-label="Previous" onClick={() => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition">←</button>
                <div className="flex gap-2 justify-center">
                  {testimonials.map((_, i) => (
                    <span key={i} className={`h-2 w-2 rounded-full ${i === currentTestimonial ? 'bg-purple-400' : 'bg-white/30'}`}></span>
                  ))}
                </div>
                <button aria-label="Next" onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition">→</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section (Accordion) */}
        <section id="faq" className="px-4 py-20 flex justify-center bg-black/50">
          <div className="max-w-3xl w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">FAQs</h2>
            <div className="divide-y divide-white/10 border border-white/10 rounded-lg overflow-hidden">
              {faqs.map((item, i) => (
                <div key={i} className="bg-white/5">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left px-4 py-4 hover:bg-white/10 transition"
                  >
                    <span className="font-medium">{item.q}</span>
                    <span className="text-purple-300">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-gray-300">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Logos */}
        <section className="px-4 py-16 flex justify-center bg-black/40">
          <div className="max-w-5xl w-full text-center">
            <h2 className="text-2xl font-bold mb-6">Trusted By</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                className="h-10"
                alt="Microsoft"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                className="h-10"
                alt="Google"
              />
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.p8sW7kW_Bvuq5bJCiWOPxQHaEK?pid=Api&P=0&h=180"
                className="h-10"
                alt="Sequoia"
              />
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.0Cqtm6Fi2SsTyufbOCOJRwAAAA?pid=Api&P=0&h=180"
                className="h-10"
                alt="Y Combinator"
              />
            </div>
          </div>
        </section>

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
            <div className="grid grid-cols-1 gap-8 place-items-center">
              {/* each card */}
              <div className="w-full max-w-md mx-auto">
                {/* Founder card */}
                <div className="bg-white/10 p-6 rounded-lg border border-gray-500">
                  <img src="https://i.ibb.co/67mNJMnR/Whats-App-Image-2025-07-17-at-15-57-25-659fea5d.jpg" alt="Shivansh Mittal" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                  <h3 className="text-xl font-semibold">Shivansh Mittal</h3>
                  <p className="text-purple-300">Founder & Developer</p>
                  <p className="text-gray-300 text-sm mt-2">Tech visionary turning bold ideas into scalable products</p>
                  <a href="mailto:shivanshmittalsde@gmail.com" className="text-purple-400 hover:underline mt-2 block">✉ shivanshmittalsde@gmail.com</a>
                  <a href="https://www.linkedin.com/in/ishivxnshh " className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} VentureBridge. All rights reserved.
      </footer>
    </div>
  )
}

export default LandingPage