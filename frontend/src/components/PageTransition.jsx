import { motion, useReducedMotion } from "framer-motion";
import { EASE_SMOOTH } from "../utils/motion";

// Variantes d'animation pour les transitions de page
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.99,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: EASE_SMOOTH,
            staggerChildren: 0.08,
        },
    },
    exit: {
        opacity: 0,
        y: -12,
        scale: 0.99,
        transition: {
            duration: 0.25,
            ease: EASE_SMOOTH,
        },
    },
};

// Variante degradee : seulement un fondu, sans translation/zoom, pour
// prefers-reduced-motion (evite le mouvement a chaque navigation).
const reducedVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
};

/**
 * Composant wrapper qui anime l'entrée et la sortie de chaque page.
 * Utiliser avec AnimatePresence + location.key dans le routeur.
 */
function PageTransition({ children }) {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.div
            variants={shouldReduceMotion ? reducedVariants : pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{ width: "100%" }}
        >
            {children}
        </motion.div>
    );
}

export default PageTransition;
