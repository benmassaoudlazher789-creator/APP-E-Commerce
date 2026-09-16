import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedLink from "./AnimatedLink";
import SocialLinks from "./SocialLinks";
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
                    <AnimatedLink href="#">All Shoes</AnimatedLink>
                    <AnimatedLink href="#">New Arrivals</AnimatedLink>
                    <AnimatedLink href="#">Cart</AnimatedLink>
                </div>

                <div className="red-footer__col">
                    <h4>Company</h4>
                    <AnimatedLink to="/about">About Us</AnimatedLink>
                    <AnimatedLink to="/contact">Contact</AnimatedLink>
                    <AnimatedLink href="#">Returns &amp; Shipping</AnimatedLink>
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
                    <SocialLinks className="red-footer__social" />
                </div>
            </div>
            <div className="red-footer__bottom">
                <p className="text-small">©2026 RedStore. Tous droits réservés.</p>
            </div>
        </footer>
    );
}

export default Footer;
