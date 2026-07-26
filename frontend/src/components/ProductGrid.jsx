import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ProductCard from "./ui/smoothui/product-card";
import "./ProductGrid.css";
import "../styles/tailwind-scoped.css";

function ProductGrid({ products, emptyMessage = "No products found." }) {
    const shouldReduceMotion = useReducedMotion();

    if (!products || products.length === 0) {
        return <p className="product-grid__empty">{emptyMessage}</p>;
    }

    // Definis ici (pas au niveau module) pour pouvoir couper le stagger et le
    // mouvement sous prefers-reduced-motion. Passees en tant que variantes
    // nommees a ProductCard, qui les recoit via le contexte d'orchestration
    // de Framer Motion au lieu de gerer sa propre animation d'entree.
    const containerVariants = {
        hidden: {},
        show: {
            transition: shouldReduceMotion
                ? { staggerChildren: 0 }
                : { staggerChildren: 0.08, delayChildren: 0.05 },
        },
    };
    const cardVariants = {
        hidden: shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, transform: "translateY(20px) scale(0.97)" },
        show: { opacity: 1, transform: "translateY(0px) scale(1)" },
    };

    return (
        <motion.div
            className="product-grid tw-scope"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
        >
            {products.map((product) => (
                <ProductCard key={product._id} product={product} variants={cardVariants} />
            ))}
        </motion.div>
    );
}

// Memoise : sans ca, un parent qui re-render frequemment (ex. le slider Max Price de Shop.jsx
// pendant un drag) force ProductGrid a refaire toute sa reconciliation Framer Motion a chaque
// tick meme quand `products` reference le meme tableau (via useMemo cote parent), bloquant le
// thread principal et rendant le curseur natif saccade.
export default memo(ProductGrid);
