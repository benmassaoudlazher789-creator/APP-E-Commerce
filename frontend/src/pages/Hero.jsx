import { motion } from "framer-motion";
import "./Home.css";

const SNEAKER_IMAGE =
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1786474418/Screenshot_2026-08-11_195026_cdfkwh.png";

function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <div className="hero-eyebrow">
                    <span className="hero-eyebrow__label">Nouvelle Collection</span>
                </div>
                <h1 className="hero-title">
                    Step Up Your Game <br /> With Red Store!
                </h1>
                <p className="hero-description">
                    Discover our latest Red Store sneakers — designed in-house for style and built for performance.
                </p>
                <button type="button" className="hero-btn">
                    Shop Now &rarr;
                </button>
            </div>

            <div className="hero-image-container">
                <motion.img
                    src={SNEAKER_IMAGE}
                    alt="Red Store sneaker"
                    className="hero-image"
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>
        </section>
    );
}

export default Hero;
