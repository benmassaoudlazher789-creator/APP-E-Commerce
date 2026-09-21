import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "../JS/actions/wishlist.action";
import { API_URL } from "../utils/api";
import { formatPrice } from "../utils/format";
import { STORE_BRAND } from "../utils/brand";
import "./Shop.css"; // IMPORT CRUCIAL : Le CSS classique

const MOCK_PRODUCTS = [
    {
        _id: "1",
        title: "Red Store Urban Runner",
        brand: "Red Store",
        price: 139.99,
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1786646076/Screenshot_2026-08-13_192224_ewcnfr.png?v=2",
        sizes: [40, 41, 42, 43, 44]
    },
    {
        _id: "2",
        title: "Red Store Premium Leather",
        brand: "Red Store",
        price: 159.50,
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1786646056/Screenshot_2026-08-13_192259_p9jq8i.png?v=2",
        sizes: [41, 42, 43, 45]
    },
    {
        _id: "3",
        title: "Red Store Classic Retro",
        brand: "Red Store",
        price: 119.99,
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1786646097/Screenshot_2026-08-13_192216_x4citu.png?v=2",
        sizes: [40, 42, 44, 46]
    },
    {
        _id: "4",
        title: "Red Store Sport Lite",
        brand: "Red Store",
        price: 129.00,
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1786646117/Screenshot_2026-08-13_192205_g8qea5.png?v=2",
        sizes: [41, 42, 43, 44]
    },
    {
        _id: "5",
        title: "Red Store Street Edition",
        brand: "Red Store",
        price: 149.90,
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1786646283/Screenshot_2026-08-13_190106_qozbyf.png?v=2",
        sizes: [40, 41, 43, 45]
    },
    {
        _id: "6",
        title: "Red Store Executive Boot",
        brand: "Red Store",
        price: 169.00,
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1786646303/Screenshot_2026-08-13_190114_narpnd.png?v=2",
        sizes: [42, 43, 44, 46]
    }
];

