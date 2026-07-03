import React from 'react';
import { Flame, ShieldAlert, BadgePercent, CheckCircle, Truck, Compass, Sparkles, Smile } from 'lucide-react';

const FEATURES = [
  {
    icon: <Flame size={28} className="text-gold" />,
    title: 'Fresh Every Day',
    description: 'Baked fresh every morning with hot out-of-the-oven items served throughout the day.'
  },
  {
    icon: <Sparkles size={28} className="text-gold" />,
    title: 'Premium Quality',
    description: 'Prepared using high-grade flour, pure ghee, premium butter, and high-quality chocolate.'
  },
  {
    icon: <BadgePercent size={28} className="text-gold" />,
    title: 'Affordable Prices',
    description: 'Traditional Iyengar bakery favorites priced perfectly for daily family snacks and grand events.'
  },
  {
    icon: <CheckCircle size={28} className="text-gold" />,
    title: 'Hygienic Kitchen',
    description: 'We follow stringent sanitation protocols with a clean, modern kitchen environment.'
  },
  {
    icon: <Compass size={28} className="text-gold" />,
    title: 'Online Ordering',
    description: 'Browse our entire catalog online, add items to your cart, and place orders in seconds.'
  },
  {
    icon: <Truck size={28} className="text-gold" />,
    title: 'Fast Delivery',
    description: 'Quick local delivery within B.C. Road and surrounding areas to keep items fresh.'
  },
  {
    icon: <ShieldAlert size={28} className="text-gold" />,
    title: 'Custom Cake Design',
    description: 'Bespoke styles and flavors designed specifically to suit your birthday or wedding themes.'
  },
  {
    icon: <Smile size={28} className="text-gold" />,
    title: '100% Satisfaction',
    description: 'Delicious taste and outstanding service. We strive to bring pure delight with every bite.'
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-dark-cocoa/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-gold font-sans text-xs tracking-[0.25em] font-bold uppercase block mb-3">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warm-brown dark:text-cream leading-tight">
            Crafting Delightful Experiences
          </h2>
          <p className="mt-3 text-sm text-warm-brown/60 dark:text-cream/60 font-sans">
            Our commitment is to preserve traditional Indian tastes while delivering top-tier modern convenience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 bg-cream/10 dark:bg-warm-brown/5 border border-warm-brown/5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Gold Top Border Hover Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              
              {/* Icon Container */}
              <div className="h-14 w-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title & Desc */}
              <h3 className="font-serif text-lg font-bold text-warm-brown dark:text-cream mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-warm-brown/60 dark:text-cream/60 leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default WhyChooseUs;
