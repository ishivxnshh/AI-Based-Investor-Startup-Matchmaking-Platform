import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import assets from '../assets/assets'

const LandingPage = () => {
  const navigate = useNavigate()
  const bgRef = useRef(null)
  const impactRef = useRef(null)
  const heroRef = useRef(null)
  const [hasCounted, setHasCounted] = useState(false)
  const [counts, setCounts] = useState({ startups: 0, investors: 0, success: 0, sectors: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  const testimonials = useMemo(() => ([
    {
      text: 'VentureBridge connected us with the perfect investor who understood our vision. Within 3 months, we closed our seed round!',
      author: 'Ananya Sharma',
      role: 'CEO, TechFlow AI',
      avatar: '🚀'
    },
    {
      text: 'As an angel investor, finding quality startups was always challenging. This platform changed everything with its AI-powered matching.',
      author: 'Ravi Patel',
      role: 'Angel Investor',
      avatar: '💼'
    },
    {
      text: 'The quality of matches is incredible. We saved months of cold outreach and found investors who truly align with our mission.',
      author: 'Priya Desai',
      role: 'Founder, GreenTech Solutions',
      avatar: '🤝'
    }
  ]), [])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const faqs = useMemo(() => ([
    {
      q: 'How does AI matchmaking work?',
      a: 'Our advanced AI analyzes multiple data points including industry sector, funding stage, investment preferences, company values, and historical success patterns to recommend highly compatible matches with 90%+ success rate.'
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. We use bank-level AES-256 encryption, comply with GDPR and SOC 2 standards, and never share your data with third parties without explicit consent. Your privacy is our top priority.'
    },
    {
      q: 'Can I switch roles later?',
      a: 'Yes! You can update your profile and preferences anytime. If you want to switch from startup to investor role (or vice versa), simply contact our support team.'
    },
    {
      q: 'What is the success rate?',
      a: 'Our platform boasts a 90% match success rate, with 75% of matched pairs engaging in meaningful discussions and 40% proceeding to investment negotiations.'
    }
  ]), [])
  const [openFaq, setOpenFaq] = useState(null)

  // Enhanced parallax background motion
  useEffect(() => {
    const handleMove = (e) => {
      const el = bgRef.current
      if (!el) return
      const { innerWidth, innerHeight } = window
      const moveX = ((e.clientX / innerWidth) - 0.5) * 15
      const moveY = ((e.clientY / innerHeight) - 0.5) * 15
      setMousePosition({ x: moveX, y: moveY })
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
          const duration = 2000
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - p, 4)
            setCounts({
              startups: Math.floor(targets.startups * easeOutQuart),
              investors: Math.floor(targets.investors * easeOutQuart),
              success: Math.floor(targets.success * easeOutQuart),
              sectors: Math.floor(targets.sectors * easeOutQuart)
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
    }, 6000)
    return () => clearInterval(id)
  }, [testimonials.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Background Layer with Parallax */}
      <div ref={bgRef} className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center opacity-10 will-change-transform transition-transform duration-100"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full">
        {/* Enhanced Navbar */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto backdrop-blur-md bg-white/5 rounded-b-2xl border-b border-white/10"
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <img src={assets.logo} alt="VentureBridge Logo" className="h-14" />
          </motion.div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="hover:text-purple-300 cursor-pointer transition-colors"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-2.5 rounded-full text-white cursor-pointer font-semibold shadow-lg"
            >
              Get Started
            </motion.button>
          </nav>
        </motion.header>

        {/* Hero Section with Enhanced Design */}
        <motion.section
          ref={heroRef}
          className="flex flex-col items-center justify-center text-center py-28 px-4 max-w-5xl mx-auto"
          style={{ opacity, scale }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm font-medium mb-8">
                🚀 AI-Powered Matchmaking Platform
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-600 bg-clip-text text-transparent">
                Connecting Innovative
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Startups with Visionary Investors
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Discover funding opportunities or invest in groundbreaking ideas
              through our intelligent AI-powered matchmaking platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="group relative bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Join Now - It's Free
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="border-2 border-purple-400/50 px-8 py-4 rounded-full text-white font-semibold text-lg hover:bg-purple-500/20 transition-all"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>500+ Startups</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>200+ Investors</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>90% Match Success</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Impact Numbers with Enhanced Design */}
        <section ref={impactRef} className="px-4 py-24 flex justify-center bg-black/30 backdrop-blur-sm">
          <div className="max-w-6xl w-full text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-16"
            >
              Our <span className="text-gradient">Impact</span>
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { count: counts.startups, label: 'Startups Registered', suffix: '+', color: 'from-purple-400 to-violet-500' },
                { count: counts.investors, label: 'Active Investors', suffix: '+', color: 'from-violet-400 to-purple-500' },
                { count: counts.success, label: 'Success Match Rate', suffix: '%', color: 'from-purple-400 to-pink-500' },
                { count: counts.sectors, label: 'Sectors Covered', suffix: '+', color: 'from-pink-400 to-purple-500' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="card-gradient p-8 rounded-2xl border border-purple-400/30 hover:border-purple-400/60 transition-all">
                    <div className={`text-6xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-3`}>
                      {item.count}{item.suffix}
                    </div>
                    <div className="text-gray-300 font-medium">{item.label}</div>
                    <div className="w-full bg-purple-500/20 rounded-full h-2 mt-4 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.count / (item.suffix === '%' ? 100 : 500)) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced */}
        <section className="px-4 py-24 flex justify-center">
          <div className="max-w-6xl w-full text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              How <span className="text-gradient">VentureBridge</span> Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto"
            >
              Get started in three simple steps and unlock a world of opportunities
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                {
                  step: 1,
                  title: 'Create Your Profile',
                  description: 'Startups and Investors sign up and build detailed profiles, including sectors, funding needs, or investment interests.',
                  icon: '👤',
                  color: 'from-purple-500 to-violet-600'
                },
                {
                  step: 2,
                  title: 'AI Matchmaking',
                  description: 'Our AI recommends best-fit matches based on preferences, industry verticals, and funding stages.',
                  icon: '🤖',
                  color: 'from-violet-500 to-purple-600'
                },
                {
                  step: 3,
                  title: 'Connect & Grow',
                  description: 'Connect through secure channels, schedule meetings, and begin collaborative innovation.',
                  icon: '🚀',
                  color: 'from-purple-500 to-pink-600'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  <div className="card-gradient p-8 rounded-2xl border border-purple-400/30 hover:border-purple-400/60 transition-all h-full">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                        {item.icon}
                      </div>
                      <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials - Enhanced Carousel */}
        <section className="px-4 py-24 flex justify-center bg-black/30 backdrop-blur-sm">
          <div className="max-w-4xl w-full text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-16"
            >
              What People <span className="text-gradient">Say</span>
            </motion.h2>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="card-gradient p-10 rounded-3xl border border-purple-400/30"
                >
                  <div className="text-6xl mb-6">{testimonials[currentTestimonial].avatar}</div>
                  <p className="text-xl text-gray-200 mb-8 leading-relaxed italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="border-t border-purple-400/30 pt-6">
                    <p className="font-bold text-lg text-purple-300">{testimonials[currentTestimonial].author}</p>
                    <p className="text-gray-400 text-sm mt-1">{testimonials[currentTestimonial].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3 justify-center mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`h-3 rounded-full transition-all ${i === currentTestimonial ? 'w-12 bg-purple-400' : 'w-3 bg-purple-400/30'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Enhanced */}
        <section className="px-4 py-24 flex justify-center">
          <div className="max-w-3xl w-full">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6 text-center"
            >
              Frequently Asked <span className="text-gradient">Questions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-center mb-12"
            >
              Everything you need to know about VentureBridge
            </motion.p>

            <div className="space-y-4">
              {faqs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-gradient rounded-2xl border border-purple-400/30 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left px-6 py-5 hover:bg-purple-500/10 transition-all"
                  >
                    <span className="font-semibold text-lg pr-4">{item.q}</span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      className="text-purple-400 text-2xl flex-shrink-0"
                    >
                      ↓
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-gray-300 leading-relaxed border-t border-purple-400/20 pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section - Enhanced */}
        <section className="px-4 py-24 flex justify-center bg-black/30 backdrop-blur-sm">
          <div className="max-w-3xl w-full text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              Get in <span className="text-gradient">Touch</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 mb-12"
            >
              Have questions? We'd love to hear from you.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
              <textarea
                placeholder="Your Message"
                rows={6}
                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm resize-none"
              />
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
              >
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-4 py-24 flex justify-center">
          <div className="max-w-5xl w-full text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-16"
            >
              Meet Our <span className="text-gradient">Team</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto"
            >
              <div className="card-gradient p-8 rounded-3xl border border-purple-400/30">
                <img
                  src="https://i.ibb.co/67mNJMnR/Whats-App-Image-2025-07-17-at-15-57-25-659fea5d.jpg"
                  alt="Shivansh Mittal"
                  className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-purple-500 shadow-xl object-cover"
                />
                <h3 className="text-2xl font-bold mb-2">Shivansh Mittal</h3>
                <p className="text-purple-300 font-medium mb-4">Founder & Developer</p>
                <p className="text-gray-300 mb-6">Tech visionary turning bold ideas into scalable products</p>
                <div className="flex gap-4 justify-center">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="mailto:shivanshmittalsde@gmail.com"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="https://www.linkedin.com/in/ishivxnshh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative z-10 text-center py-8 bg-black/50 backdrop-blur-md border-t border-purple-400/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} VentureBridge. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage