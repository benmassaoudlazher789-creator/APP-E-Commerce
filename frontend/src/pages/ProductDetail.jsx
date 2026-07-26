import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProducts, getProductById } from "../JS/actions/Prod.action";
import { addToCart } from "../JS/actions/cart.action";
import ProductGrid from "../components/ProductGrid";
import Reveal from "../components/Reveal";
import { formatPrice } from "../utils/format";
import "./ProductDetail.css";

// composant remonte via `key={id}` (voir l'export par defaut plus bas) : chaque
// navigation vers un nouveau produit repart donc d'un etat local frais, sans
// avoir besoin de reinitialiser activeImage/selectedSize/quantity dans un effet.
const ProductDetailView = ({ id }) => {
    const dispatch = useDispatch();
    const { product, products } = useSelector((state) => state.productReducer);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        dispatch(getProductById(id));
        if (products.length === 0) dispatch(getAllProducts());
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, dispatch]);

    if (!product || product._id !== id) {
        return <p className="text-small home__muted product-detail__loading">Loading product…</p>;
    }

    const gallery = [product.imageProd, ...(product.images || [])].filter(Boolean);
    const sizeInfo = product.sizes || [];
    const currentStock = sizeInfo.find((s) => s.size === selectedSize)?.stock ?? 0;

    const handleAddToCart = () => {
        if (!selectedSize || currentStock === 0) return;
        dispatch(addToCart(product, selectedSize, quantity));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const related = products
        .filter((p) => p._id !== product._id && (p.brand === product.brand || p.category === product.category))
        .slice(0, 4);

    return (
        <div className="product-detail">
            <div className="product-detail__main">
                <div className="product-detail__gallery">
                    <div className="product-detail__main-image">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={gallery[activeImage] || "placeholder"}
                                src={gallery[activeImage] || "/vite.svg"}
                                alt={product.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            />
                        </AnimatePresence>
                    </div>
                    {gallery.length > 1 && (
                        <div className="product-detail__thumbs">
                            {gallery.map((img, i) => (
                                <button
                                    key={img + i}
                                    type="button"
                                    className={`product-detail__thumb ${
                                        i === activeImage ? "product-detail__thumb--active" : ""
                                    }`}
                                    onClick={() => setActiveImage(i)}
                                >
                                    <img src={img} alt={`${product.title} ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-detail__info">
                    {product.brand && <p className="text-small product-detail__brand">{product.brand}</p>}
                    <h1>{product.title}</h1>
                    <p className="product-detail__price">{formatPrice(product.price)}</p>

                    <div className="product-detail__sizes">
                        <h4>Size</h4>
                        <div className="shop__size-grid product-detail__size-grid">
                            {sizeInfo.length === 0 && (
                                <p className="text-small home__muted">No sizes available</p>
                            )}
                            {sizeInfo.map((s) => (
                                <button
                                    key={s.size}
                                    type="button"
                                    disabled={s.stock === 0}
                                    className={`shop__size-pill ${
                                        selectedSize === s.size ? "shop__size-pill--active" : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedSize(s.size);
                                        setQuantity(1);
                                    }}
                                >
                                    {s.size}
                                </button>
                            ))}
                        </div>
                        {selectedSize && (
                            <p className="text-small home__muted">
                                {currentStock > 0 ? `${currentStock} in stock` : "Out of stock"}
                            </p>
                        )}
                    </div>

                    <div className="product-detail__qty">
                        <h4>Quantity</h4>
                        <div className="product-detail__stepper">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={!selectedSize}
                            >
                                −
                            </button>
                            <span>{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                                disabled={!selectedSize || quantity >= currentStock}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <motion.button
                        type="button"
                        className="btn-primary product-detail__add"
                        whileHover={selectedSize && currentStock > 0 ? { scale: 1.02 } : {}}
                        whileTap={selectedSize && currentStock > 0 ? { scale: 0.98 } : {}}
                        disabled={!selectedSize || currentStock === 0}
                        onClick={handleAddToCart}
                    >
                        {added ? "Added ✓" : !selectedSize ? "Select a size" : "Add to Cart"}
                    </motion.button>

                    <div className="product-detail__description">
                        <h4>Description</h4>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="section product-detail__related">
                    <Reveal>
                        <h2>You Might Also Like</h2>
                    </Reveal>
                    <ProductGrid products={related} />
                </section>
            )}

            <Link to="/shop" className="product-detail__back">
                ← Back to Shop
            </Link>
        </div>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    return <ProductDetailView key={id} id={id} />;
};

export default ProductDetail;
