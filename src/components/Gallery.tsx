'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ZoomIn } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'Birthday Cakes',
    title: 'Fairy Theme Custard Cake',
    image: '/images/entry1.jpg'
  },
  {
    id: 2,
    category: 'Kids Theme Cakes',
    title: 'Kids Smash Cake Celebrations',
    image: '/images/entry2.jpg'
  },
  {
    id: 3,
    category: 'Wedding Cakes',
    title: 'Bespoke Anniversary Design Cake',
    image: '/images/entry3.jpg'
  },
  {
    id: 4,
    category: 'Birthday Cakes',
    title: 'First Birthday Celebration Cake',
    image: '/images/entry4.jpg'
  },
  {
    id: 5,
    category: 'Bakery Interior',
    title: 'Fresh Baked Warming Cabinet Display',
    image: '/images/a1.jpg'
  },
  {
    id: 6,
    category: 'Bakery Interior',
    title: 'Spiced Chips & Packed Mixture Shelves',
    image: '/images/a2.jpg'
  },
  {
    id: 7,
    category: 'Bakery Interior',
    title: 'Puffs, Samosas & Loaves Platter',
    image: '/images/a3.jpg'
  },
  {
    id: 8,
    category: 'Bakery Interior',
    title: 'Cozy Counter & Fresh Sweet Bun Display',
    image: '/images/a4.jpg'
  }
];

const TABS = [
  'All',
  'Birthday Cakes',
  'Wedding Cakes',
  'Kids Theme Cakes',
  'Fresh Bread',
  'Pastries',
  'Cookies',
  'Bakery Interior',
  'Happy Customers'
];

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    return activeTab === 'All' || item.category === activeTab;
  });

  return (
    <section id="gallery" className="py-24 bg-white dark:bg-dark-cocoa/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-gold font-sans text-xs tracking-[0.25em] font-bold uppercase block mb-3">
            Visual Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warm-brown dark:text-cream leading-tight">
            Our Bakery Gallery
          </h2>
          <p className="mt-3 text-sm text-warm-brown/60 dark:text-cream/60 font-sans">
            A visual journey of our luxurious custom designs, fresh morning bakes, and happy local customers.
          </p>
        </div>

        {/* Categories Tab scrolling */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-none">
          <div className="flex gap-3 justify-start lg:justify-center min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-cream/40 text-warm-brown hover:bg-light-beige dark:bg-warm-brown/10 dark:text-cream/80 dark:hover:bg-warm-brown/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-like Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(item.image)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl aspect-square shadow-sm hover:shadow-xl transition-all duration-300 bg-light-beige dark:bg-dark-cocoa"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-cocoa/90 via-dark-cocoa/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-sans tracking-widest text-gold font-bold uppercase mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-gold text-white flex items-center justify-center shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close Preview"
              >
                <X size={24} />
              </button>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-dark-cocoa"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="High quality bakery preview"
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
export default Gallery;
