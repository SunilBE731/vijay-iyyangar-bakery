'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, Sparkles, Send, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const FLAVORS = [
  { name: 'Classic Vanilla Bean', pricePerKg: 600 },
  { name: 'Pineapple Delight', pricePerKg: 650 },
  { name: 'Butterscotch Crunch', pricePerKg: 700 },
  { name: 'Black Forest Classic', pricePerKg: 750 },
  { name: 'Golden Chocolate Truffle', pricePerKg: 850 },
  { name: 'Red Velvet Cream Cheese', pricePerKg: 950 }
];

const THEMES = [
  { name: 'Simple Whipped Cream Design', extraCharge: 0 },
  { name: 'Bespoke Fondant Figurine Theme', extraCharge: 350 },
  { name: 'Floral Garden Buttercream Theme', extraCharge: 200 },
  { name: 'Metallic Drip Gold Theme', extraCharge: 250 }
];

export const CustomCakeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    whatsapp: '',
    cakeFlavor: FLAVORS[0].name,
    weight: '1',
    theme: THEMES[0].name,
    occasion: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryAddress: '',
    referenceImage: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Real-time price calculation
  const selectedFlavor = FLAVORS.find(f => f.name === formData.cakeFlavor) || FLAVORS[0];
  const selectedTheme = THEMES.find(t => t.name === formData.theme) || THEMES[0];
  const estimatedPrice = (selectedFlavor.pricePerKg * Number(formData.weight)) + selectedTheme.extraCharge;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        totalAmount: estimatedPrice,
        paymentMethod: 'COD',
        isCustomCake: true
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setOrderId(data.order.id);
        setSuccess(true);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });

        // Trigger WhatsApp redirection
        const whatsAppMsg = `Hi Vijay Iyyangar Bakery! I would like to book a custom cake (Order ID: ${data.order.id}).
*Details:*
- Name: ${formData.customerName}
- Contact: ${formData.phone}
- WhatsApp: ${formData.whatsapp}
- Flavor: ${formData.cakeFlavor}
- Weight: ${formData.weight} kg
- Theme: ${formData.theme}
- Occasion: ${formData.occasion}
- Delivery: ${formData.deliveryDate} at ${formData.deliveryTime}
- Address: ${formData.deliveryAddress}
- Price Estimate: ₹${estimatedPrice}
- Instructions: ${formData.instructions || 'None'}`;

        const encodedMsg = encodeURIComponent(whatsAppMsg);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=919980624419&text=${encodedMsg}`;
        
        // Open WhatsApp in a brief moment
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place custom cake order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="custom-cakes" className="py-24 bg-cream/10 dark:bg-dark-cocoa/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-gold font-sans text-xs tracking-[0.25em] font-bold uppercase block mb-3">
            Bespoke Confectionery
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warm-brown dark:text-cream leading-tight">
            Design Your Dream Cake
          </h2>
          <p className="mt-3 text-sm text-warm-brown/60 dark:text-cream/60 font-sans">
            Customize every layer, flavor, and theme. Our pastry masters will craft a masterpiece for your special day.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Designer Form */}
          <div className="lg:col-span-8 bg-white dark:bg-warm-brown/10 p-8 rounded-3xl border border-warm-brown/5 shadow-xl">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-warm-brown dark:text-cream">
                  Booking Inquiry Submitted!
                </h3>
                <p className="text-sm text-warm-brown/60 dark:text-cream/60 max-w-md mx-auto">
                  Your custom cake request has been recorded under Order ID: <span className="font-bold text-gold">{orderId}</span>. 
                  We are now redirecting you to WhatsApp to chat with our designer and finalize details.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 bg-gold hover:bg-warm-brown text-white font-sans font-medium rounded-full text-xs uppercase tracking-wider transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Sunil Shetty"
                      className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                    />
                  </div>

                  {/* Occasion */}
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                      Occasion
                    </label>
                    <input
                      type="text"
                      name="occasion"
                      required
                      value={formData.occasion}
                      onChange={handleChange}
                      placeholder="e.g. 1st Birthday, Wedding"
                      className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Flavor */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                      Select Flavor Base
                    </label>
                    <select
                      name="cakeFlavor"
                      value={formData.cakeFlavor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                    >
                      {FLAVORS.map(flavor => (
                        <option key={flavor.name} value={flavor.name}>
                          {flavor.name} (₹{flavor.pricePerKg}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                      Weight (Kg)
                    </label>
                    <select
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                    >
                      <option value="1">1.0 Kg</option>
                      <option value="1.5">1.5 Kg</option>
                      <option value="2">2.0 Kg</option>
                      <option value="3">3.0 Kg</option>
                      <option value="4">4.0 Kg</option>
                      <option value="5">5.0 Kg</option>
                    </select>
                  </div>
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                    Cake Design Theme
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                  >
                    {THEMES.map(theme => (
                      <option key={theme.name} value={theme.name}>
                        {theme.name} (+₹{theme.extraCharge})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Delivery Date */}
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      required
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                    />
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                      Preferred Time Slot
                    </label>
                    <input
                      type="text"
                      name="deliveryTime"
                      required
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      placeholder="e.g. 4:00 PM - 6:00 PM"
                      className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    required
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Provide full address in B.C. Road / Bantwal region"
                    className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                  />
                </div>

                {/* Reference Image link */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                    Reference Image URL
                  </label>
                  <input
                    type="url"
                    name="referenceImage"
                    value={formData.referenceImage}
                    onChange={handleChange}
                    placeholder="e.g. Paste a Pinterest or web image link for reference"
                    className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                  />
                </div>

                {/* Additional Instructions */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                    Custom Lettering & Instructions
                  </label>
                  <textarea
                    name="instructions"
                    rows={3}
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="Write name to write on cake (e.g. 'Happy Birthday Ramesh'), eggless choice, color adjustments..."
                    className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-warm-brown hover:bg-gold text-white font-sans font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-md uppercase tracking-wider text-sm"
                >
                  {loading ? 'Processing Custom Order...' : 'Submit Inquiry & Chat on WhatsApp'}
                  <Send size={16} />
                </button>

              </form>
            )}
          </div>

          {/* Right: Estimate Card & Info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Pricing card */}
            <div className="bg-gradient-to-br from-warm-brown to-dark-cocoa text-cream p-8 rounded-3xl shadow-xl border border-gold/20 relative overflow-hidden">
              {/* Background circular overlay */}
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gold/10 border border-gold/10 pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-gold" size={20} />
                <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-gold">
                  Live Estimate Card
                </span>
              </div>
              
              <div className="space-y-4 border-b border-cream/10 pb-6">
                <div className="flex justify-between items-center text-xs">
                  <span>Flavor Base</span>
                  <span className="font-semibold text-right max-w-[150px] truncate">{selectedFlavor.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Weight Selected</span>
                  <span className="font-semibold">{formData.weight} Kg</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Design Theme Charge</span>
                  <span className="font-semibold">+₹{selectedTheme.extraCharge}</span>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-[10px] uppercase font-sans tracking-widest text-cream/60">Estimated Cost</p>
                <div className="text-3xl font-serif font-bold text-gold mt-1">₹{estimatedPrice}</div>
                <p className="text-[9px] text-cream/50 mt-3 italic">
                  *Final quote will be verified by our baking coordinator on WhatsApp.
                </p>
              </div>
            </div>

            {/* Design Help Note */}
            <div className="bg-gold/5 dark:bg-gold/2 p-6 rounded-3xl border border-gold/10 space-y-3">
              <h4 className="font-serif text-sm font-bold text-warm-brown dark:text-cream flex items-center gap-2">
                <HelpCircle size={16} className="text-gold" />
                How Custom Ordering Works
              </h4>
              <ol className="text-xs text-warm-brown/70 dark:text-cream/70 font-sans space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                <li>Submit your preferences using this designer form.</li>
                <li>Your request generates an automated WhatsApp booking text.</li>
                <li>WhatsApp launches instantly to connect you with our chef.</li>
                <li>Share custom sketches or inspect sample photos.</li>
                <li>We coordinate delivery location and secure payment.</li>
              </ol>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
export default CustomCakeForm;
