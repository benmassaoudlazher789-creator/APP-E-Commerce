import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import "./Shop.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1980';

const MOCK_PRODUCTS = [
    { _id: "1", title: "Red Store Pro Runner", brand: "Red Store", price: 149.99, imageProd: "https://images.unsplash.com/photo-1593443361409-0c9267d39d6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzA3fHxzbmVha2VyJTIwZGUlMjByZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [40, 41, 42, 43, 44] },
    { _id: "2", title: "Urban Red Sneakers", brand: "Red Store", price: 135.50, imageProd: "https://images.unsplash.com/photo-1675625500632-2d276bd51920?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjY0fHxzbmVha2VyJTIwZGUlMjByZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [41, 42, 43, 45] },
    { _id: "3", title: "Classic Red Runner", brand: "Red Store", price: 119.99, imageProd: "https://images.unsplash.com/photo-1656085180791-0e634c8bd1e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgzfHxzbmVha2VyJTIwZGUlMjByZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [40, 42, 44, 46] },
    { _id: "4", title: "Street Red Edition", brand: "Red Store", price: 159.00, imageProd: "https://images.unsplash.com/photo-1620114315899-abb0930264fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYwfHxzbmVha2VyJTIwZGUlMjByZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [41, 42, 43, 44] },
    { _id: "5", title: "Velocity Red", brand: "Red Store", price: 139.90, imageProd: "https://images.unsplash.com/photo-1706611760588-41ebba31012b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ0fHxzbmVha2VyJTIwZGUlMjByZWQlMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D", sizes: [40, 41, 43, 45] },
    { _id: "6", title: "Red Store Speedstar", brand: "Red Store", price: 129.00, imageProd: "https://images.unsplash.com/photo-1656944227480-98180d2a5155?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNuZWFrZXIlMjBkZSUyMHJlZCUyMHN0b3JlfGVufDB8fDB8fHww", sizes: [42, 43, 44, 46] }
];

const Shop = () => {
    const [searchParams] = useSearchParams();
    const genderParam = searchParams.get("gender") || "men"; 
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [maxPrice, setMaxPrice] = useState(200);

    // Charger les produits
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
                setLoading(false); // CRUCIAL : Arrête le chargement
            }
        };
        fetchProducts();
    }, [genderParam]);

    // Filtrer les produits
    useEffect(() => {
        let result = products;
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.some(brand => p.brand?.toLowerCase().includes(brand.toLowerCase())));
        }
        if (selectedSizes.length > 0) {
            result = result.filter(p => p.sizes && p.sizes.some(size => selectedSizes.includes(size)));
        }
        result = result.filter(p => p.price <= maxPrice);
        setFilteredProducts(result);
    }, [selectedBrands, selectedSizes, maxPrice, products]);

    const toggleBrand = (brand) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    const toggleSize = (size) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    const clearFilters = () => { setSelectedBrands([]); setSelectedSizes([]); setMaxPrice(200); };

    return (
        <div className="shop-page">
            <div className="shop-header">
                <h1 className="shop-title">Men's Shoes</h1>
                <span className="shop-count">{filteredProducts.length} products</span>
            </div>

            <div className="shop-layout">
                <aside className="shop-filters">
                    <div className="filter-group">
                        <h3>Brand</h3>
                        {[...new Set(products.map(p => p.brand).filter(Boolean))].map(brand => (
                            <label key={brand} className="filter-checkbox">
                                <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
                                {brand}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h3>Size</h3>
                        <div className="size-grid">
                            {[40, 41, 42, 43, 44, 45, 46].map(size => (
                                <button key={size} className={`size-btn ${selectedSizes.includes(size) ? 'active' : ''}`} onClick={() => toggleSize(size)}>{size}</button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Max Price</h3>
                        <input type="range" min="0" max="200" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="price-slider" />
                        <div className="price-label">Up to ${maxPrice.toFixed(2)}</div>
                    </div>

                    <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
                </aside>

                <main className="shop-grid">
                    {/* 1. Pendant le chargement (Squelettes) */}
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="product-card skeleton">
                                <div className="product-image-wrapper bg-gray-200"></div>
                                <div className="product-info mt-2">
                                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="flex justify-between mt-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        <p className="no-products">No products match your criteria.</p>
                    ) : (
                        /* 2. Les vrais produits */
                        filteredProducts.map((product) => (
                            <Link to={`/shop/${product._id}`} key={product._id} className="product-card">
                                <div className="product-image-wrapper">
                                    <img src={product.imageProd || "/vite.svg"} alt={product.title} className="product-image" />
                                </div>
                                <div className="product-info">
                                    <span className="product-brand">{product.brand || "Red Store"}</span>
                                    <h3 className="product-title">{product.title}</h3>
                                    <div className="product-footer">
                                        <span className="product-price">${product.price.toFixed(2)}</span>
                                        <button className="add-cart-btn">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;