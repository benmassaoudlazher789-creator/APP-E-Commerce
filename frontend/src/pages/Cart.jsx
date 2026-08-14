import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { SET_CART } from "../JS/actionsType/cart.actionType";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "../JS/selectors/cart.selectors";
import { API_URL, getAuthHeaders } from "../utils/api";
import { formatPrice } from "../utils/format";
import { STORE_BRAND } from "../utils/brand";
import Reveal from "../components/Reveal";
import "./Cart.css";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector((state) => state.authReducer.isAuth);
    const token = localStorage.getItem("token");

    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingKey, setUpdatingKey] = useState(null);

    const itemKey = (item) => `${item.productId}-${item.size ?? "default"}`;

    const fetchCart = useCallback(async () => {
        if (!isAuth || !token) {
            setItems([]);
            setTotalPrice(0);
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const { data } = await axios.get(`${API_URL}/api/cart`, { headers: getAuthHeaders() });
            const cartItems = data.items || [];
            setItems(cartItems);
            setTotalPrice(data.totalPrice ?? 0);
            dispatch({ type: SET_CART, payload: cartItems });
        } catch (err) {
            toast.error("Erreur lors du chargement du panier");
            console.error(err.response?.data?.msg || err.message);
            setError("Unable to load your cart. Please try again later.");
            setItems([]);
            setTotalPrice(0);
        } finally {
            setLoading(false);
        }
    }, [dispatch, isAuth, token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleQuantityChange = async (item, delta) => {
        if (!token) return;

        const key = itemKey(item);
        setUpdatingKey(key);
        try {
            await axios.post(
                `${API_URL}/api/cart/add`,
                { productId: item.productId, quantity: delta, size: item.size },
                { headers: getAuthHeaders() }
            );
            await fetchCart();
        } catch (err) {
            toast.error("Erreur lors de la mise à jour du panier");
            console.error(err.response?.data?.msg || err.message);
        } finally {
            setUpdatingKey(null);
        }
    };

    const handleRemove = async (item) => {
        if (!token) return;

        const key = itemKey(item);
        setUpdatingKey(key);
        try {
            const sizeQuery = item.size != null ? `?size=${item.size}` : "";
            await axios.delete(
                `${API_URL}/api/cart/remove/${item.productId}${sizeQuery}`,
                { headers: getAuthHeaders() }
            );
            await fetchCart();
            toast.success("Article retiré du panier");
        } catch (err) {
            toast.error("Erreur lors de la suppression");
            console.error(err.response?.data?.msg || err.message);
        } finally {
            setUpdatingKey(null);
        }
    };

    const tax = totalPrice * TAX_RATE;
    const shipping = totalPrice === 0 || totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const orderTotal = totalPrice + tax + shipping;

    if (!isAuth || !token) {
        return (
            <Reveal className="cart-empty">
                <h2>Sign in to view your cart</h2>
                <p className="text-small home__muted">Your cart is saved to your account once you&apos;re logged in.</p>
                <Link to="/login">
                    <button type="button" className="btn-primary">Sign In</button>
                </Link>
            </Reveal>
        );
    }

    if (loading) {
        return (
            <div className="cart-page">
                <Reveal>
                    <h1>Your Cart</h1>
                </Reveal>
                <p className="text-small home__muted">Loading cart…</p>
            </div>
        );
    }

    if (error) {
        return (
            <Reveal className="cart-empty">
                <h2>Something went wrong</h2>
                <p className="text-small home__muted">{error}</p>
                <button type="button" className="btn-primary" onClick={fetchCart}>
                    Retry
                </button>
            </Reveal>
        );
    }

    if (items.length === 0) {
        return (
            <Reveal className="cart-empty">
                <h2>Your cart is empty</h2>
                <p className="text-small home__muted">Looks like you haven&apos;t added any shoes yet.</p>
                <Link to="/shop">
                    <button type="button" className="btn-primary">Continue Shopping</button>
                </Link>
            </Reveal>
        );
    }

    return (
        <div className="cart-page">
            <Reveal>
                <h1>Your Cart</h1>
            </Reveal>

            <div className="cart-page__layout">
                <div className="cart-page__items">
                    <AnimatePresence>
                        {items.map((item) => {
                            const key = itemKey(item);
                            const isUpdating = updatingKey === key;

                            return (
                                <motion.div
                                    key={key}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.25 }}
                                    className="cart-line"
                                >
                                    <img src={item.image || "/vite.svg"} alt={item.title} />
                                    <div className="cart-line__info">
                                        <p className="cart-line__title">{item.title}</p>
                                        <p className="text-small home__muted">{STORE_BRAND}</p>
                                        {item.size != null && (
                                            <p className="text-small home__muted">Size: {item.size}</p>
                                        )}
                                    </div>
                                    <div className="cart-line__stepper">
                                        <button
                                            type="button"
                                            disabled={isUpdating || item.quantity <= 1}
                                            onClick={() => handleQuantityChange(item, -1)}
                                        >
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            type="button"
                                            disabled={isUpdating || (item.stock != null && item.quantity >= item.stock)}
                                            onClick={() => handleQuantityChange(item, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="cart-line__price">{formatPrice(item.price * item.quantity)}</p>
                                    <button
                                        type="button"
                                        className="cart-line__remove"
                                        aria-label="Remove item"
                                        disabled={isUpdating}
                                        onClick={() => handleRemove(item)}
                                    >
                                        ✕
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="cart-summary__row">
                        <span>Subtotal</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="cart-summary__row">
                        <span>Tax</span>
                        <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="cart-summary__row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                    </div>
                    {shipping > 0 && (
                        <p className="text-small home__muted cart-summary__note">
                            Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                        </p>
                    )}
                    <div className="cart-summary__row cart-summary__row--total">
                        <span>Total</span>
                        <span>{formatPrice(orderTotal)}</span>
                    </div>
                    <motion.button
                        type="button"
                        className="btn-primary cart-summary__checkout"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/checkout")}
                    >
                        Proceed to Checkout
                    </motion.button>
                    <Link to="/shop" className="cart-summary__continue">
                        ← Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
