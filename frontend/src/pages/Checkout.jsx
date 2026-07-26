import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { processPayment } from "../JS/actions/payment.action";
import { placeOrder } from "../JS/actions/order.action";
import { clearCart } from "../JS/actions/cart.action";
import {
    selectCartItems,
    selectSubtotal,
    selectTax,
    selectShipping,
    selectTotal,
} from "../JS/selectors/cart.selectors";
import CheckoutSteps from "./checkout/CheckoutSteps";
import ShippingStep from "./checkout/ShippingStep";
import PaymentStep from "./checkout/PaymentStep";
import ReviewStep from "./checkout/ReviewStep";
import "./checkout/Checkout.css";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const items = useSelector(selectCartItems);
    const subtotal = useSelector(selectSubtotal);
    const tax = useSelector(selectTax);
    const shipping = useSelector(selectShipping);
    const total = useSelector(selectTotal);

    const [step, setStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
    });
    const [paymentInfo, setPaymentInfo] = useState({
        method: "card",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });
    const [isPlacing, setIsPlacing] = useState(false);
    const [placeError, setPlaceError] = useState(null);

    // redirige vers le panier si l'utilisateur arrive ici sans articles
    useEffect(() => {
        if (items.length === 0) navigate("/cart");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePlaceOrder = async () => {
        setIsPlacing(true);
        setPlaceError(null);

        // les deux methodes passent par le meme endpoint serveur : le resultat doit etre
        // authoritatif cote backend, pas simule dans le navigateur (voir payment.controller.js)
        const paymentResult = await dispatch(processPayment(paymentInfo, total));

        if (!paymentResult.success) {
            setPlaceError(paymentResult.error || "Payment failed. Please try again.");
            setIsPlacing(false);
            return;
        }

        const orderPayload = {
            items: items.map(({ productId, title, price, size, quantity, image }) => ({
                productId,
                title,
                price,
                size,
                quantity,
                image,
            })),
            shippingInfo,
            payment: { method: paymentInfo.method, status: "paid", transactionId: paymentResult.transactionId },
            subtotal,
            tax,
            shipping,
            total,
        };

        const orderResult = await dispatch(placeOrder(orderPayload));
        setIsPlacing(false);

        if (orderResult.success) {
            dispatch(clearCart());
            navigate(`/order-confirmation/${orderResult.order.orderNumber}`);
        } else {
            setPlaceError(orderResult.error || "Failed to place order. Please try again.");
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <CheckoutSteps current={step} />

            <div className="checkout-page__layout">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <ShippingStep
                            key="shipping"
                            initialData={shippingInfo}
                            onNext={(data) => {
                                setShippingInfo(data);
                                setStep(2);
                            }}
                        />
                    )}
                    {step === 2 && (
                        <PaymentStep
                            key="payment"
                            initialData={paymentInfo}
                            onBack={() => setStep(1)}
                            onNext={(data) => {
                                setPaymentInfo(data);
                                setStep(3);
                            }}
                        />
                    )}
                    {step === 3 && (
                        <ReviewStep
                            key="review"
                            shippingInfo={shippingInfo}
                            paymentInfo={paymentInfo}
                            items={items}
                            subtotal={subtotal}
                            tax={tax}
                            shipping={shipping}
                            total={total}
                            onBack={() => setStep(2)}
                            onPlaceOrder={handlePlaceOrder}
                            isPlacing={isPlacing}
                            placeError={placeError}
                        />
                    )}
                </AnimatePresence>

                <div className="checkout-page__summary">
                    <h4>Order Total</h4>
                    {items.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="review-item">
                            <span>
                                {item.title} × {item.quantity}
                            </span>
                        </div>
                    ))}
                    <div className="review-item review-item--total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
