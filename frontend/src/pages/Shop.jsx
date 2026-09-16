import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { addToCart } from "../JS/actions/cart.action";
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

const withStoreBrand = (products) => products.map((p) => ({ ...p, brand: STORE_BRAND }));

// meme logique que NewArrivalsSection/Sale : pointure par defaut pour l'ajout rapide
// (la premiere en stock, sinon la premiere disponible sur le produit)
const defaultSizeFor = (product) => {
    const sizes = product.sizes || [];
    return (sizes.find((s) => s.stock > 0) || sizes[0])?.size;
};

const GENDER_LABELS = {
    men: "Men's Shoes",
    women: "Women's Shoes",
    kids: "Kids' Shoes",
};

const Shop = () => {
    const [searchParams] = useSearchParams();
    const genderParam = searchParams.get("gender") || "men";
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [maxPrice, setMaxPrice] = useState(200);
    const [addingId, setAddingId] = useState(null);

    const wishlistItems = useSelector((state) => state.wishlistReducer.items);
    const dispatch = useDispatch();

    const pageTitle = GENDER_LABELS[genderParam] || "Shop";

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/api/product/search`, { params: { gender: genderParam } });
                const data = res.data.Prod || res.data || [];
                const normalized = withStoreBrand(data.length > 0 ? data : MOCK_PRODUCTS);
                setProducts(normalized);
                setFilteredProducts(normalized);
            } catch (err) {
                console.error("Erreur API:", err);
                setProducts(MOCK_PRODUCTS);
                setFilteredProducts(MOCK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [genderParam]);

    useEffect(() => {
        let result = products;
        if (selectedBrands.length > 0) {
            result = result.filter((p) =>
                selectedBrands.some((brand) => p.brand?.toLowerCase().includes(brand.toLowerCase()))
            );
        }
        if (selectedSizes.length > 0) {
            result = result.filter((p) => p.sizes && p.sizes.some((size) => selectedSizes.includes(size)));
        }
        result = result.filter((p) => p.price <= maxPrice);
        setFilteredProducts(result);
    }, [selectedBrands, selectedSizes, maxPrice, products]);

    const toggleBrand = (brand) =>
        setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
    const toggleSize = (size) =>
        setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
    const clearFilters = () => {
        setSelectedBrands([]);
        setSelectedSizes([]);
        setMaxPrice(200);
    };

    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        setAddingId(product._id);
        const result = await dispatch(addToCart(product, defaultSizeFor(product)));
        if (result.success) toast.success("Produit ajouté au panier !");
        else toast.error(result.error || "Erreur lors de l'ajout au panier");
        setAddingId(null);
    };

    const handleToggleWishlist = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        const isWishlisted = wishlistItems.some((p) => p._id === product._id);
        if (isWishlisted) dispatch(removeFromWishlist(product._id));
        else dispatch(addToWishlist(product));
    };

    return (
        <div className="shop-page">
            <header className="shop-header">
                <div className="shop-header__text">
                    <p className="shop-eyebrow">Red Store collection</p>
                    <h1 className="shop-title">{pageTitle}</h1>
                </div>
                <span className="shop-count">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                </span>
            </header>

            <div className="shop-layout">
                <aside className="shop-filters">
                    <div className="filter-group">
                        <h3>Brand</h3>
                        {[STORE_BRAND].map((brand) => (
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
                            max="200"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="price-slider"
                        />
                        <div className="price-label">Up to {formatPrice(maxPrice)}</div>
                    </div>

                    <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                        Clear Filters
                    </button>
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
                                        <span className="product-card__badge">New</span>
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
                                        <span className="product-brand">{STORE_BRAND}</span>
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
                                    disabled={addingId === product._id}
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
    );
};

export default Shop;