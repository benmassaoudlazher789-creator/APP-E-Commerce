import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
        setEmail("");
    };

    return (
        <footer className="red-footer">
            <div className="red-footer__container">
                <div className="red-footer__col">
                    <h3 className="red-footer__brand">
                        RED<span>STORE</span>
                    </h3>
                    <p className="text-small red-footer__muted">
                        Premium sneakers &amp; shoes, delivered to your door.
                    </p>
                </div>

                <div className="red-footer__col">
                    <h4>Shop</h4>
                    <Link to="/shop">All Shoes</Link>
                    <Link to="/shop">New Arrivals</Link>
                    <Link to="/cart">Cart</Link>
                </div>

                <div className="red-footer__col">
                    <h4>Company</h4>
                    <Link to="/">About Us</Link>
                    <Link to="/">Contact</Link>
                    <Link to="/">Returns &amp; Shipping</Link>
                </div>

                <div className="red-footer__col red-footer__newsletter">
                    <h4>Stay in the loop</h4>
                    <p className="text-small red-footer__muted">
                        Get new drops and offers in your inbox.
                    </p>
                    {subscribed ? (
                        <p className="red-footer__thanks">Thanks for subscribing!</p>
                    ) : (
                        <form className="red-footer__form" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit">Subscribe</button>
                        </form>
                    )}
                    <div className="red-footer__social">
                        <a href="#" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M14 9h3V6h-3c-1.66 0-3 1.34-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9c0-.55.45-1 1-1Z"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M21 5.5c-.7.3-1.5.6-2.2.7.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1a4 4 0 0 0-6.8 3.6A11.3 11.3 0 0 1 3 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 3.9c-.6.2-1.2.2-1.7.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.4a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.3-6 11.3-11.3v-.5c.8-.6 1.4-1.3 1.9-2.1Z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="red-footer__bottom">
                <p className="text-small">©2026 RedStore. Tous droits réservés.</p>
            </div>
        </footer>
    );
}

export default Footer;
