import { useEffect, useId, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart } from "lucide-react";
import { addToCart } from "@/JS/actions/cart.action";
import { addToWishlist, removeFromWishlist } from "@/JS/actions/wishlist.action";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";
import { SPRING, SPRING_BOUNCY } from "@/utils/motion";

/* Adapte de https://smoothui.dev/docs/components/product-card - retheme rouge/noir
 * Red Store + branchement sur `product` (schema Mongoose reel) + cartReducer.
 *
 * ANIMATION STORYBOARD
 *    0ms   card entre dans le viewport -> fade up + scale (orchestre par le
 *          stagger du ProductGrid parent si `variants` est fourni, sinon
 *          la card gere sa propre entree independamment)
 *  250ms   badge apparait avec un effet spring
 *  hover   image zoom 1.05, coeur wishlist apparait
 *  click   bouton scale bounce + icone -> checkmark "Added"
 */

const STAR_PATH =
    "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z";

function StarIcon({ filled, half }) {
    const id = useId();

    if (half) {
        const gradientId = `half-star-${id}`;
        return (
            <svg aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id={gradientId}>
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <path
                    d={STAR_PATH}
                    fill={`url(#${gradientId})`}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                />
            </svg>
        );
    }

    return (
        <svg
            aria-hidden="true"
            className={cn("h-3.5 w-3.5", filled ? "text-amber-400" : "text-neutral-300")}
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={filled ? 0 : 1.5}
            viewBox="0 0 24 24"
        >
            <path d={STAR_PATH} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/**
 * @param {object} product - document Product Mongoose (title, price, imageProd, brand, sizes[{size,stock}], ...)
 * @param {string} [badge] - ex. "Sale" / "New". Si absent et le produit est en rupture, "Out of Stock" est utilise automatiquement.
 * @param {number} [rating] - pas de champ rating dans le schema Product actuel : a fournir explicitement si dispo un jour.
 * @param {number} [originalPrice] - pas de champ de prix barre dans le schema actuel : a fournir explicitement pour afficher le badge de reduction.
 * @param {object} [variants] - variantes Framer Motion nommees ("hidden"/"show") fournies par un
 *   parent orchestrateur (ex. ProductGrid) pour un stagger d'entree. Sans ce prop, la card anime
 *   sa propre apparition des qu'elle entre dans le viewport (usage standalone).
 */
export default function ProductCard({ product, badge, rating, originalPrice, className, variants }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();
    const user = useSelector((state) => state.authReducer.user);
    const wishlistItems = useSelector((state) => state.wishlistReducer.items);
    const isWishlisted = wishlistItems.some((p) => p._id === product._id);
    const [isHoverDevice, setIsHoverDevice] = useState(
        () => window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
    const [isAdded, setIsAdded] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
        const handler = (e) => setIsHoverDevice(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    // Image potentiellement deja en cache au montage (retour arriere, navigation
    // interne) : onLoad ne se redeclenche pas toujours dans ce cas.
    useEffect(() => {
        if (imgRef.current?.complete) setIsImageLoaded(true);
    }, []);

    const firstAvailableSize = product.sizes?.find((s) => s.stock > 0);
    const inStock = Boolean(firstAvailableSize);
    const resolvedBadge = badge || (!inStock ? "Out of Stock" : null);

    const handleAddToCart = () => {
        if (!inStock) return;
        dispatch(addToCart(product, firstAvailableSize.size, 1));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }
        dispatch(isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product));
    };

    const hasDiscount = originalPrice !== undefined && originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
        : 0;

    // Sans variantes fournies par un parent, la card orchestre elle-meme son
    // entree via whileInView (usage standalone). Avec des variantes, elle
    // delegue le "hidden"/"show" au contexte d'orchestration du parent (stagger).
    const motionProps = variants
        ? { variants }
        : {
              initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, transform: "translateY(20px) scale(0.97)" },
              whileInView: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px) scale(1)" },
              viewport: { once: true, margin: "-50px" },
          };

    return (
        <motion.div
            aria-label={`${product.title} - ${formatPrice(product.price)}`}
            className={cn(
                // !border-*/!shadow-* (modificateur important de Tailwind) : Bootstrap definit
                // ses propres classes globales ".border"/".shadow-sm" avec !important, qui gagnent
                // sinon sur les utilitaires Tailwind non-!important malgre le scoping .tw-scope
                // (voir aussi le bug d'underline deja rencontre plus tot dans le projet).
                "group relative flex w-full flex-col overflow-hidden rounded-2xl border !border-gray-100 bg-white !shadow-sm",
                "transition-all duration-300",
                isHoverDevice && "hover:!shadow-lg hover:!border-red-500",
                className
            )}
            role="article"
            transition={shouldReduceMotion ? { duration: 0 } : SPRING}
            whileHover={isHoverDevice && !shouldReduceMotion ? { y: -4 } : undefined}
            {...motionProps}
        >
            <Link to={`/shop/${product._id}`} className="block no-underline">
                <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-neutral-50">
                    {/* skeleton shimmer tant que l'image Cloudinary n'a pas fini de charger */}
                    {!isImageLoaded && (
                        <div className="absolute inset-0 animate-pulse bg-neutral-200/70" />
                    )}
                    {/* le produit "flotte" dans un cadre clair (object-contain + marge interne)
                        plutot que de remplir le carre en cropant (object-cover) : evite de
                        couper des chaussures photographiees en pied entier. */}
                    <div className="absolute inset-0 p-6">
                        <img
                            alt={product.title}
                            ref={imgRef}
                            onLoad={() => setIsImageLoaded(true)}
                            className={cn(
                                "h-full w-full object-contain transition-opacity duration-300",
                                isImageLoaded ? "opacity-100" : "opacity-0",
                                !shouldReduceMotion && "transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                                isHoverDevice && !shouldReduceMotion && "group-hover:scale-105"
                            )}
                            src={product.imageProd || "/vite.svg"}
                        />
                    </div>

                    {/* voile au survol */}
                    <div
                        className={cn(
                            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300",
                            isHoverDevice && "group-hover:opacity-100"
                        )}
                    />

                    {resolvedBadge && (
                        <motion.span
                            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, transform: "scale(1)" }}
                            className={cn(
                                "absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
                                resolvedBadge.toLowerCase() === "sale"
                                    ? "bg-[#e63946] text-white"
                                    : resolvedBadge.toLowerCase() === "new"
                                        ? "bg-red-600 text-white"
                                        : "bg-neutral-900/85 text-white"
                            )}
                            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, transform: "scale(0.6)" }}
                            role="status"
                            transition={shouldReduceMotion ? { duration: 0 } : SPRING_BOUNCY}
                        >
                            {resolvedBadge}
                        </motion.span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                        {product.brand && (
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                {product.brand}
                            </p>
                        )}
                        {rating !== undefined && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600">
                                <StarIcon filled />
                                {rating}
                            </span>
                        )}
                    </div>

                    <h3 className="line-clamp-2 min-h-[2.5rem] text-base font-bold uppercase leading-snug tracking-tight text-gray-900">
                        {product.title}
                    </h3>
                </div>
            </Link>

            {/* Bouton wishlist : en dehors du Link (un <button> ne peut pas etre imbrique
                dans un <a>), positionne en absolu sur le conteneur relatif du card. */}
            <motion.button
                aria-label={
                    isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`
                }
                className={cn(
                    "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500 backdrop-blur-sm",
                    "transition-colors duration-150 hover:bg-red-50 hover:text-red-600",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e63946]",
                    isHoverDevice ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                )}
                onClick={handleWishlist}
                type="button"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.85, transition: { duration: 0.1 } }}
            >
                <Heart
                    aria-hidden="true"
                    className={cn("h-4 w-4", isWishlisted && "text-red-600")}
                    fill={isWishlisted ? "currentColor" : "none"}
                />
            </motion.button>

            {/* Prix + CTA circulaire minimal (plutot qu'un bouton pleine largeur) :
                l'action reste "ajouter au panier" (premiere pointure en stock),
                seule l'apparence change pour matcher la maquette de reference. */}
            <div className="flex items-end justify-between gap-2 px-4 pb-4">
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold tracking-tight text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-xs text-neutral-400 line-through">
                                    {formatPrice(originalPrice)}
                                </span>
                                <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#e63946]">
                                    -{discountPercent}%
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <motion.button
                    aria-label={inStock ? `Add ${product.title} to cart` : `${product.title} is out of stock`}
                    className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all duration-200 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2",
                        isAdded
                            ? "bg-emerald-600"
                            : inStock
                                ? "bg-[#e63946] hover:bg-red-700"
                                : "cursor-not-allowed bg-neutral-200 text-neutral-400"
                    )}
                    disabled={!inStock || isAdded}
                    onClick={handleAddToCart}
                    type="button"
                    whileTap={!inStock || shouldReduceMotion ? undefined : { scale: 0.92 }}
                >
                    <AnimatePresence initial={false} mode="wait">
                        {isAdded ? (
                            <motion.span
                                animate={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
                                exit={{ opacity: 0, transform: "scale(0.7)" }}
                                initial={{ opacity: 0, transform: "scale(0.7) rotate(-45deg)" }}
                                key="added"
                                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
                            >
                                <CheckIcon />
                            </motion.span>
                        ) : (
                            <motion.span
                                animate={{ opacity: 1, transform: "scale(1)" }}
                                exit={{ opacity: 0, transform: "scale(0.7)" }}
                                initial={{ opacity: 0, transform: "scale(0.7)" }}
                                key="cart"
                                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
                            >
                                <ArrowIcon />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    );
}
