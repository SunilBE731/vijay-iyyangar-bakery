'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingBag, CreditCard, Landmark, CheckCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    whatsapp: '',
    deliveryAddress: '',
    paymentMethod: 'COD' as 'COD' | 'UPI'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [upiStep, setUpiStep] = useState<'details' | 'scan' | 'complete'>('details');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setLoading(true);
      
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: formData.paymentMethod,
        totalAmount: cartTotal,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      if (formData.paymentMethod === 'UPI' && upiStep !== 'complete') {
        // If payment is UPI, show the QR code screen first
        setUpiStep('scan');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setPlacedOrder(data.order);
        setSuccess(true);
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.6 }
        });
        clearCart();
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const simulateInvoiceDownload = (order: any) => {
    // Generate text-based mock invoice file download
    const invoiceText = `
=========================================
      VIJAY IYYANGAR BAKERY INVOICE
=========================================
Order ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}
Customer Name: ${order.customerName}
Phone: ${order.phone}
WhatsApp: ${order.whatsapp}
Delivery Address: ${order.deliveryAddress}

-----------------------------------------
Items Ordered:
${order.items.map((item: any) => `- ${item.name} x ${item.quantity} : ₹${item.price * item.quantity}`).join('\n')}

-----------------------------------------
Subtotal: ₹${order.totalAmount}
Tax & Shipping: ₹0 (Free Delivery)
Total Paid: ₹${order.totalAmount} via ${order.paymentMethod}

Thank you for buying from Vijay Iyyangar Bakery!
Freshly Baked Everyday with Tradition & Love.
=========================================
`;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream/10 dark:bg-dark-cocoa/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-warm-brown/10 pb-6">
          <Link href="/" className="flex items-center gap-2 text-sm text-warm-brown hover:text-gold dark:text-cream dark:hover:text-gold transition-colors">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
          <Logo size="sm" />
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            /* Order Placed Success Screen */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-warm-brown/10 p-8 sm:p-12 rounded-3xl border border-warm-brown/5 shadow-2xl text-center space-y-6"
            >
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                ✓
              </div>
              <h2 className="text-3xl font-serif font-bold text-warm-brown dark:text-cream">
                Order Placed Successfully!
              </h2>
              <p className="text-sm text-warm-brown/70 dark:text-cream/70 max-w-md mx-auto">
                Thank you for your order! Your delicious treats are being freshly prepared. 
                Your Order Number is <span className="font-bold text-gold">{placedOrder?.id}</span>.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <button
                  onClick={() => simulateInvoiceDownload(placedOrder)}
                  className="px-6 py-3 border border-warm-brown/20 dark:border-gold/20 hover:border-gold hover:text-gold rounded-full font-sans font-medium text-xs uppercase tracking-wider text-warm-brown dark:text-cream transition-all flex items-center gap-2"
                >
                  <FileText size={16} />
                  Download Invoice
                </button>
                <Link
                  href={`/tracking?orderId=${placedOrder?.id}`}
                  className="px-6 py-3 bg-gold hover:bg-warm-brown text-white rounded-full font-sans font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Track Real-time Order
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Checkout Form & Cart review */
            <div key="checkout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form panel */}
              <div className="lg:col-span-7 bg-white dark:bg-warm-brown/10 p-8 rounded-3xl border border-warm-brown/5 shadow-xl space-y-6">
                
                {formData.paymentMethod === 'UPI' && upiStep === 'scan' ? (
                  /* UPI SCANNER INTERACTIVE SIMULATOR */
                  <div className="text-center py-4 space-y-6">
                    <h3 className="font-serif text-lg font-bold text-warm-brown dark:text-cream">
                      Scan UPI QR Code to Pay
                    </h3>
                    <p className="text-xs text-warm-brown/60 dark:text-cream/60">
                      Scan the code below using any UPI App (GPay, PhonePe, Paytm, BHIM) to complete your transaction of <span className="font-bold text-gold">₹{cartTotal}</span>.
                    </p>

                    {/* QR Code Graphic */}
                    <div className="mx-auto w-[200px] h-[200px] bg-white p-3 rounded-2xl border-2 border-gold flex flex-col items-center justify-center shadow-md relative group">
                      {/* Simulated QR blocks using SVG */}
                      <svg width="160" height="160" viewBox="0 0 100 100" fill="none" className="text-dark-cocoa">
                        {/* Finder patterns corners */}
                        <rect x="0" y="0" width="25" height="25" stroke="currentColor" strokeWidth="6" />
                        <rect x="5" y="5" width="15" height="15" fill="currentColor" />
                        <rect x="75" y="0" width="25" height="25" stroke="currentColor" strokeWidth="6" />
                        <rect x="80" y="5" width="15" height="15" fill="currentColor" />
                        <rect x="0" y="75" width="25" height="25" stroke="currentColor" strokeWidth="6" />
                        <rect x="5" y="80" width="15" height="15" fill="currentColor" />
                        {/* Random mock QR dots */}
                        <rect x="35" y="10" width="8" height="8" fill="currentColor" />
                        <rect x="50" y="5" width="12" height="12" fill="currentColor" />
                        <rect x="30" y="30" width="15" height="15" fill="currentColor" />
                        <rect x="55" y="45" width="8" height="8" fill="currentColor" />
                        <rect x="40" y="60" width="20" height="20" fill="currentColor" />
                        <rect x="70" y="65" width="10" height="10" fill="currentColor" />
                        <rect x="75" y="35" width="15" height="15" fill="currentColor" />
                      </svg>
                      {/* Tiny logo overlay */}
                      <div className="absolute inset-0 m-auto h-8 w-8 bg-white border border-gold rounded-md flex items-center justify-center font-serif text-[10px] font-bold text-gold">
                        VIB
                      </div>
                    </div>

                    <div className="text-xs font-sans text-warm-brown/70 dark:text-cream/70 space-y-1">
                      <div>UPI ID: <span className="font-bold text-gold">vijayiyengar@okaxis</span></div>
                      <div>Merchant: <span className="font-semibold">Vijay Iyyangar Bakery</span></div>
                    </div>

                    <div className="flex gap-4 justify-center pt-4">
                      <button
                        onClick={() => setUpiStep('details')}
                        className="px-5 py-2 border border-warm-brown/20 dark:border-gold/20 rounded-full text-xs font-semibold text-warm-brown dark:text-cream uppercase tracking-wider"
                      >
                        Change Payment
                      </button>
                      <button
                        onClick={() => {
                          setUpiStep('complete');
                          // Trigger order place programmatically after marking UPI done
                          setTimeout(() => {
                            const btn = document.getElementById('checkout-submit-btn');
                            btn?.click();
                          }, 100);
                        }}
                        className="px-5 py-2 bg-gold hover:bg-warm-brown text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        I Have Scanned & Paid
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Delivery Details Form */
                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    <h3 className="font-serif text-lg font-bold text-warm-brown dark:text-cream">
                      Delivery Details
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          required
                          value={formData.customerName}
                          onChange={handleChange}
                          placeholder="Sunil Shetty"
                          className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                          Contact Number
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

                    {/* Address */}
                    <div>
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        name="deliveryAddress"
                        required
                        rows={3}
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        placeholder="Provide details of house/building, street name, near landmarks in BC Road or Bantwal area"
                        className="w-full px-4 py-3 bg-cream/35 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-sm focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                      />
                    </div>

                    {/* Payment choice */}
                    <div className="space-y-3">
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/70 dark:text-cream/70">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {/* COD */}
                        <label
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            formData.paymentMethod === 'COD'
                              ? 'border-gold bg-gold/5 text-gold'
                              : 'border-warm-brown/10 dark:border-gold/10 text-warm-brown/70 dark:text-cream/75'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={formData.paymentMethod === 'COD'}
                            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'COD' }))}
                            className="hidden"
                          />
                          <Landmark size={20} />
                          <div className="text-left">
                            <div className="text-xs font-bold font-sans">Cash on Delivery</div>
                            <div className="text-[10px] opacity-70">Pay when foods arrive</div>
                          </div>
                        </label>

                        {/* UPI */}
                        <label
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            formData.paymentMethod === 'UPI'
                              ? 'border-gold bg-gold/5 text-gold'
                              : 'border-warm-brown/10 dark:border-gold/10 text-warm-brown/70 dark:text-cream/75'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="UPI"
                            checked={formData.paymentMethod === 'UPI'}
                            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'UPI' }))}
                            className="hidden"
                          />
                          <CreditCard size={20} />
                          <div className="text-left">
                            <div className="text-xs font-bold font-sans">Pay via UPI QR</div>
                            <div className="text-[10px] opacity-70">Scan and pay instantly</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="checkout-submit-btn"
                      disabled={loading || cart.length === 0}
                      className="w-full py-4 bg-warm-brown hover:bg-gold text-white font-sans font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-md uppercase tracking-wider text-xs"
                    >
                      {loading ? 'Processing...' : formData.paymentMethod === 'UPI' ? 'Scan & Pay UPI' : 'Confirm Order (COD)'}
                    </button>
                  </form>
                )}
              </div>

              {/* Cart review column */}
              <div className="lg:col-span-5 bg-white dark:bg-warm-brown/10 p-8 rounded-3xl border border-warm-brown/5 shadow-xl space-y-6">
                <h3 className="font-serif text-lg font-bold text-warm-brown dark:text-cream flex items-center gap-2 border-b border-warm-brown/10 pb-4">
                  <ShoppingBag size={20} className="text-gold" />
                  Order Summary
                </h3>

                {/* Items */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {cart.length === 0 ? (
                    <p className="text-xs text-warm-brown/50 dark:text-cream/50 text-center py-6">
                      No items inside cart.
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-serif font-bold text-warm-brown dark:text-cream truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-warm-brown/50 dark:text-cream/50">
                            ₹{item.product.price} x {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold text-warm-brown dark:text-cream">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Calculation */}
                <div className="border-t border-warm-brown/10 dark:border-gold/10 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-warm-brown/70 dark:text-cream/70">
                    <span>Order Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-warm-brown/70 dark:text-cream/70">
                    <span>Shipping Charges</span>
                    <span className="text-green-600 font-bold uppercase text-[10px]">Free Delivery</span>
                  </div>
                  <div className="flex justify-between items-center text-warm-brown/70 dark:text-cream/70">
                    <span>GST (Included)</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-serif font-bold text-warm-brown dark:text-cream border-t border-warm-brown/5 pt-2">
                    <span>Total Amount</span>
                    <span className="text-gold">₹{cartTotal}</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
