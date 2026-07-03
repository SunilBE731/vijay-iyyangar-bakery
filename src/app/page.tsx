import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SavoryBanner from '@/components/SavoryBanner';
import Menu from '@/components/Menu';
import CustomCakeForm from '@/components/CustomCakeForm';
import Gallery from '@/components/Gallery';
import WhyChooseUs from '@/components/WhyChooseUs';
import Reviews from '@/components/Reviews';
import Offers from '@/components/Offers';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-cream/10 dark:bg-dark-cocoa/5 scroll-smooth">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Savory Promo Banner */}
        <SavoryBanner />

        {/* Products Menu Catalog */}
        <Menu />

        {/* About Section */}
        <About />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Custom Cake Builder Form */}
        <CustomCakeForm />

        {/* Masonry Image Gallery */}
        <Gallery />

        {/* Testimonials Slider */}
        <Reviews />

        {/* Promotional Offers */}
        <Offers />

        {/* Google Maps & Details Contact Section */}
        <Contact />
      </main>

      {/* Footnote branding and newsletter */}
      <Footer />
    </div>
  );
}
