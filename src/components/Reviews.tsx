'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: "rev-1",
    name: "B l Eshwarappa",
    photo: "/images/eshwarappa.jpg",
    rating: 5,
    review: "I have been coming to Vijay Iyyangar Bakery since my youth. Their signature Rava Cake is legendary in Bantwal—always rich, soft, and delicious. Outstanding traditional quality!",
    role: "Regular Patron"
  },
  {
    id: "rev-2",
    name: "Sahana",
    photo: "/images/sahana.jpg",
    rating: 5,
    review: "The custom birthday cakes are incredibly beautiful! I ordered a multi-tier chocolate cake and the details were perfect. Tastes very premium and light.",
    role: "Local Customer"
  },
  {
    id: "rev-3",
    name: "Roppa",
    photo: "/images/roppa.jpg",
    rating: 5,
    review: "Our family celebrations are incomplete without Vijay Iyyangar's sweet Dil Pasand and hot Veg Puffs. Exceptional service, high hygiene standards, and very clean!",
    role: "Mother & Customer"
  },
  {
    id: "rev-4",
    name: "Sunil Shetty",
    photo: "/images/sunilshetty.jpg",
    rating: 5,
    review: "Awesome filter coffee and Egg Buns! It's our go-to evening snack joint in BC Road Bypass. Very affordable and fast ordering.",
    role: "Bantwal Resident"
  }
];

export const Reviews: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  return (
    <section className="py-24 bg-cream/30 dark:bg-dark-cocoa/20 relative overflow-hidden">
      {/* Decorative quote mark background */}
      <Quote className="absolute right-12 top-12 text-gold/5 dark:text-gold/2 h-64 w-64 pointer-events-none" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-gold font-sans text-xs tracking-[0.25em] font-bold uppercase block mb-3">
            Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warm-brown dark:text-cream leading-tight">
            Loved By Local Families
          </h2>
        </div>

        {/* Testimonial Slider */}
        <div className="relative p-8 sm:p-12 bg-white dark:bg-warm-brown/10 border border-warm-brown/5 rounded-3xl shadow-xl flex flex-col items-center text-center">
          
          {/* Quote Icon */}
          <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-6">
            <Quote className="text-gold fill-gold/10" size={20} />
          </div>

          {/* Slider Content */}
          <div className="min-h-[160px] w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <p className="text-base sm:text-lg text-warm-brown/80 dark:text-cream/80 font-sans italic leading-relaxed max-w-2xl mx-auto">
                  "{REVIEWS[activeIndex].review}"
                </p>

                {/* Rating stars */}
                <div className="flex justify-center gap-1">
                  {[...Array(REVIEWS[activeIndex].rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-gold fill-gold" />
                  ))}
                </div>

                {/* Profile card */}
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={REVIEWS[activeIndex].photo}
                    alt={REVIEWS[activeIndex].name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-gold"
                  />
                  <div className="text-left">
                    <h4 className="font-serif text-sm font-bold text-warm-brown dark:text-cream">
                      {REVIEWS[activeIndex].name}
                    </h4>
                    <p className="text-[10px] font-sans tracking-widest text-gold font-bold uppercase mt-0.5">
                      {REVIEWS[activeIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-2 border border-warm-brown/20 dark:border-gold/20 rounded-full hover:bg-gold hover:border-gold hover:text-white text-warm-brown dark:text-cream transition-all duration-300"
              aria-label="Previous Review"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 border border-warm-brown/20 dark:border-gold/20 rounded-full hover:bg-gold hover:border-gold hover:text-white text-warm-brown dark:text-cream transition-all duration-300"
              aria-label="Next Review"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
export default Reviews;
