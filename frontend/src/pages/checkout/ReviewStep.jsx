import { motion } from "framer-motion";
import { formatPrice } from "../../utils/format";

function maskCard(cardNumber) {
    const digits = cardNumber?.replace(/\s/g, "") || "";
    return `•••• •••• •••• ${digits.slice(-4)}`;
}

function ReviewStep({
    shippingInfo,
    paymentInfo,
    items,
    subtotal,
    tax,
    shipping,
    total,
    onBack,
    onPlaceOrder,
    isPlacing,
    placeError,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="checkout-form"
        >
            <h3>Review &amp; Place Order</h3>

            <div className="review-block">
                <h4>Shipping To</h4>
                <p>{shippingInfo.fullName}</p>
                <p>
                    {shippingInfo.address}, {shippingInfo.city} {shippingInfo.postalCode}
                </p>
                <p>{shippingInfo.phone}</p>
            </div>

            <div className="review-block">
                <h4>Payment</h4>
                <p>
                    {paymentInfo.method === "card"
                        ? maskCard(paymentInfo.cardNumber)
                        : "PayPal"}
                </p>
            </div>

            <div className="review-block">
                <h4>Items</h4>
                {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="review-item">
                        <span>
                            {item.title} · Size {item.size} × {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                ))}
            </div>

            <div className="review-block review-totals">
                <div className="review-item">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="review-item">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                </div>
                <div className="review-item">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="review-item review-item--total">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>

            {placeError && <p className="checkout-form__error checkout-form__error--block">{placeError}</p>}

            <div className="checkout-form__actions">
                <button type="button" className="btn-secondary" onClick={onBack} disabled={isPlacing}>
                    Back
                </button>
                <motion.button
                    type="button"
                    className="btn-primary"
                    whileHover={!isPlacing ? { scale: 1.02 } : {}}
                    whileTap={!isPlacing ? { scale: 0.98 } : {}}
                    onClick={onPlaceOrder}
                    disabled={isPlacing}
                >
                    {isPlacing ? "Processing…" : placeError ? "Retry Payment" : "Place Order"}
                </motion.button>
            </div>
        </motion.div>
    );
}

export default ReviewStep;
