import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EASE_SMOOTH, SPRING_BOUNCY } from '../utils/motion';
import SectionHeading from './SectionHeading';
import './CategoriesSection.css';

const MotionLink = motion(Link);

const CATEGORIES = [
    {
        name: 'Men',
        description: 'Performance and street style, built to last.',
        img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop',
        link: '/shop?gender=men',
    },
    {
        name: 'Women',
        description: 'Designed for movement, made to turn heads.',
        img: 'https://images.unsplash.com/photo-1524553879936-2ff074ae5816?w=600&auto=format&fit=crop',
        link: '/shop?gender=women',
    },
    {
        name: 'Kids',
        description: 'Durable comfort for every adventure.',
        img: 'https://images.unsplash.com/photo-1552912276-56ef47874741?w=600&auto=format&fit=crop',
        link: '/shop?gender=kids',
    },
];

export default function CategoriesSection() {
    const shouldReduceMotion = useReducedMotion();

    const gridVariants = {
        hidden: {},
        show: {
            transition: shouldReduceMotion ? { staggerChildren: 0 } : { staggerChildren: 0.1, delayChildren: 0.05 },
        },
    };
    const cardVariants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_SMOOTH } },
    };
    const hoverLift = shouldReduceMotion
        ? {}
        : { y: -8, boxShadow: '0 24px 48px rgba(230, 57, 70, 0.22)' };

    return (
        <section className="categories">
            <div className="section categories__container">
                <SectionHeading title="Shop by Category" />
                <motion.div
                    className="categories__grid"
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {CATEGORIES.map((cat) => {
                        return (
                            <MotionLink
                                key={cat.name}
                                to={cat.link}
                                className="category-card"
                                variants={cardVariants}
                                whileHover={hoverLift}
                                whileTap={{ scale: 0.98 }}
                                transition={SPRING_BOUNCY}
                            >
                                <img src={cat.img} alt="" className="category-card__image" />
                                <span className="category-card__overlay" aria-hidden="true" />
                                <div className="category-card__content">
                                    <h3 className="category-card__name">{cat.name}</h3>
                                    <span className="category-card__rule" aria-hidden="true" />
                                    <p className="category-card__desc">{cat.description}</p>
                                </div>
                                <span className="category-card__arrow" aria-hidden="true">
                                    <ArrowRight size={20} strokeWidth={2} />
                                </span>
                            </MotionLink>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
