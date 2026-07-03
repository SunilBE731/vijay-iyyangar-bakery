'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, ShoppingBag, Truck, CheckCircle2, User, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

// Wrap search params logic in a client component
function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Setup polling every 10 seconds to update tracking status in real-time
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const steps = [
    { label: 'Received', desc: 'Order logged & queued', icon: <ShoppingBag size={18} /> },
    { label: 'Preparing', desc: 'Sponge baking & custom styling', icon: <Clock size={18} /> },
    { label: 'Out for Delivery', desc: 'Handed to Bantwal coordinator', icon: <Truck size={18} /> },
    { label: 'Delivered', desc: 'Sweet treats arrived!', icon: <CheckCircle2 size={18} /> }
  ];

  const getStepIndex = (status: string) => {
    if (status === 'Received') return 0;
    if (status === 'Preparing') return 1;
    if (status === 'Out for Delivery') return 2;
    if (status === 'Delivered') return 3;
    return 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-sm text-warm-brown/60 dark:text-cream/60">Fetching tracking details...</p>
      </div>
    );
  }

  if (error || !orderId || !order) {
    return (
      <div className="bg-white dark:bg-warm-brown/15 p-8 sm:p-12 rounded-3xl border border-warm-brown/5 shadow-xl text-center space-y-6">
        <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h3 className="font-serif text-xl font-bold text-warm-brown dark:text-cream">Order Not Found</h3>
        <p className="text-xs text-warm-brown/60 dark:text-cream/60 max-w-sm mx-auto">
          We could not locate an order matching ID "{orderId}". Make sure the ID is typed correctly, or start a new order.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-6 py-2 bg-warm-brown hover:bg-gold text-white font-sans text-xs font-semibold uppercase tracking-wider rounded-full transition-all"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
    );
  }

  const activeIndex = getStepIndex(order.orderStatus);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Tracking Stepper (Left) */}
      <div className="lg:col-span-8 bg-white dark:bg-warm-brown/10 p-8 rounded-3xl border border-warm-brown/5 shadow-xl space-y-8">
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-warm-brown/10 dark:border-gold/10 pb-6">
          <div>
            <span className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">REAL-TIME ORDER STATUS</span>
            <h2 className="text-2xl font-serif font-bold text-warm-brown dark:text-cream mt-1">
              Order #{order.id}
            </h2>
          </div>
          <span className="px-4 py-1.5 bg-gold/10 text-gold text-xs font-sans font-bold uppercase rounded-full tracking-wider border border-gold/25">
            {order.orderStatus}
          </span>
        </div>

        {/* Vertical/Horizontal Stepper graphic */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 py-4">
          {/* Connector Line */}
          <div className="absolute left-[19px] md:left-0 top-[20px] md:top-[19px] bottom-4 md:bottom-auto w-[2px] md:w-full h-full md:h-[2px] bg-warm-brown/10 dark:bg-gold/10 z-0 pointer-events-none" />
          {/* Active Connector Progress Line */}
          <div 
            className="absolute left-[19px] md:left-0 top-[20px] md:top-[19px] w-[2px] md:h-[2px] bg-gold z-0 pointer-events-none transition-all duration-1000"
            style={{ 
              height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(activeIndex / 3) * 85}%` : '2px',
              width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(activeIndex / 3) * 100}%` : '2px'
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 z-10 relative">
                {/* Node bubble */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-gold border-gold text-white shadow-md'
                      : 'bg-white dark:bg-dark-cocoa border-warm-brown/20 dark:border-gold/20 text-warm-brown/50 dark:text-cream/50'
                  } ${isActive ? 'scale-110 animate-pulse-slow' : ''}`}
                >
                  {step.icon}
                </div>
                
                {/* Label text */}
                <div>
                  <h4 className={`font-serif text-sm font-bold ${isCompleted ? 'text-warm-brown dark:text-cream' : 'text-warm-brown/40 dark:text-cream/40'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-warm-brown/50 dark:text-cream/50 max-w-[120px] leading-tight mt-0.5 hidden md:block">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Product Items Summary */}
        <div className="border-t border-warm-brown/10 dark:border-gold/10 pt-6 space-y-4">
          <h3 className="font-serif text-sm font-bold text-warm-brown dark:text-cream">Items Prepared</h3>
          <div className="divide-y divide-warm-brown/5">
            {order.isCustomCake ? (
              <div className="py-3 flex justify-between text-xs items-center">
                <div>
                  <p className="font-serif font-bold text-warm-brown dark:text-cream">Custom Design Cake</p>
                  <p className="text-[10px] text-warm-brown/50 dark:text-cream/50 mt-0.5">
                    Flavor: {order.cakeFlavor} • Weight: {order.weight}kg • Theme: {order.theme}
                  </p>
                </div>
                <span className="font-sans font-bold text-gold">₹{order.totalAmount}</span>
              </div>
            ) : (
              order.items.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between text-xs items-center">
                  <div>
                    <p className="font-serif font-bold text-warm-brown dark:text-cream truncate max-w-xs">{item.name}</p>
                    <p className="text-[10px] text-warm-brown/50 dark:text-cream/50 mt-0.5">
                      ₹{item.price} each x {item.quantity}
                    </p>
                  </div>
                  <span className="font-sans font-bold text-warm-brown dark:text-cream">₹{item.price * item.quantity}</span>
                </div>
              ))
            )}
            {/* Total */}
            <div className="py-4 flex justify-between text-sm font-serif font-bold text-warm-brown dark:text-cream">
              <span>Total Bill Paid</span>
              <span className="text-gold">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Customer Info Column (Right) */}
      <div className="lg:col-span-4 bg-white dark:bg-warm-brown/10 p-8 rounded-3xl border border-warm-brown/5 shadow-xl space-y-6">
        <h3 className="font-serif text-base font-bold text-warm-brown dark:text-cream border-b border-warm-brown/10 pb-4">
          Delivery Details
        </h3>
        
        <div className="space-y-4 font-sans text-xs">
          {/* Customer */}
          <div className="flex gap-3">
            <User size={16} className="text-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-warm-brown/50 dark:text-cream/50">RECIPIENT NAME</p>
              <p className="font-semibold text-warm-brown dark:text-cream mt-0.5">{order.customerName}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex gap-3">
            <Phone size={16} className="text-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-warm-brown/50 dark:text-cream/50">CONTACT MOBILE</p>
              <p className="font-semibold text-warm-brown dark:text-cream mt-0.5">{order.phone}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex gap-3">
            <MapPin size={16} className="text-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-warm-brown/50 dark:text-cream/50">DELIVERY LOCATION</p>
              <p className="font-semibold text-warm-brown dark:text-cream mt-0.5 leading-relaxed">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-cream/10 dark:bg-dark-cocoa/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-warm-brown/10 pb-6">
          <Link href="/" className="flex items-center gap-2 text-sm text-warm-brown hover:text-gold dark:text-cream dark:hover:text-gold transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Logo size="sm" />
        </div>

        {/* Suspense Boundary for search parameters parsing */}
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-warm-brown/60 dark:text-cream/60 mt-4">Loading tracker...</p>
          </div>
        }>
          <TrackOrderContent />
        </Suspense>

      </div>
    </div>
  );
}
