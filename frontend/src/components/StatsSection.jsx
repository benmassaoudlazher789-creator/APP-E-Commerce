import Reveal from './Reveal';
import { STATS } from '../utils/stats';
import './StatsSection.css';

// bandeau "chiffres cles", partage entre About.jsx et la Home.
export default function StatsSection() {
    return (
        <section className="about-stats-section section">
            <div className="about-stats__grid">
                {STATS.map((stat, i) => (
                    <Reveal key={stat.label} delay={i * 0.08} className="about-stat">
                        <span className="about-stat__value">{stat.value}</span>
                        <span className="about-stat__label">{stat.label}</span>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