const SORT_OPTIONS = [
    { value: "", label: "Sort: Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
    { value: "popularity", label: "Popularity" },
];

const GENDER_LABELS = {
    men: "Men's Shoes",
    women: "Women's Shoes",
    kids: "Kids' Shoes",
};

// meme trio d'images que CategoriesSection (coherence visuelle entre la carte
// "Men/Women/Kids" de la home et la banniere hero de la page Shop correspondante)
const HERO_IMAGES = {
    men: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=2000&auto=format&fit=crop",
    // meme photo que la carte "Women" de CategoriesSection (home) : verifiee
    // sans logo ni texte de marque visible.
    women: "https://images.unsplash.com/photo-1524553879936-2ff074ae5816?fm=jpg&q=80&w=2000&auto=format&fit=crop",
    kids: "https://images.unsplash.com/photo-1552912276-56ef47874741?fm=jpg&q=80&w=2000&auto=format&fit=crop",
    // vue sans ?gender= ("All Shoes").
    // photo-1600455745764 porte du texte de marque : "Twinkle toes" + "Skechers" sur
    // les languettes (~y 1100-1320 sur la version 2000px) et "Twinkle toes" sur le
    // pare-choc de la semelle droite (~y 1920-1970). On ne garde donc que la bande
    // du milieu (lacets + bouts stras, aucun texte lisible - verifie a pleine
    // resolution) via le parametre rect d'Unsplash : x,y,largeur,hauteur en pixels
    // de l'ORIGINAL (4016x6016). Cette bande est plus large que le hero (ratio
    // ~3.9), donc le navigateur ne rogne que les cotes : le texte ne peut pas
    // reapparaitre, quelle que soit la largeur d'ecran.
    all: "https://images.unsplash.com/photo-1600455745764-ebd75e6cd567?rect=0,2691,4016,1024&fm=jpg&q=80&w=2000&auto=format&fit=crop",
};

// banniere de la page dediee /new-arrivals (pas de ?gender= : tous les genres).
// Photo sombre sans aucun texte de marque visible (verifiee), pour que le titre
// blanc reste lisible ; le degrade .shop-hero__overlay fait le reste.
const NEW_ARRIVALS_HERO_IMAGE =
    "https://images.unsplash.com/photo-1632761298177-51e35403e27e?fm=jpg&q=80&w=2000&auto=format&fit=crop";
const NEW_ARRIVALS_HERO_POSITION = "50% 62%";

// nombre de produits recuperes (les plus recents d'abord) sur /new-arrivals
const NEW_ARRIVALS_LIMIT = 24;

const HERO_EYEBROWS = {
    men: "Men's Collection",
    women: "Women's Collection",
    kids: "Kids' Collection",
};

// l'ancienne photo Women etait un portrait recadre plus bas pour rester visible ;
// la photo actuelle (meme que CategoriesSection, format paysage) est bien cadree
// par le centre par defaut, donc plus besoin d'override de position ici.
const HERO_IMAGE_POSITIONS = {};

// newArrivals : true sur la route /new-arrivals. Meme page et meme mise en page que
// /shop, mais tous genres confondus, tri "newest" par defaut et banniere dediee.
const Shop = ({ newArrivals = false }) => {
    const [searchParams] = useSearchParams();
    // sans ?gender= la page liste TOUS les produits (Men + Women + Kids) ;
    // c'est la destination de "All Shoes" et des liens "/shop" generiques.
    // /new-arrivals ignore ?gender= : "across all categories".
    const genderParam = newArrivals ? null : searchParams.get("gender");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceCeiling, setPriceCeiling] = useState(200);
    const [maxPrice, setMaxPrice] = useState(200);
    const [sortBy, setSortBy] = useState(newArrivals ? "newest" : "");

    const wishlistItems = useSelector((state) => state.wishlistReducer.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const pageTitle = newArrivals ? "New Arrivals" : GENDER_LABELS[genderParam] || "All Shoes";
    const heroImage = newArrivals ? NEW_ARRIVALS_HERO_IMAGE : HERO_IMAGES[genderParam] || HERO_IMAGES.all;
    const heroEyebrow = newArrivals ? "Just Landed" : HERO_EYEBROWS[genderParam] || "Red Store Collection";
    const heroImagePosition = newArrivals ? NEW_ARRIVALS_HERO_POSITION : HERO_IMAGE_POSITIONS[genderParam];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/api/product/allProd`, {
                    // axios n'envoie pas un param undefined : aucun filtre de genre cote API
                    params: {
                        gender: genderParam || undefined,
                        sort: newArrivals ? "newest" : undefined,
                        limit: newArrivals ? NEW_ARRIVALS_LIMIT : undefined,
                    },
                });
                const data = res.data.Prod || res.data || [];
                const normalized = data.length > 0 ? data : MOCK_PRODUCTS;
                setProducts(normalized);
                setFilteredProducts(normalized);
                // le plafond du slider doit couvrir le produit le plus cher, sinon les
                // articles au-dessus de l'ancien plafond fixe restent inaccessibles
                const ceiling = Math.max(200, ...normalized.map((p) => Math.ceil(p.price || 0)));
                setPriceCeiling(ceiling);
                setMaxPrice(ceiling);
            } catch (err) {
                console.error("Erreur API:", err);
                setProducts(MOCK_PRODUCTS);
                setFilteredProducts(MOCK_PRODUCTS);
                setPriceCeiling(200);
                setMaxPrice(200);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [genderParam, newArrivals]);

    // options de la case a cocher "Brand" : derivees des marques reelles des produits
    // charges (au lieu d'une seule case "Red Store" qui ne filtrait jamais rien)
    const availableBrands = useMemo(
        () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
        [products]
    );

    useEffect(() => {
        let result = products;
        if (selectedBrands.length > 0) {
            result = result.filter((p) =>
                selectedBrands.some((brand) => p.brand?.toLowerCase().includes(brand.toLowerCase()))
            );
        }
        if (selectedSizes.length > 0) {
            // Product.sizes vient de l'API sous forme [{ size, stock }, ...] mais
            // MOCK_PRODUCTS utilise des nombres bruts [40, 41, ...]. Pour les objets,
            // une pointure en rupture de stock (stock: 0) ne compte pas comme
            // "disponible" : sans le garde stock > 0, filtrer par une pointure que
            // TOUS les produits possedent (meme a 0 en stock) ne changeait jamais
            // le nombre de resultats affiches.
            result = result.filter(
                (p) =>
                    p.sizes &&
                    p.sizes.some((s) =>
                        typeof s === "object"
                            ? selectedSizes.includes(s.size) && s.stock > 0
                            : selectedSizes.includes(s)
                    )
            );
        }
        result = result.filter((p) => p.price <= maxPrice);

        // Le tri ne change jamais le nombre de resultats, seulement leur ordre.
        result = result.sort((a, b) => {
            switch (sortBy) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "newest":
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                case "popularity":
                    // Le schema Product n'a pas encore de compteur de ventes/vues :
                    // en attendant une vraie metrique cote backend, on garde l'ordre
                    // d'origine plutot que d'inventer un classement.
                    return 0;
                default:
                    return 0;
            }
        });

        setFilteredProducts(result);
    }, [selectedBrands, selectedSizes, maxPrice, sortBy, products]);

    const toggleBrand = (brand) =>
        setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
    const toggleSize = (size) =>
        setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
    const clearFilters = () => {
        setSelectedBrands([]);
        setSelectedSizes([]);
        setMaxPrice(priceCeiling);
    };
    const hasActiveFilters = selectedBrands.length > 0 || selectedSizes.length > 0 || maxPrice < priceCeiling;

    const handleToggleWishlist = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        const isWishlisted = wishlistItems.some((p) => p._id === product._id);
        if (isWishlisted) dispatch(removeFromWishlist(product._id));
        else dispatch(addToWishlist(product));
    };

    // le bouton panier ne devine plus une pointure : il envoie vers la fiche
    // produit, ou vit le vrai selecteur de taille (evite le bug "toujours 40")
    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/shop/${product._id}`);
    };

    return (
        <>
            <section className="shop-hero">
                <img
                    src={heroImage}
                    alt=""
                    className="shop-hero__image"
                    style={heroImagePosition ? { objectPosition: heroImagePosition } : undefined}
                />
                <span className="shop-hero__overlay" aria-hidden="true" />
                <div className="shop-hero__content">
                    <p className="shop-hero__eyebrow">{heroEyebrow}</p>
                    <h1 className="shop-hero__title">{pageTitle}</h1>
                </div>
            </section>

            <div className="shop-page">
                <div className="shop-meta">
                    {hasActiveFilters && (
                        <div className="filter-chips">
                            {selectedBrands.map((brand) => (
                                <button
                                    key={`brand-${brand}`}
                                    type="button"
                                    className="filter-chip"
                                    onClick={() => toggleBrand(brand)}
                                >
                                    {brand}
                                    <X size={12} strokeWidth={2.5} />
                                </button>
                            ))}
                            {selectedSizes.map((size) => (
                                <button
                                    key={`size-${size}`}
                                    type="button"
                                    className="filter-chip"
                                    onClick={() => toggleSize(size)}
                                >
                                    Size: {size}
                                    <X size={12} strokeWidth={2.5} />
                                </button>
                            ))}
                            {maxPrice < priceCeiling && (
                                <button
                                    type="button"
                                    className="filter-chip"
                                    onClick={() => setMaxPrice(priceCeiling)}
                                >
                                    Max {formatPrice(maxPrice)}
                                    <X size={12} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="shop-meta__row">
                        <span className="shop-count">
                            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                        </span>
                        <div className="sort-control">
                            <label htmlFor="shop-sort" className="sort-control__label">
                                Sort by
                            </label>
                            <select
                                id="shop-sort"
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="shop-layout">
                <aside className="shop-filters">
                    <div className="filter-group">
                        <h3>Brand</h3>
                        {availableBrands.map((brand) => (
                            <label key={brand} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                />
                                {brand}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h3>Size</h3>
                        <div className="size-grid">
                            {[40, 41, 42, 43, 44, 45, 46].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`size-btn ${selectedSizes.includes(size) ? "active" : ""}`}
                                    onClick={() => toggleSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Max Price</h3>
                        <input
                            type="range"
                            min="0"
                            max={priceCeiling}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="price-slider"
                        />
                        <div className="price-label">Up to {formatPrice(maxPrice)}</div>
                    </div>

                    {hasActiveFilters && (
                        <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    )}
                </aside>

                <main className="shop-grid">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="product-card product-card--skeleton">
                                <div className="product-image-wrapper product-image-wrapper--skeleton" />
                                <div className="product-info">
                                    <div className="skeleton-line skeleton-line--short" />
                                    <div className="skeleton-line skeleton-line--long" />
                                    <div className="product-footer">
                                        <div className="skeleton-line skeleton-line--price" />
                                        <div className="skeleton-circle" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        <p className="no-products">No products match your criteria.</p>
                    ) : (
                        filteredProducts.map((product, index) => (
                            <motion.article
                                key={product._id}
                                className="product-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.06,
                                    ease: "easeOut"
                                }}
                            >
                                <Link to={`/shop/${product._id}`} className="product-card__link">
                                    <div className="product-image-wrapper">
                                        <img
                                            src={product.imageProd || "/vite.svg"}
                                            alt={product.title}
                                            className="product-image"
                                            loading="lazy"
                                        />
                                        <button
                                            type="button"
                                            className={`product-card__wishlist-btn${
                                                wishlistItems.some((p) => p._id === product._id)
                                                    ? " product-card__wishlist-btn--active"
                                                    : ""
                                            }`}
                                            aria-label={
                                                wishlistItems.some((p) => p._id === product._id)
                                                    ? `Remove ${product.title} from wishlist`
                                                    : `Add ${product.title} to wishlist`
                                            }
                                            onClick={(e) => handleToggleWishlist(e, product)}
                                        >
                                            <Heart
                                                size={16}
                                                strokeWidth={2}
                                                fill={wishlistItems.some((p) => p._id === product._id) ? "currentColor" : "none"}
                                            />
                                        </button>
                                    </div>
                                    <div className="product-info">
                                        <span className="product-brand">{product.brand || STORE_BRAND}</span>
                                        <h3 className="product-title">{product.title}</h3>
                                        <div className="product-footer">
                                            <span className="product-price">{formatPrice(product.price)}</span>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    className="add-cart-btn"
                                    aria-label={`Add ${product.title} to cart`}
                                    onClick={(e) => handleAddToCart(e, product)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2" />
                                        <path
                                            d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </motion.article>
                        ))
                    )}
                </main>
                </div>
            </div>
        </>
    );
};

export default Shop;