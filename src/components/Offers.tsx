'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Calendar, Sparkles, Smile, Percent } from 'lucide-react';
import confetti from 'canvas-confetti';

const OFFERS = [
  {
    title: 'Birthday Celebration Discount',
    desc: 'Plan ahead and book your designer birthday cakes with us to receive a flat 10% off.',
    code: 'BDAY10',
    validity: 'Valid on custom cakes above 1.5kg',
    tag: 'Celebration'
  },
  {
    title: 'Traditional Festival Specials',
    desc: 'Celebrate Ganesha Chaturthi & Diwali with our special sweet boxes and rich Dil Pasand boxes.',
    code: 'FESTIVE15',
    validity: 'Valid during Indian festive calendar months',
    tag: 'Tradition'
  },
  {
    title: 'Weekend Puff Treat (BOGO)',
    desc: 'Buy 3 Veg Puffs on Saturdays and Sundays between 4:00 PM and 7:00 PM, and get 1 hot Puff absolutely Free!',
    code: 'WEEKENDPFF',
    validity: 'Saturday & Sunday store walk-ins only',
    tag: 'BOGO'
  }
];

export const Offers: React.FC = () => {
  const [scratched, setScratched] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  // Scratch Card Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with gold scratch layer
    ctx.fillStyle = '#D4A017';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw scratch text/flourishes
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH WITH MOUSE/TOUCH', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '10px sans-serif';
    ctx.fillText('TO REVEAL SPECIAL CODE', canvas.width / 2, canvas.height / 2 + 10);
  }, []);

  const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Estimate scratched area percentage
    checkScratchPercentage();
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const pos = getMousePos(e);
    draw(pos.x, pos.y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault(); // Prevent touch scroll
    const pos = getMousePos(e);
    draw(pos.x, pos.y);
  };

  const handleEnd = () => {
    isDrawing.current = false;
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || scratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        transparentCount++;
      }
    }

    const percentage = (transparentCount / (pixels.length / 4)) * 100;
    setScratchProgress(Math.floor(percentage));

    if (percentage > 50) {
      setScratched(true);
      // Auto clear the rest
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Confetti effect
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#D4A017', '#6F4E37', '#FFF8F0']
      });
    }
  };

  return (
    <section id="offers" className="py-24 bg-cream/30 dark:bg-dark-cocoa/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-gold font-sans text-xs tracking-[0.25em] font-bold uppercase block mb-3">
            Special Promotions
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warm-brown dark:text-cream leading-tight">
            Sweet Deals & Offers
          </h2>
          <p className="mt-3 text-sm text-warm-brown/60 dark:text-cream/60 font-sans">
            Treat yourself and your loved ones with our seasonal discount vouchers and weekly BOGO deals.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Interactive Scratch Card */}
          <div className="lg:col-span-4 flex flex-col justify-center bg-white dark:bg-warm-brown/15 p-8 rounded-3xl border border-warm-brown/5 shadow-xl items-center text-center relative overflow-hidden min-h-[350px]">
            <div className="space-y-4">
              <div className="h-10 w-10 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift size={20} />
              </div>
              <h3 className="font-serif text-lg font-bold text-warm-brown dark:text-cream">
                Lucky Scratch Voucher
              </h3>
              <p className="text-xs text-warm-brown/60 dark:text-cream/60 max-w-xs leading-relaxed">
                Scratch off the golden layer below to reveal a secret discount coupon valid on all breads & biscuits!
              </p>
            </div>

            {/* Canvas Scratch area wrapper */}
            <div className="relative w-[280px] h-[140px] mt-6 rounded-2xl overflow-hidden border-2 border-gold shadow-md bg-cream flex flex-col items-center justify-center">
              {/* Back: Coupon Code */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">
                  CONGRATULATIONS!
                </span>
                <div className="text-2xl font-mono font-bold text-warm-brown dark:text-cream bg-light-beige/50 dark:bg-dark-cocoa/50 px-4 py-1.5 rounded-lg border border-warm-brown/10 mt-1 select-all cursor-pointer">
                  VIJAYFREE10
                </div>
                <span className="text-[9px] text-warm-brown/50 dark:text-cream/50 mt-1.5 font-sans">
                  Flat 10% Off Breads & Cookies • Code: VIJAYFREE10
                </span>
              </div>

              {/* Front Canvas layer */}
              <canvas
                ref={canvasRef}
                width={280}
                height={140}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                className="absolute inset-0 z-10 cursor-crosshair"
              />
            </div>

            {scratched && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-[10px] text-green-600 font-sans font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Sparkles size={12} /> Voucher Revealed successfully!
              </motion.div>
            )}
          </div>

          {/* Right: Promotion Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFERS.map((offer, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-warm-brown/10 p-6 rounded-3xl border border-warm-brown/5 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-sans tracking-widest text-gold font-bold uppercase px-2.5 py-1 bg-gold/10 rounded-full">
                      {offer.tag}
                    </span>
                    <Percent size={16} className="text-warm-brown/40 dark:text-cream/40" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-warm-brown dark:text-cream leading-tight">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-warm-brown/60 dark:text-cream/60 leading-relaxed font-sans">
                    {offer.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-warm-brown/10 dark:border-gold/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-warm-brown/50 dark:text-cream/50 font-sans">PROMO CODE</span>
                    <span className="font-mono font-bold text-gold bg-gold/5 dark:bg-gold/2 border border-gold/20 px-2 py-0.5 rounded-md">
                      {offer.code}
                    </span>
                  </div>
                  <p className="text-[10px] text-warm-brown/40 dark:text-cream/40 font-sans italic">
                    {offer.validity}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
export default Offers;
