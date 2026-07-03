import React from 'react';
import { MapPin, Phone, MessageSquare, Mail, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-white dark:bg-dark-cocoa/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-gold font-sans text-xs tracking-[0.25em] font-bold uppercase block mb-3">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warm-brown dark:text-cream leading-tight">
            Visit Vijay Iyyangar Bakery
          </h2>
          <p className="mt-3 text-sm text-warm-brown/60 dark:text-cream/60 font-sans">
            Have questions about our custom cakes, catering, or bulk orders? Connect with us directly.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 p-5 bg-cream/10 dark:bg-warm-brown/5 rounded-2xl border border-warm-brown/5 shadow-sm">
                <div className="h-10 w-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-warm-brown dark:text-cream">Our Location</h4>
                  <p className="mt-1 text-xs text-warm-brown/70 dark:text-cream/70 font-sans leading-relaxed">
                    Vijay Iyyangar Bakery, Near Bypass Junction, B.C. Road, Bantwal, Karnataka - 574219
                  </p>
                </div>
              </div>

              {/* Call Now */}
              <div className="flex gap-4 p-5 bg-cream/10 dark:bg-warm-brown/5 rounded-2xl border border-warm-brown/5 shadow-sm">
                <div className="h-10 w-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-warm-brown dark:text-cream">Call Support</h4>
                  <p className="mt-1 text-xs text-warm-brown/70 dark:text-cream/70 font-sans">
                    +91 99806 24419
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://api.whatsapp.com/send?phone=919980624419&text=Hi%20Vijay%20Iyyangar%20Bakery!%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-5 bg-cream/10 dark:bg-warm-brown/5 rounded-2xl border border-warm-brown/5 shadow-sm hover:border-gold/30 hover:bg-gold/5 transition-all group"
              >
                <div className="h-10 w-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-warm-brown dark:text-cream group-hover:text-gold transition-colors">
                    WhatsApp Chat Support
                  </h4>
                  <p className="mt-1 text-xs text-warm-brown/70 dark:text-cream/70 font-sans">
                    Instant message chat: +91 99806 24419
                  </p>
                </div>
              </a>

              {/* Business Hours */}
              <div className="flex gap-4 p-5 bg-cream/10 dark:bg-warm-brown/5 rounded-2xl border border-warm-brown/5 shadow-sm">
                <div className="h-10 w-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-warm-brown dark:text-cream">Baking Hours</h4>
                  <p className="mt-1 text-xs text-warm-brown/70 dark:text-cream/70 font-sans leading-relaxed">
                    Monday - Sunday: 6:00 AM - 10:00 PM <br />
                    <span className="text-[10px] text-gold font-semibold">Fresh morning bakes out by 7:30 AM</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Social handles */}
            <div className="pt-4 flex gap-4 items-center">
              <span className="font-sans text-xs font-bold uppercase text-warm-brown/50 dark:text-cream/50">
                Follow our bakes:
              </span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 bg-cream dark:bg-warm-brown/10 border border-warm-brown/10 rounded-full flex items-center justify-center text-warm-brown hover:text-gold dark:text-cream dark:hover:text-gold transition-colors"
                aria-label="Instagram Profile"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 bg-cream dark:bg-warm-brown/10 border border-warm-brown/10 rounded-full flex items-center justify-center text-warm-brown hover:text-gold dark:text-cream dark:hover:text-gold transition-colors"
                aria-label="Facebook Page"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Right: Map Embed */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border border-warm-brown/10 min-h-[350px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15555.88796859345!2d74.96695328715822!3d12.87733470000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba3574c83fa990f%3A0xb35eb7b79cd4f971!2sB.C%20Road%2C%20Bantwal%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1719740000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vijay Iyyangar Bakery Location"
            ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
