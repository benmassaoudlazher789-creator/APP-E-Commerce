import { useState } from "react";
import { motion } from "framer-motion";
import { validateCard } from "../../utils/validators";

// clef Stripe cote frontend (VITE_STRIPE_PUBLIC_KEY) - absente en dev, donc le flux
// retombe sur le formulaire de carte + le mock processPayment (voir payment.action.js)
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

function PaymentStep({ initialData, onNext, onBack }) {
    const [method, setMethod] = useState(initialData.method || "card");
    const [card, setCard] = useState({
        cardNumber: initialData.cardNumber || "",
        expiry: initialData.expiry || "",
        cvv: initialData.cvv || "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => setCard({ ...card, [field]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (method === "card") {
            const validationErrors = validateCard(card);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length > 0) return;
            onNext({ method: "card", ...card });
        } else {
            onNext({ method: "paypal" });
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="checkout-form"
            onSubmit={handleSubmit}
            noValidate
        >
            <h3>Payment</h3>

            {STRIPE_PUBLIC_KEY && (
                <p className="checkout-form__hint text-small">
                    Stripe test mode is configured — card details below are submitted through
                    Stripe Checkout.
                </p>
            )}

            <div className="payment-method-toggle">
                <button
                    type="button"
                    className={method === "card" ? "payment-method-toggle__btn--active" : ""}
                    onClick={() => setMethod("card")}
                >
                    Credit / Debit Card
                </button>
                <button
                    type="button"
                    className={method === "paypal" ? "payment-method-toggle__btn--active" : ""}
                    onClick={() => setMethod("paypal")}
                >
                    PayPal
                </button>
            </div>

            {method === "card" ? (
                <>
                    <label>
                        Card Number
                        <input
                            value={card.cardNumber}
                            onChange={handleChange("cardNumber")}
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                        />
                        {errors.cardNumber && (
                            <span className="checkout-form__error">{errors.cardNumber}</span>
                        )}
                    </label>
                    <div className="checkout-form__row">
                        <label>
                            Expiry (MM/YY)
                            <input value={card.expiry} onChange={handleChange("expiry")} placeholder="12/28" maxLength={5} />
                            {errors.expiry && <span className="checkout-form__error">{errors.expiry}</span>}
                        </label>
                        <label>
                            CVV
                            <input value={card.cvv} onChange={handleChange("cvv")} placeholder="123" maxLength={4} />
                            {errors.cvv && <span className="checkout-form__error">{errors.cvv}</span>}
                        </label>
                    </div>
                    <p className="text-small home__muted">
                        Test card: use <strong>4000 0000 0000 0002</strong> to simulate a decline.
                    </p>
                </>
            ) : (
                <div className="paypal-placeholder">
                    <p className="text-small home__muted">
                        You&apos;ll be redirected to PayPal to complete your payment securely.
                    </p>
                    <div className="paypal-placeholder__btn">PayPal Checkout</div>
                </div>
            )}

            <div className="checkout-form__actions">
                <button type="button" className="btn-secondary" onClick={onBack}>
                    Back
                </button>
                <button type="submit" className="btn-primary">
                    Review Order
                </button>
            </div>
        </motion.form>
    );
}

export default PaymentStep;
