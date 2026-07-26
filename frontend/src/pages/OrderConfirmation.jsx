import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getOrderByNumber } from "../JS/actions/order.action";
import { formatPrice } from "../utils/format";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
    const { orderNumber } = useParams();
    const dispatch = useDispatch();
    const { order, isLoad, errors } = useSelector((state) => state.orderReducer);

    useEffect(() => {
        dispatch(getOrderByNumber(orderNumber));
        window.scrollTo(0, 0);
    }, [orderNumber, dispatch]);

    if (isLoad || !order) {
        if (errors) {
            return (
                <div className="order-confirmation order-confirmation--error">
                    <h2>We couldn&apos;t find that order</h2>
                    <Link to="/shop">
                        <button className="btn-primary">Back to Shop</button>
                    </Link>
                </div>
            );
        }
        return <p className="text-small home__muted order-confirmation__loading">Loading order…</p>;
    }

    return (
        <div className="order-confirmation">
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                className="order-confirmation__check"
            >
                ✓
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
            >
                Order Confirmed
            </motion.h1>
            <p className="text-small home__muted">Thank you — your order is on its way.</p>

            <div className="order-confirmation__card">
                <div className="review-item">
                    <span>Order Number</span>
                    <strong>{order.orderNumber}</strong>
                </div>
                <div className="review-item">
                    <span>Shipping To</span>
                    <span>
                        {order.shippingInfo.fullName}, {order.shippingInfo.city}
                    </span>
                </div>

                <div className="review-block">
                    <h4>Items</h4>
                    {order.items.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="review-item">
                            <span>
                                {item.title} · Size {item.size} × {item.quantity}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>

                <div className="review-item review-item--total">
                    <span>Total Paid</span>
                    <span>{formatPrice(order.total)}</span>
                </div>
            </div>

            <Link to="/shop">
                <button className="btn-primary">Continue Shopping</button>
            </Link>
        </div>
    );
};

export default OrderConfirmation;
