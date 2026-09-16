import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag } from 'lucide-react';
import { getSaleProducts } from '../JS/actions/Prod.action';
import { addToCart } from '../JS/actions/cart.action';
import { addToWishlist, removeFromWishlist } from '../JS/actions/wishlist.action';
import { EASE_SMOOTH, SPRING_BOUNCY } from '../utils/motion';
import { formatPrice } from '../utils/format';
import SectionHeading from '../components/SectionHeading';
// reutilise le style des cards (image wrapper, badge, quick-add, skeleton...)
// deja defini pour "New Arrivals" : Sale.css n'ajoute que ce qui est specifique
// a cette page (layout, sous-titre, badge de reduction, prix barre).
import '../components/NewArrivalsSection.css';
import './Sale.css';

// meme logique que NewArrivalsSection : pointure par defaut pour l'ajout
// rapide (la premiere en stock, sinon la premiere disponible sur le produit)
const defaultSizeFor = (product) => {
    const sizes = product.sizes || [];
    return (sizes.find((s) => s.stock > 0) || sizes[0])?.size;
};

const MotionLink = motion(Link);

export default function Sale() {
    const dispatch = useDispatch();
    const shouldReduceMotion = useReducedMotion();
    const { saleProducts, isLoadSaleProducts, saleProductsErrors } = useSelector(
        (state) => state.productReducer
    );
    const wishlistItems = useSelector((state) => state.wishlistReducer.items);

    useEffect(() => {
        dispatch(getSaleProducts());
    }, [dispatch]);

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
        else toast.error(result.error || "Failed to add to cart");
    };

    const handleToggleWishlist = (event, product) => {
        event.preventDefault();
        event.stopPropagation();
        const isWishlisted = wishlistItems.some((p) => p._id === product._id);
        if (isWishlisted) dispatch(removeFromWishlist(product._id));
        else dispatch(addToWishlist(product));
    };

    const showSkeleton = isLoadSaleProducts && saleProducts.length === 0;
    const showError = !isLoadSaleProducts && saleProductsErrors && saleProducts.length === 0;
    const showEmpty = !isLoadSaleProducts && !saleProductsErrors && saleProducts.length === 0;

    return (
        <div className="sale-page">
            <div className="section">
                <SectionHeading title="Sale" />
                <p className="sale__subtitle">Up to 40% off selected styles</p>

                {showSkeleton && (
                    <div className="sale__grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="new-arrival-card new-arrival-card--skeleton">
                                <div className="new-arrival-card__image new-arrival-card__image--skeleton" />
                                <div className="new-arrival-card__line new-arrival-card__line--title" />
                                <div className="new-arrival-card__line new-arrival-card__line--price" />
                            </div>
                        ))}
                    </div>
                )}

                {showError && <p className="new-arrivals__message">{saleProductsErrors}</p>}

                {showEmpty && <p className="new-arrivals__message">No sale items right now — check back soon.</p>}

                {!showSkeleton && saleProducts.length > 0 && (
                    <motion.div
                        className="sale__grid"
                        variants={gridVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {saleProducts.map((product) => (
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
                                    {product.discountPercentage > 0 && (
                                        <span className="sale-card__badge">-{product.discountPercentage}%</span>
                                    )}
                                    <button
                                        type="button"
                                        className={`new-arrival-card__wishlist-btn${
                                            wishlistItems.some((p) => p._id === product._id)
                                                ? ' new-arrival-card__wishlist-btn--active'
                                                : ''
                                        }`}
                                        onClick={(event) => handleToggleWishlist(event, product)}
                                        aria-label={
                                            wishlistItems.some((p) => p._id === product._id)
                                                ? `Remove ${product.title} from wishlist`
                                                : `Add ${product.title} to wishlist`
                                        }
                                    >
                                        <Heart
                                            size={16}
                                            strokeWidth={2}
                                            fill={wishlistItems.some((p) => p._id === product._id) ? 'currentColor' : 'none'}
                                        />
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
                                    <div className="sale-card__prices">
                                        {product.originalPrice > product.price && (
                                            <span className="sale-card__original-price">
                                                {formatPrice(product.originalPrice)}
                                            </span>
                                        )}
                                        <span className="sale-card__price">{formatPrice(product.price)}</span>
                                    </div>
                                </div>
                            </MotionLink>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
