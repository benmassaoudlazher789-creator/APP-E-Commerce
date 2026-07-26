import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { removeFromCart, updateQuantity } from "../JS/actions/cart.action";
import {
    selectCartItems,
    selectSubtotal,
    selectTax,
    selectShipping,
    selectTotal,
    FREE_SHIPPING_THRESHOLD,
} from "../JS/selectors/cart.selectors";
import { formatPrice } from "../utils/format";
import Reveal from "../components/Reveal";
import "./Cart.css";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const subtotal = useSelector(selectSubtotal);
    const tax = useSelector(selectTax);
    const shipping = useSelector(selectShipping);
    const total = useSelector(selectTotal);

    if (items.length === 0) {
        return (
            <Reveal className="cart-empty">
                <h2>Your cart is empty</h2>
                <p className="text-small home__muted">
                    Looks like you haven&apos;t added any shoes yet.
                </p>
                <Link to="/shop">
                    <button className="btn-primary">Continue Shopping</button>
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
                        {items.map((item) => (
                            <motion.div
                                key={`${item.productId}-${item.size}`}
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
                                    {item.brand && <p className="text-small home__muted">{item.brand}</p>}
                                    <p className="text-small home__muted">Size: {item.size}</p>
                                </div>
                                <div className="cart-line__stepper">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatch(updateQuantity(item.productId, item.size, item.quantity - 1))
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatch(updateQuantity(item.productId, item.size, item.quantity + 1))
                                        }
                                        disabled={item.quantity >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="cart-line__price">{formatPrice(item.price * item.quantity)}</p>
                                <button
                                    type="button"
                                    className="cart-line__remove"
                                    aria-label="Remove item"
                                    onClick={() => dispatch(removeFromCart(item.productId, item.size))}
                                >
                                    ✕
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="cart-summary__row">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
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
                        <span>{formatPrice(total)}</span>
                    </div>
                    <motion.button
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
