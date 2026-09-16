import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getCart, updateCartQuantity, removeFromCart } from "../JS/actions/cart.action";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD, selectSubtotal } from "../JS/selectors/cart.selectors";
import { formatPrice } from "../utils/format";
import { STORE_BRAND } from "../utils/brand";
import Reveal from "../components/Reveal";
import "./Cart.css";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector((state) => state.authReducer.isAuth);
    const token = localStorage.getItem("token");

    const items = useSelector((state) => state.cartReducer.items);
    const isLoad = useSelector((state) => state.cartReducer.isLoad);
    const errors = useSelector((state) => state.cartReducer.errors);
    const totalPrice = useSelector(selectSubtotal);

    const [updatingKey, setUpdatingKey] = useState(null);

    const itemKey = (item) => `${item.productId}-${item.size ?? "default"}`;

    useEffect(() => {
        if (isAuth && token) dispatch(getCart());
    }, [dispatch, isAuth, token]);

    const handleQuantityChange = async (item, delta) => {
        const key = itemKey(item);
        setUpdatingKey(key);
        const result = await dispatch(updateCartQuantity(item.productId, item.size, delta));
        if (!result.success) toast.error(result.error || "Erreur lors de la mise à jour du panier");
        setUpdatingKey(null);
    };

    const handleRemove = async (item) => {
        const key = itemKey(item);
        setUpdatingKey(key);
        const result = await dispatch(removeFromCart(item.productId, item.size));
        if (result.success) toast.success("Article retiré du panier");
        else toast.error(result.error || "Erreur lors de la suppression");
        setUpdatingKey(null);
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

    const isInitialLoading = isLoad && items.length === 0;

    if (isInitialLoading) {
        return (
            <div className="cart-page">
                <Reveal>
                    <h1>Your Cart</h1>
                </Reveal>
                <p className="text-small home__muted">Loading cart…</p>
            </div>
        );
    }

    if (errors && items.length === 0) {
        return (
            <Reveal className="cart-empty">
                <h2>Something went wrong</h2>
                <p className="text-small home__muted">{errors}</p>
                <button type="button" className="btn-primary" onClick={() => dispatch(getCart())}>
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
