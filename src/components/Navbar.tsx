'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Menu, X, Sun, Moon, ShieldAlert, ChevronRight, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Logo from './Logo';

export const Navbar: React.FC = () => {
  const { cart, wishlist, removeFromCart, updateQuantity, cartCount, cartTotal, removeFromWishlist, addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const pathname = usePathname();

  // Dark Mode Toggle Logic
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Custom Cakes', href: '#custom-cakes' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Offers', href: '#offers' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-colors duration-300 glassmorphism">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-sans text-sm font-medium text-warm-brown/80 hover:text-gold dark:text-cream/80 dark:hover:text-gold transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Actions Panel */}
            <div className="flex items-center gap-4">
              {/* Dark Mode Button */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-warm-brown/70 hover:text-gold dark:text-cream/70 dark:hover:text-gold transition-colors duration-200"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 rounded-full text-warm-brown/70 hover:text-gold dark:text-cream/70 dark:hover:text-gold transition-colors duration-200"
                aria-label="View Wishlist"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-between justify-center rounded-full bg-gold text-[10px] font-bold text-white shadow-md animate-pulse">
                    <span className="w-full text-center">{wishlist.length}</span>
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full text-warm-brown/70 hover:text-gold dark:text-cream/70 dark:hover:text-gold transition-colors duration-200"
                aria-label="View Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-between justify-center rounded-full bg-warm-brown text-[10px] font-bold text-white shadow-md">
                    <span className="w-full text-center">{cartCount}</span>
                  </span>
                )}
              </button>

              {/* Admin Dashboard Entry */}
              <Link
                href="/admin/login"
                className="p-2 rounded-full text-warm-brown/70 hover:text-gold dark:text-cream/70 dark:hover:text-gold transition-colors duration-200"
                title="Admin Panel"
              >
                <ShieldAlert size={20} />
              </Link>

              {/* Mobile Burger Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 md:hidden rounded-full text-warm-brown/70 hover:text-gold dark:text-cream/70 dark:hover:text-gold transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-warm-brown/10 dark:border-gold/10 bg-cream/95 dark:bg-dark-cocoa/95 backdrop-blur-md"
            >
              <div className="space-y-1 px-4 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-warm-brown hover:bg-light-beige dark:text-cream dark:hover:bg-warm-brown/20 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream dark:bg-dark-cocoa shadow-2xl flex flex-col border-l border-warm-brown/10 dark:border-gold/10"
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between border-b border-warm-brown/10 dark:border-gold/10">
                <h2 className="text-xl font-serif font-bold text-warm-brown dark:text-cream flex items-center gap-2">
                  <ShoppingBag size={22} className="text-gold" />
                  Your Shopping Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-light-beige dark:hover:bg-warm-brown/20 text-warm-brown dark:text-cream transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <ShoppingBag size={48} className="mx-auto text-warm-brown/30 dark:text-cream/30" />
                    <p className="text-warm-brown/60 dark:text-cream/60 font-medium">Your cart is empty.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2 bg-warm-brown text-white hover:bg-gold rounded-full font-sans font-medium transition-all"
                    >
                      Browse Bakery Products
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 bg-white dark:bg-warm-brown/15 rounded-xl border border-warm-brown/5"
                    >
                      <div className="h-16 w-16 bg-light-beige dark:bg-dark-cocoa rounded-lg flex items-center justify-center font-serif text-2xl font-bold text-gold overflow-hidden">
                        {/* Placeholder text fallback */}
                        {item.product.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-warm-brown dark:text-cream truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gold font-semibold mt-1">
                          ₹{item.product.price} each
                        </p>
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-6 w-6 flex items-center justify-center border border-warm-brown/20 dark:border-gold/20 rounded-md text-warm-brown dark:text-cream text-sm font-bold"
                          >
                            -
                          </button>
                          <span className="text-sm font-sans font-semibold text-warm-brown dark:text-cream w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-6 w-6 flex items-center justify-center border border-warm-brown/20 dark:border-gold/20 rounded-md text-warm-brown dark:text-cream text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <span className="text-sm font-semibold text-warm-brown dark:text-cream">
                          ₹{item.product.price * item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Box */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-warm-brown/10 dark:border-gold/10 bg-white/50 dark:bg-dark-cocoa/50 space-y-4">
                  <div className="flex justify-between items-center text-warm-brown dark:text-cream">
                    <span className="font-sans text-sm font-medium">Subtotal Amount</span>
                    <span className="font-serif text-xl font-bold">₹{cartTotal}</span>
                  </div>
                  <p className="text-[11px] text-warm-brown/50 dark:text-cream/50">
                    Shipping & tax calculated at checkout. Freshly prepared to order.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3 bg-warm-brown hover:bg-gold text-white font-sans font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    Proceed to Checkout
                    <ChevronRight size={18} />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream dark:bg-dark-cocoa shadow-2xl flex flex-col border-l border-warm-brown/10 dark:border-gold/10"
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between border-b border-warm-brown/10 dark:border-gold/10">
                <h2 className="text-xl font-serif font-bold text-warm-brown dark:text-cream flex items-center gap-2">
                  <Heart size={22} className="text-red-500 fill-red-500" />
                  Your Wishlist
                </h2>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 rounded-full hover:bg-light-beige dark:hover:bg-warm-brown/20 text-warm-brown dark:text-cream transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Wishlist Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <Heart size={48} className="mx-auto text-warm-brown/30 dark:text-cream/30" />
                    <p className="text-warm-brown/60 dark:text-cream/60 font-medium">Your wishlist is empty.</p>
                  </div>
                ) : (
                  wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3 bg-white dark:bg-warm-brown/15 rounded-xl border border-warm-brown/5 items-center"
                    >
                      <div className="h-16 w-16 bg-light-beige dark:bg-dark-cocoa rounded-lg flex items-center justify-center font-serif text-2xl font-bold text-gold overflow-hidden">
                        {product.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-warm-brown dark:text-cream truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gold font-semibold mt-1">
                          ₹{product.price}
                        </p>
                        <button
                          onClick={() => {
                            addToCart(product);
                            removeFromWishlist(product.id);
                          }}
                          className="mt-2 text-xs bg-gold hover:bg-warm-brown text-white py-1 px-3 rounded-full font-sans font-medium transition-all"
                        >
                          Add to Cart
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                        aria-label="Remove wishlist item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
