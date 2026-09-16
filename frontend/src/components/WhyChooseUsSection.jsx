import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { WHY_CHOOSE_US } from '../utils/whyChooseUs';
import './WhyChooseUsSection.css';

// section "Why Choose Us" complete (titre + 4 cards avec description),
// partagee entre About.jsx et la Home.
export default function WhyChooseUsSection() {
    return (
        <section className="about-features-section section">
            <SectionHeading title="Why Choose Us" />
            <div className="about-features__grid">
                {WHY_CHOOSE_US.map(({ icon: Icon, title, description }, i) => (
                    <Reveal key={title} delay={i * 0.08} className="about-feature-card">
                        <span className="about-feature-card__icon">
                            <Icon size={24} strokeWidth={2} />
                        </span>
                        <h3 className="about-feature-card__title">{title}</h3>
                        <p className="about-feature-card__description">{description}</p>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
