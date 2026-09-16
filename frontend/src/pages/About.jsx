import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import StatsSection from '../components/StatsSection';
import './About.css';

// image de boutique (etagere de boites a chaussures) - a remplacer par une
// vraie photo de boutique/atelier Red Store quand disponible
const STORY_IMAGE =
    'https://images.unsplash.com/photo-1761952199689-7bf870229d1e?q=80&w=1200&auto=format&fit=crop';

export default function About() {
    return (
        <div className="about-page">
            <section className="about-hero section">
                <SectionHeading title="Our Story" />
                <p className="about-hero__subtitle">
                    Red Store is a multi-brand shoe store — not just sneakers. We carry formal, casual, boots,
                    sandals and sport, curated from brands you trust and shipped straight to your door.
                </p>
            </section>

            <section className="about-story-section section">
                <Reveal className="about-story">
                    <h2 className="about-story__heading">Notre histoire</h2>
                    <p>
                        Red Store est né d'une passion toute simple : trouver la bonne paire de chaussures ne
                        devrait jamais être un compromis entre style, confort et qualité. Ce qui a commencé comme
                        une petite sélection pensée pour des proches est devenu un magasin multi-marques pensé
                        pour toute la famille — du costume au terrain de sport.
                    </p>
                    <p>
                        Chaque marque que nous proposons est choisie avec la même exigence : des matériaux
                        durables, une fabrication soignée, et un confort qui tient la distance. C'est pour ça que
                        vous retrouvez chez nous aussi bien des classiques habillés que des indispensables du
                        quotidien, des bottes pour l'hiver ou des sandales pour l'été.
                    </p>
                    <p>
                        Aujourd'hui, notre engagement reste le même qu'au premier jour : une sélection rigoureuse,
                        une livraison rapide, et un service client à l'écoute — pour que choisir vos chaussures
                        reste un plaisir, du premier clic à la première marche.
                    </p>
                </Reveal>
                <Reveal className="about-story__image-wrapper" delay={0.1}>
                    <img
                        src={STORY_IMAGE}
                        alt="Red Store shoe boutique interior"
                        className="about-story__image"
                        loading="lazy"
                    />
                </Reveal>
            </section>

            <WhyChooseUsSection />

            <StatsSection />

            <section className="about-cta-section section">
                <Reveal className="about-cta">
                    <h2 className="about-cta__title">Ready to find your next pair?</h2>
                    <Link to="/shop" className="about-cta__btn">
                        Shop Now &rarr;
                    </Link>
                </Reveal>
            </section>
        </div>
    );
}
