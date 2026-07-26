const STEPS = ["Shipping", "Payment", "Review"];

function CheckoutSteps({ current }) {
    return (
        <div className="checkout-steps">
            {STEPS.map((label, i) => {
                const step = i + 1;
                const state = step === current ? "active" : step < current ? "done" : "";
                return (
                    <div key={label} className={`checkout-steps__item checkout-steps__item--${state}`}>
                        <span className="checkout-steps__dot">{step < current ? "✓" : step}</span>
                        <span className="checkout-steps__label">{label}</span>
                        {step < STEPS.length && <span className="checkout-steps__line" />}
                    </div>
                );
            })}
        </div>
    );
}

export default CheckoutSteps;
