import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_CART } from "../JS/actionsType/cart.actionType";
import { API_URL, getAuthHeaders } from "../utils/api";
import { formatPrice } from "../utils/format";
import "./Shop.css";

const MOCK_PRODUCTS = [
    { _id: "1", title: "Red Store Pro Runner", brand: "Red Store", price: 149.99, imageProd: "https://images.unsplash.com/photo-1593443361409-0c9267d39d6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzA3fHxzbmVha2VyJTIwZGUlMjBSZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [40, 41, 42, 43, 44] },
    { _id: "2", title: "Urban Red Sneakers", brand: "Red Store", price: 135.5, imageProd: "https://images.unsplash.com/photo-1675625500632-2d276bd51920?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjY0fHxzbmVha2VyJTIwZGUlMjBSZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [41, 42, 43, 45] },
    { _id: "3", title: "Classic Red Runner", brand: "Red Store", price: 119.99, imageProd: "https://images.unsplash.com/photo-1656085180791-0e634c8bd1e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgzfHxzbmVha2VyJTIwZGUlMjBSZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [40, 42, 44, 46] },
    { _id: "4", title: "Street Red Edition", brand: "Red Store", price: 159.0, imageProd: "https://images.unsplash.com/photo-1620114315899-abb0930264fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYwfHxzbmVha2VyJTIwZGUlMjBSZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [41, 42, 43, 44] },
    { _id: "5", title: "Velocity Red", brand: "Red Store", price: 139.9, imageProd: "https://images.unsplash.com/photo-1706611760588-41ebba31012b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ0fHxzbmVha2VyJTIwZGUlMjBSZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [40, 41, 43, 45] },
    { _id: "6", title: "Red Store Speedstar", brand: "Red Store", price: 129.0, imageProd: "https://images.unsplash.com/photo-1656944227480-98180d2a5155?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNuZWFrZXIlMjBkZSUyMHJlZCUyMHN0b3JlfGVufDB8fDB8fHww", sizes: [42, 43, 44, 46] },
];

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

    const isAuth = useSelector((state) => state.authReducer.isAuth);
    const dispatch = useDispatch();

    const pageTitle = GENDER_LABELS[genderParam] || "Shop";

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/api/product/search`, { params: { gender: genderParam } });
                const data = res.data.Prod || res.data || [];
                setProducts(data.length > 0 ? data : MOCK_PRODUCTS);
                setFilteredProducts(data.length > 0 ? data : MOCK_PRODUCTS);
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

        if (!isAuth || !localStorage.getItem("token")) {
            toast.error("Connectez-vous pour ajouter au panier.");
            return;
        }

        setAddingId(product._id);
        try {
            await axios.post(
                `${API_URL}/api/cart/add`,
                { productId: product._id, quantity: 1 },
                { headers: getAuthHeaders() }
            );
            const { data } = await axios.get(`${API_URL}/api/cart`, { headers: getAuthHeaders() });
            dispatch({ type: SET_CART, payload: data.items || [] });
            toast.success("Produit ajouté au panier !");
        } catch (err) {
            toast.error("Erreur lors de l'ajout au panier");
            console.error(err.response?.data?.msg || err.message);
        } finally {
            setAddingId(null);
        }
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
                        {[...new Set(products.map((p) => p.brand).filter(Boolean))].map((brand) => (
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
                            <article
                                key={product._id}
                                className="product-card"
                                style={{ "--card-index": index }}
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
                                    </div>
                                    <div className="product-info">
                                        <span className="product-brand">{product.brand || "Red Store"}</span>
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
                            </article>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
