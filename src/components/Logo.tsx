import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: { width: 40, height: 40, textSize: 'text-sm' },
    md: { width: 56, height: 56, textSize: 'text-lg' },
    lg: { width: 80, height: 80, textSize: 'text-2xl' }
  };

  const active = dimensions[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div 
        className="relative overflow-hidden rounded-full border border-gold/45 bg-white flex items-center justify-center shadow-sm transform transition-transform duration-300 hover:scale-105"
        style={{ width: active.width, height: active.height }}
      >
        <img
          src="/logo.jpg"
          alt="Vijay Ayyangar Bakery & Sweets Logo"
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div>
        <h1 className={`font-serif leading-none tracking-wide text-warm-brown dark:text-cream font-bold ${active.textSize}`}>
          Vijay Ayyangar
        </h1>
        <p className="font-sans text-[9px] tracking-[0.22em] text-gold font-semibold uppercase leading-none mt-1">
          BAKERY & SWEETS
        </p>
      </div>
    </div>
  );
};

export default Logo;
