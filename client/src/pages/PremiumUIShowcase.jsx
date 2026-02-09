import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PremiumUIShowcase = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress" 
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      {/* Animated Mesh Background */}
      <div className="fixed inset-0 gradient-mesh-animated opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="text-gradient-animated">Premium UI</span>
            <br />
            <span className="text-neon">Enhancements</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the next level of design with advanced animations, glassmorphism, and interactive elements
          </p>
        </motion.div>

        {/* Card Showcase */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Glass Premium Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-premium p-8 rounded-3xl stagger-item"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              ✨
            </div>
            <h3 className="text-2xl font-bold mb-3">Glass Premium</h3>
            <p className="text-gray-300">
              Advanced glassmorphism with enhanced blur and saturation effects
            </p>
          </motion.div>

          {/* Morphing Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-morph p-8 stagger-item"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🎨
            </div>
            <h3 className="text-2xl font-bold mb-3">Morphing Card</h3>
            <p className="text-gray-300">
              Smooth morphing transitions with dynamic hover effects
            </p>
          </motion.div>

          {/* Holographic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="holographic p-8 rounded-3xl stagger-item"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🌈
            </div>
            <h3 className="text-2xl font-bold mb-3">Holographic</h3>
            <p className="text-gray-300">
              Stunning holographic effect with animated shine overlay
            </p>
          </motion.div>

          {/* 3D Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-3d glass-premium p-8 rounded-3xl stagger-item"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🎭
            </div>
            <h3 className="text-2xl font-bold mb-3">3D Tilt Card</h3>
            <p className="text-gray-300">
              Interactive 3D perspective on hover for depth
            </p>
          </motion.div>

          {/* Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="spotlight glass-premium p-8 rounded-3xl stagger-item"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              💡
            </div>
            <h3 className="text-2xl font-bold mb-3">Spotlight Effect</h3>
            <p className="text-gray-300">
              Dynamic spotlight that follows your cursor
            </p>
          </motion.div>

          {/* Neumorphic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="neumorphic p-8 stagger-item"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🔮
            </div>
            <h3 className="text-2xl font-bold mb-3">Neumorphism</h3>
            <p className="text-gray-300">
              Soft UI design with subtle shadows and highlights
            </p>
          </motion.div>
        </div>

        {/* Button Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-10 text-center">
            <span className="text-gradient">Premium Buttons</span>
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <button className="btn-premium">Premium Button</button>
            <button className="btn-liquid">Liquid Button</button>
            <button className="ripple btn-primary">Ripple Effect</button>
            <button className="magnetic btn-secondary">Magnetic Hover</button>
            <button className="btn-glow bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-4 rounded-xl font-semibold">
              Glow Button
            </button>
          </div>
        </motion.div>

        {/* Gradient Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-10 text-center">
            <span className="text-gradient">Animated Gradients</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="gradient-aurora h-64 rounded-3xl flex items-center justify-center">
              <h3 className="text-3xl font-bold">Aurora Gradient</h3>
            </div>
            <div className="gradient-cosmic h-64 rounded-3xl flex items-center justify-center">
              <h3 className="text-3xl font-bold">Cosmic Gradient</h3>
            </div>
          </div>
        </motion.div>

        {/* Gradient Border Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="gradient-border p-8">
            <div className="bg-gray-900 rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-4">Animated Gradient Border</h3>
              <p className="text-gray-300">
                This card features an animated gradient border that rotates through different hues
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading States */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-10 text-center">
            <span className="text-gradient">Loading States</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="skeleton-premium h-32 rounded-2xl" />
            <div className="skeleton-premium h-32 rounded-2xl" />
            <div className="skeleton-premium h-32 rounded-2xl" />
          </div>
        </motion.div>

        {/* Particle Effect Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass-premium p-16 rounded-3xl mb-20 overflow-hidden"
        >
          {/* Floating Particles */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${Math.random() * 4 + 4}s`,
              }}
            />
          ))}
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Particle Animation</h2>
            <p className="text-gray-300">
              Floating particles create an immersive background effect
            </p>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center card-morph p-16 rounded-3xl"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-gradient-animated">Ready to Experience</span>
            <br />
            <span className="text-neon">Premium Design?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            These are just a few examples of the enhanced UI elements available in your platform
          </p>
          <button className="btn-liquid text-lg px-12 py-5">
            Get Started Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumUIShowcase;
