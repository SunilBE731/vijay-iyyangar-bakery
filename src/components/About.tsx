import React from 'react';
import { ShieldCheck, Heart, Clock, Award, Users, Utensils } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: <Award className="text-gold" size={24} />,
    title: 'Premium Ingredients',
    description: 'We source the finest local milk, pure cardamoms, organic flour, and premium chocolates.'
  },
  {
    icon: <ShieldCheck className="text-gold" size={24} />,
    title: 'Hygienic Preparation',
    description: 'Our kitchen maintains hospital-grade cleanliness standards with regular temperature checks and clean attire.'
  },
  {
    icon: <Clock className="text-gold" size={24} />,
    title: 'Freshly Baked Daily',
    description: 'Every morning at 4:00 AM, our ovens are fired up to create fresh breads, hot puffs, and buns.'
  },
  {
    icon: <Heart className="text-gold" size={24} />,
    title: 'Affordable Pricing',
    description: 'Premium quality shouldn\'t mean premium prices. Authentic products made accessible to every family.'
  },
  {
    icon: <Users className="text-gold" size={24} />,
    title: 'Trusted by Families',
    description: 'Serving BC Road families for generations, crafting memories and celebrations with love.'
  },
  {
    icon: <Utensils className="text-gold" size={24} />,
    title: 'Custom Cake Experts',
    description: 'From 3D cartoon cakes to multi-tier luxury wedding cakes, we bring your dessert dreams to life.'
  }
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-cream/30 dark:bg-dark-cocoa/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Images Layout */}
          <div className="lg:col-span-5 grid grid-cols-12 gap-4 relative">
            {/* Background decoration shape */}
            <div className="absolute -inset-4 bg-gold/5 rounded-3xl -rotate-2 scale-105 pointer-events-none" />

            <div className="col-span-8">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop"
                alt="Breads baking"
                className="rounded-2xl shadow-xl w-full h-[250px] object-cover hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="col-span-4 self-end">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop"
                alt="Decorating cake"
                className="rounded-2xl shadow-lg w-full h-[150px] object-cover hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="col-span-4">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop"
                alt="Bakery displays"
                className="rounded-2xl shadow-lg w-full h-[180px] object-cover hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="col-span-8">
              <img
                src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop"
                alt="Delicious pasties"
                className="rounded-2xl shadow-xl w-full h-[220px] object-cover hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>

          {/* Right: Text Layout */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-gold font-sans text-xs tracking-[0.25em] font-bold uppercase block mb-3">
                Our Story & Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warm-brown dark:text-cream leading-tight">
                Authentic Traditions Baked Daily For Your Family
              </h2>
              <p className="mt-4 text-warm-brown/70 dark:text-cream/70 font-sans text-base leading-relaxed">
                Nestled in the heart of B.C. Road, Bantwal, Vijay Iyyangar Bakery merges the warm, crisp comfort of an authentic traditional Iyengar bakery with modern culinary excellence. We believe in food that creates memories, made from scratch daily, using recipe processes honed over decades of service.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {HIGHLIGHTS.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-white dark:bg-warm-brown/10 rounded-2xl border border-warm-brown/5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-10 w-10 flex-shrink-0 bg-gold/10 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-warm-brown dark:text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-warm-brown/60 dark:text-cream/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default About;
