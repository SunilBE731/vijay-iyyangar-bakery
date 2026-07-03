'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/db';
import { Search, Heart, ShoppingCart, SlidersHorizontal, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'All',
  'Signature Cakes',
  'Celebration Cakes',
  'Puffs & Savories',
  'Buns & Sandwiches',
  'Desserts & Ice Cream',
  'Fresh Breads & Cookies',
  'Beverages'
];

export const Menu: React.FC = () => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter & Search Logic
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default
    });

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <section id="menu" className="py-24 bg-white dark:bg-dark-cocoa/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-gold font-sans text-xs tracking-[0.25em] font-bold uppercase block mb-3">
            Menu Catalog
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warm-brown dark:text-cream leading-tight">
            Explore Our Baked Delights
          </h2>
          <p className="mt-3 text-sm text-warm-brown/60 dark:text-cream/60 font-sans">
            Savor authentic South Indian bakery classics and premium modern confectionery freshly prepared daily.
          </p>
        </div>

        {/* Search & Utility Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-brown/40 dark:text-cream/40">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search honey cake, buns, pastries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-cream/30 dark:bg-warm-brown/10 border border-warm-brown/10 dark:border-gold/10 rounded-full font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream transition-all"
            />
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-warm-brown/10 rounded-full text-sm text-warm-brown dark:text-cream"
            >
              <SlidersHorizontal size={16} />
              Categories
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-cream/30 dark:bg-warm-brown/10 border border-warm-brown/10 dark:border-gold/10 rounded-full font-sans text-sm text-warm-brown dark:text-cream focus:outline-none focus:border-gold"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Popularity (Rating)</option>
            </select>
          </div>
        </div>

        {/* Categories Tab scrolling (Desktop always visible, Mobile toggleable drawer or horizontal scroll) */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-none">
          <div className="flex gap-3 min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-warm-brown text-white dark:bg-gold dark:text-dark-cocoa shadow-md'
                    : 'bg-cream/40 text-warm-brown/80 hover:bg-light-beige dark:bg-warm-brown/10 dark:text-cream/80 dark:hover:bg-warm-brown/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="font-sans text-sm text-warm-brown/60 dark:text-cream/60">Fetching fresh menu items...</p>
          </div>
        ) : (
          /* Products Grid */
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col bg-cream/10 dark:bg-warm-brown/5 rounded-2xl overflow-hidden border border-warm-brown/5 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-[4/3] bg-light-beige dark:bg-dark-cocoa overflow-hidden flex items-center justify-center font-serif text-3xl font-bold text-gold/30">
                    {product.name.charAt(0)}
                    
                    {/* Floating wishlist trigger */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-dark-cocoa/80 hover:bg-white dark:hover:bg-dark-cocoa rounded-full text-warm-brown dark:text-cream shadow-sm transition-all"
                      aria-label="Add to Wishlist"
                    >
                      <Heart
                        size={16}
                        className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-warm-brown dark:text-cream'}
                      />
                    </button>

                    {/* Popular indicator badge */}
                    {product.isPopular && (
                      <span className="absolute top-3 left-3 bg-gold text-white text-[9px] font-sans font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                        Best Seller
                      </span>
                    )}
                  </div>

                  {/* Info body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-sans tracking-widest text-gold font-bold uppercase">
                        {product.category}
                      </span>
                      <h3 className="font-serif text-base font-bold text-warm-brown dark:text-cream truncate mt-1">
                        {product.name}
                      </h3>
                      
                      {/* Rating stars */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              size={12}
                              className={idx < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-warm-brown/50 dark:text-cream/50 font-sans font-semibold">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-warm-brown/70 dark:text-cream/70 leading-relaxed font-sans line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Add button */}
                    <div className="flex items-center justify-between mt-6">
                      <span className="font-serif text-lg font-bold text-warm-brown dark:text-cream">
                        ₹{product.price}
                      </span>

                      {product.inventory === 0 ? (
                        <span className="text-red-500 text-xs font-sans font-bold uppercase">
                          Sold Out
                        </span>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="px-4 py-2 bg-warm-brown hover:bg-gold text-white font-sans text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Zero results */}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-20 space-y-4">
                <Search size={48} className="mx-auto text-warm-brown/20" />
                <p className="font-sans text-sm text-warm-brown/60 dark:text-cream/60">
                  No items found matching "{searchQuery}" in "{selectedCategory}".
                </p>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </section>
  );
};
export default Menu;
