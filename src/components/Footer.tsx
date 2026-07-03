'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const categories = [
    'Birthday Cakes',
    'Custom Cakes',
    'Pastries',
    'Veg Puffs',
    'Khara Bun',
    'Honey Cake'
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Custom Cakes', href: '#custom-cakes' },
    { name: 'Gallery Showcase', href: '#gallery' },
    { name: 'Promotions', href: '#offers' },
    { name: 'Contact Us', href: '#contact' }
  ];

  return (
    <footer className="bg-dark-cocoa text-cream/90 pt-16 pb-8 border-t border-gold/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Upper Footer: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-cream/10">
          {/* Logo & Brand Details */}
          <div className="lg:col-span-5 space-y-6">
            <Logo size="lg" />
            <p className="text-xs text-cream/60 font-sans leading-relaxed max-w-sm">
              Vijay Iyyangar Bakery serves freshly baked happiness every single day with love, high-quality ingredients, and classic recipe heritage. Crafted daily in B.C. Road, Bantwal.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="font-serif text-base font-bold text-gold">Subscribe to Sweet Newsletter</h4>
            <p className="text-xs text-cream/60 font-sans">
              Get notified of weekend discounts, festival special sweets bookings, and new cake flavor arrivals.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-gold text-xs font-semibold py-2">
                <ShieldCheck size={16} /> Subscribed successfully! Check your inbox soon for sweet updates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-cream/15 rounded-full font-sans text-xs focus:outline-none focus:border-gold text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold hover:bg-cream hover:text-dark-cocoa text-white font-sans text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 transition-all"
                >
                  Join
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Footer: Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-12 text-xs">
          {/* Quick Links */}
          <div className="space-y-4">
            <h5 className="font-serif font-bold text-gold text-sm">Site Directory</h5>
            <ul className="grid grid-cols-2 gap-2 font-sans">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-gold transition-colors text-cream/70">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h5 className="font-serif font-bold text-gold text-sm">Menu Explorer</h5>
            <ul className="grid grid-cols-2 gap-2 font-sans">
              {categories.map((cat) => (
                <li key={cat}>
                  <a href="#menu" className="hover:text-gold transition-colors text-cream/70">
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact coordinates quick check */}
          <div className="space-y-4 font-sans text-cream/75 leading-relaxed">
            <h5 className="font-serif font-bold text-gold text-sm">BC Road Store</h5>
            <p>
              Vijay Iyyangar Bakery <br />
              B bypass Junction, B.C. Road <br />
              Bantwal, Karnataka - 574219
            </p>
            <p className="text-[11px] text-cream/50">
              Tel: +91 99806 24419 <br />
              Email: hello@vijayiyengarbakery.com
            </p>
          </div>
        </div>

        {/* Lower Footer: Legal & Copyright */}
        <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-cream/50 font-sans gap-4">
          <p>© {new Date().getFullYear()} Vijay Iyyangar Bakery. All Rights Reserved. Baked with Tradition & Love.</p>
          
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gold transition-colors">Terms & Conditions</Link>
            <Link href="/admin/login" className="hover:text-gold transition-colors font-bold text-gold/80">Admin Access</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
