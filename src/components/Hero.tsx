'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, ArrowRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: '/images/entry1.jpg',
    title: 'Freshly Baked Happiness Every Day',
    subtitle: 'From traditional Iyengar bakery favorites to premium custom cakes, Vijay Iyyangar Bakery creates unforgettable flavors for every celebration.',
  },
  {
    image: '/images/entry2.jpg',
    title: 'Crafting Sweet Celebrations',
    subtitle: 'Bespoke, custom designed cakes baked fresh with premium ingredients, love, and traditional care to light up your special moments.',
  },
  {
    image: '/images/entry3.jpg',
    title: 'Bespoke Designer Creations',
    subtitle: 'From multi-tier custom wedding cakes to delightful theme designs, our pastry coordinators handcraft every detail to match your dreams.',
  },
  {
    image: '/images/entry4.jpg',
    title: 'Unforgettable Moments, Sweet Flavors',
    subtitle: 'Every birthday, anniversary, and milestone deserves a cake that looks breathtaking and tastes divine. Handcrafted in Bantwal with love.',
  }
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center bg-dark-cocoa dark:bg-black">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${HERO_SLIDES[currentSlide].image})` }}
          />
        </AnimatePresence>
        
        {/* Soft Luxury Gradient to protect text without blacking out the left half */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Floating Bakery Elements (SVG Wheat & Cookies) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Floating Wheat Left */}
        <div className="absolute left-[8%] top-[25%] opacity-20 dark:opacity-35 animate-float hidden lg:block">
          <svg width="60" height="120" viewBox="0 0 60 120" fill="none" className="text-gold">
            <path d="M 30,110 C 20,80 30,40 45,20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M 30,80 C 22,75 22,65 30,60" stroke="currentColor" strokeWidth="2" />
            <path d="M 32,60 C 40,55 40,45 32,40" stroke="currentColor" strokeWidth="2" />
            <path d="M 30,40 C 22,35 22,25 30,20" stroke="currentColor" strokeWidth="2" />
            <circle cx="26" cy="70" r="3" fill="currentColor" />
            <circle cx="36" cy="50" r="3" fill="currentColor" />
            <circle cx="26" cy="30" r="3" fill="currentColor" />
          </svg>
        </div>

        {/* Floating Cookie Right */}
        <div className="absolute right-[12%] bottom-[20%] opacity-20 dark:opacity-35 animate-float-slow hidden lg:block">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gold">
            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="40" cy="40" r="28" fill="currentColor" fillOpacity="0.1" />
            <circle cx="30" cy="30" r="4" fill="currentColor" />
            <circle cx="50" cy="32" r="3" fill="currentColor" />
            <circle cx="34" cy="52" r="3" fill="currentColor" />
            <circle cx="46" cy="48" r="4" fill="currentColor" />
            <circle cx="42" cy="26" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-16">
        <div className="max-w-2xl text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-md mb-6">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase text-gold">
                  Authentic Iyengar Heritage
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-cream leading-tight drop-shadow-lg">
                {HERO_SLIDES[currentSlide].title}
              </h2>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-cream/85 font-sans leading-relaxed drop-shadow-md">
                {HERO_SLIDES[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#menu"
              className="px-8 py-4 bg-gold hover:bg-cream hover:text-warm-brown text-white font-sans font-semibold rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Order Online
              <ArrowRight size={18} />
            </a>
            <a
              href="#custom-cakes"
              className="px-8 py-4 border-2 border-cream/30 hover:border-gold hover:bg-gold/20 text-cream font-sans font-semibold rounded-full flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Calendar size={18} />
              Book Custom Cake
            </a>
            <a
              href="tel:+919980624419"
              className="px-8 py-4 bg-transparent hover:text-gold text-cream/90 font-sans font-semibold rounded-full flex items-center gap-2 transition-colors"
            >
              <Phone size={18} />
              Call Now
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative Wave Transition bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-10 bg-gradient-to-t from-cream to-transparent dark:from-dark-cocoa pointer-events-none" />
    </section>
  );
};

export default Hero;
