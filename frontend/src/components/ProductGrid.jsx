import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag } from 'lucide-react';
import { addToCart } from '../JS/actions/cart.action';
import { addToWishlist, removeFromWishlist } from '../JS/actions/wishlist.action';
import { EASE_SMOOTH, SPRING_BOUNCY } from '../utils/motion';
import { formatPrice } from '../utils/format';
// reutilise exactement le meme style de card que "New Arrivals" (image, coeur wishlist,
// quick-add panier, titre, prix) pour un rendu identique partout ou une grille de
// produits est affichee (wishlist, "You Might Also Like"...)
import './NewArrivalsSection.css';

const defaultSizeFor = (product) => {
    const sizes = product.sizes || [];
    return (sizes.find((s) => s.stock > 0) || sizes[0])?.size;
};

const MotionLink = motion(Link);

export default function ProductGrid({ products }) {
    const dispatch = useDispatch();
    const shouldReduceMotion = useReducedMotion();
    const wishlistItems = useSelector((state) => state.wishlistReducer.items);

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
        : { y: -6, boxShadow: '0 20px 40px rgba(230, 57, 70, 0.12)' };

    const handleQuickAdd = async (event, product) => {
        event.preventDefault();
        event.stopPropagation();
        const size = defaultSizeFor(product);
        if (size === undefined) return;
        const result = await dispatch(addToCart(product, size));
        if (result.success) toast.success(`${product.title} added to cart`);
        else toast.error(result.error || 'Failed to add to cart');
    };

    const handleToggleWishlist = (event, product) => {
        event.preventDefault();
        event.stopPropagation();
        const isWishlisted = wishlistItems.some((p) => p._id === product._id);
        if (isWishlisted) dispatch(removeFromWishlist(product._id));
        else dispatch(addToWishlist(product));
    };

    return (
        <motion.div
            className="new-arrivals__grid"
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            {products.map((product) => {
                const isWishlisted = wishlistItems.some((p) => p._id === product._id);
                return (
                    <MotionLink
                        key={product._id}
                        to={`/shop/${product._id}`}
                        className="new-arrival-card"
                        variants={cardVariants}
                        whileHover={hoverLift}
                        whileTap={{ scale: 0.98 }}
                        transition={SPRING_BOUNCY}
                    >
                        <div className="new-arrival-card__image-wrapper">
                            <img
                                src={product.imageProd || '/vite.svg'}
                                alt={product.title}
                                className="new-arrival-card__image"
                                loading="lazy"
                            />
                            <button
                                type="button"
                                className={`new-arrival-card__wishlist-btn${
                                    isWishlisted ? ' new-arrival-card__wishlist-btn--active' : ''
                                }`}
                                onClick={(event) => handleToggleWishlist(event, product)}
                                aria-label={
                                    isWishlisted
                                        ? `Remove ${product.title} from wishlist`
                                        : `Add ${product.title} to wishlist`
                                }
                            >
                                <Heart size={16} strokeWidth={2} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                            <button
                                type="button"
                                className="new-arrival-card__quick-add"
                                onClick={(event) => handleQuickAdd(event, product)}
                                aria-label={`Add ${product.title} to cart`}
                            >
                                <ShoppingBag size={16} strokeWidth={2} />
                            </button>
                        </div>
                        <div className="new-arrival-card__info">
                            <h3 className="new-arrival-card__title">{product.title}</h3>
                            <span className="new-arrival-card__price">{formatPrice(product.price)}</span>
                        </div>
                    </MotionLink>
                );
            })}
        </motion.div>
    );
}
