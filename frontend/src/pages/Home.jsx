import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoriesSection from '../components/CategoriesSection';
import NewArrivalsSection from '../components/NewArrivalsSection';
import Testimonials from '../components/Testimonials';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';

// Fait defiler jusqu'a la section visee par le hash de l'URL (ex. "/#new-arrivals").
// react-router ne le fait pas tout seul, et la page arrive avec une transition
// (PageTransition) : la section n'existe pas encore au premier rendu quand on
// vient d'une autre page, d'ou la petite boucle d'attente.
// location.key est dans les dependances pour re-scroller quand on reclique sur le
// meme lien alors que le hash est deja dans l'URL.
function useScrollToHash() {
    const { hash, key } = useLocation();

    useEffect(() => {
        if (!hash) return undefined;
        const id = decodeURIComponent(hash.slice(1));
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

        let attempts = 0;
        const timer = setInterval(() => {
            const target = document.getElementById(id);
            attempts += 1;
            if (target) {
                clearInterval(timer);
                target.scrollIntoView({ behavior, block: 'start' });
            } else if (attempts >= 20) {
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [hash, key]);
}

function Home() {
    useScrollToHash();

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
