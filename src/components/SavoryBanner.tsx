'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Flame, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const BANNER_ITEMS = [
  {
    id: 'sam-1',
    name: 'Crisp Punjabi Samosa',
    price: 15,
    rating: 4.9,
    description: 'Freshly fried golden triangular samosas with spiced potato stuffing.',
    image: '/images/savory3.jpg',
    tag: 'Hot Seller'
  },
  {
    id: 'ebun-1',
    name: 'Spiced Egg Masala Bun',
    price: 35,
    rating: 4.7,
    description: 'Soft bun packed with savory egg halves and zesty Southern onion-chilli spice.',
    image: '/images/savory2.jpg',
    tag: 'Fresh Bake'
  },
  {
    id: 'puff-2',
    name: 'Golden Spicy Egg Puff',
    price: 30,
    rating: 4.8,
    description: 'Extra crispy puff pastry enclosing boiled egg half with caramelized onion masala.',
    image: '/images/savory4.jpg',
    tag: 'Daily Baked'
  },
  {
    id: 'puff-1',
    name: 'Traditional Spicy Veg Puff',
    price: 25,
    rating: 4.9,
    description: 'Flaky golden puff pastry envelopes with spiced potato-pea filling.',
    image: '/images/savory1.jpg',
    tag: 'Iyengar Classic'
  }
];

export const SavoryBanner: React.FC = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    // Reconstruct product object matching interface
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      rating: item.rating,
      description: item.description,
      image: item.image,
      category: item.id.startsWith('puff') ? 'Puffs & Savories' : 'Buns & Sandwiches',
      inventory: 50
    };
    addToCart(product);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-warm-brown to-dark-cocoa text-cream relative overflow-hidden shadow-2xl">
      {/* Decorative radial lighting background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,160,23,0.15),transparent_60%)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Banner Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-cream/15 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/45 bg-gold/10 text-gold text-[10px] font-sans font-bold uppercase tracking-wider mb-3">
              <Flame size={12} className="animate-pulse" />
              Straight From the Ovens
            </div>
            <h2 className="text-3xl font-serif font-bold text-cream">
              Hot & Fresh Savory Bakes
            </h2>
            <p className="text-sm text-cream/70 font-sans mt-2">
              Locally famous puff pastries, spiced samosas, and egg buns baked daily in Bantwal.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-sans text-gold font-bold uppercase tracking-widest bg-white/5 border border-gold/20 px-4 py-2 rounded-full">
            <Sparkles size={14} /> Signature Recipe Standard
          </div>
        </div>

        {/* Banner grid showcasing actual savory photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BANNER_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              className="bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden border border-cream/10 hover:border-gold/30 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark-cocoa/40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Tag overlay */}
                <span className="absolute top-3 left-3 bg-gold text-dark-cocoa text-[9px] font-sans font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md">
                  {item.tag}
                </span>
              </div>

              {/* Info Area */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-base font-bold text-cream group-hover:text-gold transition-colors truncate">
                    {item.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[11px] text-cream/60">
                    <Star size={12} className="text-gold fill-gold" />
                    <span className="font-bold text-gold">{item.rating}</span>
                    <span>• Freshly Prepared</span>
                  </div>

                  <p className="text-[11px] text-cream/65 leading-relaxed font-sans line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cream/5">
                  <span className="font-serif text-lg font-bold text-cream">₹{item.price}</span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="h-8 px-4 bg-gold hover:bg-cream hover:text-dark-cocoa text-white font-sans text-xs font-bold rounded-full flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <ShoppingCart size={12} />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SavoryBanner;
