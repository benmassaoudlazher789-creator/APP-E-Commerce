import React from 'react';
import Hero from '../components/Hero';
import CategoriesSection from '../components/CategoriesSection';
import NewArrivalsSection from '../components/NewArrivalsSection';
import Testimonials from '../components/Testimonials';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';

function Home() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Hero />
            <CategoriesSection />
            <NewArrivalsSection />
            <WhyChooseUsSection />
            <StatsSection />
            <Testimonials />
            <Footer />
        </div>
    );
}

export default Home;